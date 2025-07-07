import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

interface PhysicsCheckpointProps {
  position: [number, number, number]
  isActive?: boolean
  onTrigger?: () => void
}

export default function PhysicsCheckpoint({ position, isActive = false, onTrigger }: PhysicsCheckpointProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      // Animation de rotation
      meshRef.current.rotation.y += 0.02
      
      // Animation de pulse pour le checkpoint actif
      if (isActive) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.2
        meshRef.current.scale.setScalar(scale)
      } else {
        meshRef.current.scale.setScalar(1)
      }
    }
  })

  const handleCollisionEnter = (event: any) => {
    const { other } = event
    
    // Vérifier si c'est la voiture qui traverse le checkpoint
    if (other.rigidBodyObject?.userData?.type === 'car' && onTrigger) {
      onTrigger()
    }
  }

  return (
    <group position={position}>
      {/* Zone de détection invisible */}
      <RigidBody
        type="fixed"
        sensor={true}
        onIntersectionEnter={handleCollisionEnter}
        userData={{ type: 'checkpoint' }}
      >
        <mesh visible={false}>
          <boxGeometry args={[6, 4, 2]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </RigidBody>
      
      {/* Porte de checkpoint visuelle */}
      <mesh ref={meshRef} position={[0, 2, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 4, 8]} />
        <meshStandardMaterial 
          color={isActive ? "#00ff00" : "#ffff00"} 
          emissive={isActive ? "#004400" : "#444400"}
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Support gauche */}
      <mesh position={[-3, 1, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 2, 8]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      
      {/* Support droit */}
      <mesh position={[3, 1, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 2, 8]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      
      {/* Barre horizontale */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 6, 8]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      {/* Particules pour l'effet visuel */}
      {isActive && (
        <>
          <mesh position={[-2, 2, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial 
              color="#00ff88" 
              transparent 
              opacity={0.6}
            />
          </mesh>
          <mesh position={[2, 2, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial 
              color="#00ff88" 
              transparent 
              opacity={0.6}
            />
          </mesh>
        </>
      )}
    </group>
  )
}
