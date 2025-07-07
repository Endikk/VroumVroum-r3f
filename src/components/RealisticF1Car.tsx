import { useRef, useEffect, useState } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { RigidBody, useRapier } from '@react-three/rapier'
import { GLTFLoader } from 'three-stdlib'
import * as THREE from 'three'

const gltfPath = '/model/ferrari_f1_2019/scene.gltf'

interface RealisticF1CarProps {
  carRef?: React.RefObject<THREE.Group | null>
  onSpeedChange?: (speed: number) => void
  onCollision?: (collisionType: 'wall' | 'barrier', force: number) => void
}

export default function RealisticF1Car({ carRef: externalCarRef, onSpeedChange, onCollision }: RealisticF1CarProps) {
  const internalCarRef = useRef<THREE.Group>(null)
  const carRef = externalCarRef || internalCarRef
  const rigidBodyRef = useRef<any>(null)
  useRapier()
  
  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    leftward: false,
    rightward: false,
    brake: false,
    boost: false
  })
  
  // Chargement du modèle Ferrari F1 2019
  const gltf = useLoader(GLTFLoader, gltfPath)

  // Variables physiques réalistes pour une F1
  const enginePower = useRef(0) // 0-100% power
  const steeringAngle = useRef(0) // -1 à 1
  const currentSpeed = useRef(0)
  const rpm = useRef(0)
  const gear = useRef(1)
  const wheelSpin = useRef(0)
  const downforce = useRef(0)
  const collisionEffect = useRef(0)
  const wheelRefs = useRef<THREE.Mesh[]>([])

  // Propriétés physiques F1
  const carSpecs = {
    mass: 740, // Poids minimal F1 (kg)
    maxPower: 1000, // HP
    maxTorque: 320, // N⋅m à 10500 rpm
    maxRPM: 15000,
    wheelBase: 3.6, // empattement (m)
    trackWidth: 2.0, // voie (m)
    dragCoefficient: 0.7,
    downforceCoefficient: 1.5,
    tyreMu: 1.8, // coefficient de friction des pneus F1
    brakingForce: 6000 // Force de freinage (N)
  }

  // Centrer le modèle au chargement
  useEffect(() => {
    if (gltf) {
      const box = new THREE.Box3().setFromObject(gltf.scene)
      const center = box.getCenter(new THREE.Vector3())
      gltf.scene.position.sub(center)
      gltf.scene.position.y += 0.15

      // Référencer les roues pour animation
      gltf.scene.traverse((child) => {
        if (child.name.toLowerCase().includes('wheel') || child.name.toLowerCase().includes('tire')) {
          wheelRefs.current.push(child as THREE.Mesh)
        }
      })
    }
  }, [gltf])

  // Gestion des contrôles avancés
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          setKeys(prev => ({ ...prev, forward: true }))
          break
        case 'ArrowDown':
        case 'KeyS':
          setKeys(prev => ({ ...prev, backward: true }))
          break
        case 'ArrowLeft':
        case 'KeyA':
          setKeys(prev => ({ ...prev, leftward: true }))
          break
        case 'ArrowRight':
        case 'KeyD':
          setKeys(prev => ({ ...prev, rightward: true }))
          break
        case 'Space':
          event.preventDefault()
          setKeys(prev => ({ ...prev, brake: true }))
          break
        case 'ShiftLeft':
        case 'ShiftRight':
          setKeys(prev => ({ ...prev, boost: true }))
          break
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          setKeys(prev => ({ ...prev, forward: false }))
          break
        case 'ArrowDown':
        case 'KeyS':
          setKeys(prev => ({ ...prev, backward: false }))
          break
        case 'ArrowLeft':
        case 'KeyA':
          setKeys(prev => ({ ...prev, leftward: false }))
          break
        case 'ArrowRight':
        case 'KeyD':
          setKeys(prev => ({ ...prev, rightward: false }))
          break
        case 'Space':
          setKeys(prev => ({ ...prev, brake: false }))
          break
        case 'ShiftLeft':
        case 'ShiftRight':
          setKeys(prev => ({ ...prev, boost: false }))
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Physique réaliste F1
  useFrame((_, delta) => {
    if (!rigidBodyRef.current || !carRef.current) return

    const { forward, backward, leftward, rightward, brake, boost } = keys
    const body = rigidBodyRef.current
    
    // Calcul de la vitesse actuelle
    const velocity = body.linvel()
    const speed = Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z)
    currentSpeed.current = speed
    const speedKmH = speed * 3.6

    // Calcul du RPM basé sur la vitesse
    rpm.current = Math.min((speedKmH / 300) * carSpecs.maxRPM, carSpecs.maxRPM)

    // Gestion des vitesses automatique
    if (speedKmH < 60) gear.current = 1
    else if (speedKmH < 120) gear.current = 2
    else if (speedKmH < 180) gear.current = 3
    else if (speedKmH < 240) gear.current = 4
    else if (speedKmH < 300) gear.current = 5
    else gear.current = 6

    // Callback de vitesse
    if (onSpeedChange) {
      onSpeedChange(speedKmH)
    }

    // Calcul de la puissance moteur
    if (forward) {
      const targetPower = boost ? 100 : 85 // DRS ou boost mode
      enginePower.current = Math.min(enginePower.current + delta * 150, targetPower)
    } else if (backward) {
      enginePower.current = Math.max(enginePower.current - delta * 200, -30)
    } else {
      enginePower.current *= 0.95 // Décélération moteur
    }

    // Calcul de la force de propulsion
    const powerFactor = enginePower.current / 100
    const rpmFactor = Math.sin((rpm.current / carSpecs.maxRPM) * Math.PI) // Courbe de couple
    const tractionForce = powerFactor * rpmFactor * carSpecs.maxTorque * 8

    // Direction avec aide électronique
    const maxSteeringAngle = 0.8
    const steeringResponse = Math.max(0.3, 1 - (speedKmH / 250)) // Moins sensible à haute vitesse
    
    if (leftward) {
      steeringAngle.current = Math.min(steeringAngle.current + delta * 4 * steeringResponse, maxSteeringAngle)
    } else if (rightward) {
      steeringAngle.current = Math.max(steeringAngle.current - delta * 4 * steeringResponse, -maxSteeringAngle)
    } else {
      steeringAngle.current *= 0.9 // Retour au centre
    }

    // Calcul de l'appui aérodynamique (downforce)
    downforce.current = carSpecs.downforceCoefficient * speed * speed * 0.1

    // Application des forces
    const rotation = body.rotation()
    const quaternion = new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w)
    const forwardDirection = new THREE.Vector3(0, 0, 1).applyQuaternion(quaternion)
    
    // Force de traction
    if (Math.abs(tractionForce) > 0.1) {
      const force = forwardDirection.multiplyScalar(tractionForce)
      body.addForce({ x: force.x, y: 0, z: force.z }, true)
    }

    // Freinage
    if (brake) {
      const brakeForce = Math.min(carSpecs.brakingForce, speed * 500)
      const brakeVector = forwardDirection.multiplyScalar(-brakeForce)
      body.addForce({ x: brakeVector.x, y: 0, z: brakeVector.z }, true)
    }

    // Direction avec physique réaliste
    if (Math.abs(steeringAngle.current) > 0.01 && speed > 1) {
      const steeringForce = steeringAngle.current * Math.min(speed, 20) * 0.5
      body.addTorqueImpulse({ x: 0, y: steeringForce, z: 0 }, true)
    }

    // Appui aérodynamique
    if (downforce.current > 0) {
      body.addForce({ x: 0, y: -downforce.current, z: 0 }, true)
    }

    // Résistance de l'air
    const airResistance = carSpecs.dragCoefficient * speed * speed * 0.01
    const airResistanceVector = new THREE.Vector3(-velocity.x, 0, -velocity.z).normalize().multiplyScalar(airResistance)
    body.addForce({ x: airResistanceVector.x, y: 0, z: airResistanceVector.z }, true)

    // Animation des roues
    wheelSpin.current += speed * delta * 0.5
    wheelRefs.current.forEach(wheel => {
      if (wheel) {
        wheel.rotation.x = wheelSpin.current
        // Animation de la direction pour les roues avant
        if (wheel.name.toLowerCase().includes('front')) {
          wheel.rotation.y = steeringAngle.current * 0.3
        }
      }
    })

    // Effets de collision
    collisionEffect.current *= 0.95

    // Effet de tremblement lors des collisions
    if (collisionEffect.current > 0) {
      const shakeIntensity = collisionEffect.current * 0.1
      const randomForce = {
        x: (Math.random() - 0.5) * shakeIntensity,
        y: 0,
        z: (Math.random() - 0.5) * shakeIntensity
      }
      body.addForce(randomForce, true)
    }
  })

  // Gestionnaire de collision amélioré
  const handleCollisionEnter = (event: any) => {
    const { other } = event
    
    if (other.rigidBodyObject?.userData?.type === 'barrier' || 
        other.rigidBodyObject?.userData?.type === 'wall') {
      const collisionForce = currentSpeed.current
      collisionEffect.current = Math.min(collisionForce * 0.2, 1.0)
      
      // Dommages à la voiture basés sur la vitesse
      const damage = Math.min(collisionForce * 0.1, 50)
      
      if (onCollision) {
        onCollision(other.rigidBodyObject.userData.type, collisionForce)
      }

      // Effet de particules et son (simulé)
      console.log(`💥 Collision! Vitesse: ${(currentSpeed.current * 3.6).toFixed(1)} km/h, Dommages: ${damage.toFixed(1)}%`)
    }
  }

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={[0, 2, -40]}
      mass={carSpecs.mass}
      type="dynamic"
      colliders="hull"
      friction={carSpecs.tyreMu}
      restitution={0.1}
      onCollisionEnter={handleCollisionEnter}
      userData={{ type: 'f1car' }}
      linearDamping={0.1}
      angularDamping={0.5}
    >
      <group ref={carRef}>
        <primitive 
          object={gltf.scene} 
          scale={0.35} 
          rotation={[0, Math.PI, 0]}
          castShadow
          receiveShadow
        />
        
        {/* Effet de flammes d'échappement */}
        {enginePower.current > 80 && (
          <group position={[0, 0.1, -1.2]}>
            <mesh>
              <coneGeometry args={[0.05, 0.3, 8]} />
              <meshBasicMaterial 
                color="#ff6600" 
                transparent 
                opacity={0.8}
              />
            </mesh>
            <mesh position={[0.3, 0, 0]}>
              <coneGeometry args={[0.05, 0.3, 8]} />
              <meshBasicMaterial 
                color="#ff6600" 
                transparent 
                opacity={0.8}
              />
            </mesh>
          </group>
        )}
        
        {/* Effet de collision */}
        {collisionEffect.current > 0 && (
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshBasicMaterial 
              color="#ff4444" 
              transparent 
              opacity={collisionEffect.current * 0.6}
            />
          </mesh>
        )}

        {/* Indicateurs visuels */}
        <group position={[0, 1.5, 0]}>
          {/* Indicateur de vitesse */}
          <mesh position={[-1, 0, 0]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshBasicMaterial 
              color={currentSpeed.current > 30 ? "#ff0000" : "#00ff00"} 
            />
          </mesh>
          {/* Indicateur de vitesse */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshBasicMaterial 
              color={gear.current > 3 ? "#ffff00" : "#0000ff"} 
            />
          </mesh>
        </group>
      </group>
    </RigidBody>
  )
}
