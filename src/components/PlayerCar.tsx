import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Group } from 'three'

interface PlayerCarProps {
  position: [number, number, number]
  onPositionChange: (x: number) => void
}

export function PlayerCar({ position, onPositionChange }: PlayerCarProps) {
  const carRef = useRef<Group>(null)
  const { scene } = useGLTF('/model/Toy Car/Models/GLB format/vehicle-racer.glb')
  
  const targetX = useRef(position[0])
  const currentX = useRef(position[0])
  const currentLane = useRef(2) // Commence sur la voie centrale (index 2 = position 0)
  
  // Voies disponibles (mêmes que la route)
  const lanes = [-4, -2, 0, 2, 4]
  
  // Gestion des contrôles clavier
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentLane.current > 0) {
            currentLane.current--
            targetX.current = lanes[currentLane.current]
          }
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentLane.current < lanes.length - 1) {
            currentLane.current++
            targetX.current = lanes[currentLane.current]
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Animation fluide du mouvement
  useFrame((_, delta) => {
    if (carRef.current) {
      // Interpolation smooth vers la position cible
      const lerpSpeed = 10
      currentX.current += (targetX.current - currentX.current) * lerpSpeed * delta
      
      carRef.current.position.x = currentX.current
      carRef.current.position.y = position[1]
      carRef.current.position.z = position[2]
      
      // Légère rotation pour l'effet de virage
      const rotationAngle = (targetX.current - currentX.current) * 0.3
      carRef.current.rotation.z = rotationAngle
      
      // Callback pour la gestion des collisions
      onPositionChange(currentX.current)
    }
  })

  return (
    <group ref={carRef} position={position}>
      <primitive object={scene.clone()} scale={0.8} />
    </group>
  )
}
