import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface CameraControllerProps {
  target: React.RefObject<THREE.Group | null>
}

export default function CameraController({ target }: CameraControllerProps) {
  const { camera } = useThree()
  const cameraPosition = useRef(new THREE.Vector3())
  const targetPosition = useRef(new THREE.Vector3())
  
  // Configuration de la caméra third-person
  const cameraOffset = new THREE.Vector3(0, 3, -8) // Position relative derrière la voiture
  const lookAtOffset = new THREE.Vector3(0, 1, 0) // Point à regarder sur la voiture

  useFrame(() => {
    if (!target.current) return

    // Obtenir la position et rotation actuelles de la voiture
    const carPosition = target.current.position
    const carRotation = target.current.rotation

    // Calculer la position de la caméra basée sur la rotation de la voiture
    const rotatedOffset = cameraOffset.clone()
    rotatedOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), carRotation.y)
    
    // Position cible de la caméra (directement derrière la voiture)
    targetPosition.current.copy(carPosition).add(rotatedOffset)

    // Mise à jour directe de la position (sans interpolation lente qui cause l'éloignement)
    camera.position.copy(targetPosition.current)

    // Point vers lequel la caméra regarde
    const lookAtTarget = carPosition.clone().add(lookAtOffset)
    camera.lookAt(lookAtTarget)

    // Mise à jour de la matrice de la caméra
    camera.updateProjectionMatrix()
  })

  // Initialiser la position de la caméra
  useEffect(() => {
    if (target.current) {
      const initialPosition = target.current.position.clone().add(cameraOffset)
      cameraPosition.current.copy(initialPosition)
      camera.position.copy(initialPosition)
    }
  }, [camera, target])

  return null
}
