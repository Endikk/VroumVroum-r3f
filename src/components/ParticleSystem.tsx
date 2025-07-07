import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticleSystemProps {
  carRef: React.RefObject<THREE.Group | null>
  speed: number
  isOnTrack: boolean
}

export default function ParticleSystem({ carRef, speed, isOnTrack }: ParticleSystemProps) {
  const exhaustParticlesRef = useRef<THREE.Points>(null)
  const dustParticlesRef = useRef<THREE.Points>(null)
  const sparkParticlesRef = useRef<THREE.Points>(null)
  
  // Système de particules d'échappement
  const exhaustSystem = useMemo(() => {
    const count = 100
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const ages = new Float32Array(count)
    const sizes = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = 0
      velocities[i * 3] = (Math.random() - 0.5) * 0.2
      velocities[i * 3 + 1] = Math.random() * 0.3
      velocities[i * 3 + 2] = -Math.random() * 2 - 1
      ages[i] = Math.random()
      sizes[i] = Math.random() * 0.5 + 0.1
    }
    
    return { positions, velocities, ages, sizes, count }
  }, [])
  
  // Système de particules de poussière
  const dustSystem = useMemo(() => {
    const count = 50
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const ages = new Float32Array(count)
    const sizes = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = 0
      velocities[i * 3] = (Math.random() - 0.5) * 1
      velocities[i * 3 + 1] = Math.random() * 0.5
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 1
      ages[i] = Math.random()
      sizes[i] = Math.random() * 0.3 + 0.05
    }
    
    return { positions, velocities, ages, sizes, count }
  }, [])
  
  // Système de particules d'étincelles (collisions)
  const sparkSystem = useMemo(() => {
    const count = 30
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const ages = new Float32Array(count)
    const sizes = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = 0
      velocities[i * 3] = (Math.random() - 0.5) * 3
      velocities[i * 3 + 1] = Math.random() * 2
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 3
      ages[i] = Math.random()
      sizes[i] = Math.random() * 0.2 + 0.02
    }
    
    return { positions, velocities, ages, sizes, count }
  }, [])

  useFrame((_, delta) => {
    if (!carRef.current) return

    const carPosition = carRef.current.position
    const carRotation = carRef.current.rotation

    // Mise à jour des particules d'échappement
    if (exhaustParticlesRef.current && speed > 5) {
      const positions = exhaustParticlesRef.current.geometry.attributes.position.array as Float32Array
      const sizes = exhaustParticlesRef.current.geometry.attributes.size?.array as Float32Array
      
      for (let i = 0; i < exhaustSystem.count; i++) {
        // Vieillissement
        exhaustSystem.ages[i] += delta * 2
        
        if (exhaustSystem.ages[i] > 1) {
          // Réinitialiser la particule à la position d'échappement
          const exhaustOffset = new THREE.Vector3(0, 0.1, -1.2).applyEuler(carRotation)
          positions[i * 3] = carPosition.x + exhaustOffset.x
          positions[i * 3 + 1] = carPosition.y + exhaustOffset.y
          positions[i * 3 + 2] = carPosition.z + exhaustOffset.z
          exhaustSystem.ages[i] = 0
        } else {
          // Mouvement des particules
          positions[i * 3] += exhaustSystem.velocities[i * 3] * delta
          positions[i * 3 + 1] += exhaustSystem.velocities[i * 3 + 1] * delta
          positions[i * 3 + 2] += exhaustSystem.velocities[i * 3 + 2] * delta
        }
        
        // Taille basée sur l'âge et la vitesse
        if (sizes) {
          sizes[i] = exhaustSystem.sizes[i] * (1 - exhaustSystem.ages[i]) * (speed / 100)
        }
      }
      
      exhaustParticlesRef.current.geometry.attributes.position.needsUpdate = true
      if (sizes) {
        exhaustParticlesRef.current.geometry.attributes.size.needsUpdate = true
      }
    }

    // Mise à jour des particules de poussière (hors piste)
    if (dustParticlesRef.current && !isOnTrack && speed > 20) {
      const positions = dustParticlesRef.current.geometry.attributes.position.array as Float32Array
      const sizes = dustParticlesRef.current.geometry.attributes.size?.array as Float32Array
      
      for (let i = 0; i < dustSystem.count; i++) {
        dustSystem.ages[i] += delta * 1.5
        
        if (dustSystem.ages[i] > 1) {
          // Réinitialiser près de la voiture
          positions[i * 3] = carPosition.x + (Math.random() - 0.5) * 2
          positions[i * 3 + 1] = carPosition.y + 0.1
          positions[i * 3 + 2] = carPosition.z + (Math.random() - 0.5) * 2
          dustSystem.ages[i] = 0
        } else {
          positions[i * 3] += dustSystem.velocities[i * 3] * delta
          positions[i * 3 + 1] += dustSystem.velocities[i * 3 + 1] * delta
          positions[i * 3 + 2] += dustSystem.velocities[i * 3 + 2] * delta
        }
        
        if (sizes) {
          sizes[i] = dustSystem.sizes[i] * (1 - dustSystem.ages[i]) * (speed / 200)
        }
      }
      
      dustParticlesRef.current.geometry.attributes.position.needsUpdate = true
      if (sizes) {
        dustParticlesRef.current.geometry.attributes.size.needsUpdate = true
      }
    }
  })

  return (
    <group>
      {/* Particules d'échappement */}
      <points ref={exhaustParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[exhaustSystem.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[exhaustSystem.sizes, 1]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          sizeAttenuation
          transparent
          opacity={0.6}
          color="#ff6600"
          vertexColors={false}
        />
      </points>

      {/* Particules de poussière */}
      <points ref={dustParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustSystem.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[dustSystem.sizes, 1]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          sizeAttenuation
          transparent
          opacity={0.4}
          color="#8B4513"
          vertexColors={false}
        />
      </points>

      {/* Particules d'étincelles */}
      <points ref={sparkParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[sparkSystem.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[sparkSystem.sizes, 1]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          sizeAttenuation
          transparent
          opacity={0.8}
          color="#ffff00"
          vertexColors={false}
        />
      </points>
    </group>
  )
}
