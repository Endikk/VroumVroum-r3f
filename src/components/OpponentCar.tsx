import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Group, Box3, Object3D, Mesh } from 'three'

// Fonction utilitaire pour activer les ombres récursivement
function enableShadows(object: Object3D) {
  object.traverse((child) => {
    if ((child as Mesh).isMesh) {
      const mesh = child as Mesh
      mesh.castShadow = true
      mesh.receiveShadow = true
    }
  })
}

interface OpponentCarProps {
  position: [number, number, number]
  speed: number
  model: string
  onRemove: () => void
  onCollision: (carPosition: [number, number, number], collisionBox?: Box3) => void
}

export function OpponentCar({ position, speed, model, onRemove, onCollision }: OpponentCarProps) {
  const carRef = useRef<Group>(null)
  const { scene } = useGLTF(`/model/Toy Car/Models/GLB format/${model}.glb`)
  
  const currentPosition = useRef(position)
  const collisionBox = useRef(new Box3())
  
  // Activer les ombres sur le modèle lors du chargement
  useEffect(() => {
    if (scene) {
      enableShadows(scene)
    }
  }, [scene])
  
  useEffect(() => {
    if (carRef.current) {
      enableShadows(carRef.current)
    }
  }, [scene])
  
  useFrame((_, delta) => {
    if (carRef.current) {
      // Mouvement vers l'avant (dépassement du joueur)
      currentPosition.current[2] += speed * delta
      carRef.current.position.set(...currentPosition.current)
      
      // Calculer la boîte de collision en temps réel
      collisionBox.current.setFromObject(carRef.current)
      
      // Supprimer la voiture si elle est trop loin devant
      if (currentPosition.current[2] > 100) {
        onRemove()
      }
      
      // Vérifier collision avec le joueur (position approximative du joueur: z=0)
      // Zone de collision étendue pour capturer le joueur même en mouvement
      if (currentPosition.current[2] <= 3 && currentPosition.current[2] >= -3) {
        onCollision(currentPosition.current, collisionBox.current)
      }
    }
  })

  return (
    <group ref={carRef} position={position}>
      <primitive object={scene.clone()} scale={0.8} rotation={[0, Math.PI, 0]} />
    </group>
  )
}

// Hook pour gérer la liste des voitures adversaires
export function useOpponentCars() {
  const cars = useRef<Array<{
    id: number
    position: [number, number, number]
    speed: number
    model: string
  }>>([])
  
  const nextId = useRef(0)
  const spawnTimer = useRef(0)
  
  const carModels = useMemo(() => [
    'vehicle-speedster',
    'vehicle-suv', 
    'vehicle-truck',
    'vehicle-vintage-racer',
    'vehicle-monster-truck'
  ], [])
  
  const spawnCar = (gameSpeed: number, difficulty: number) => {
    // Nouvelles positions des voies pour correspondre à SimpleRoad
    const lanes = [-4.8, -2.4, 0, 2.4, 4.8] // 5 voies espacées de 2.4 unités
    const randomLane = lanes[Math.floor(Math.random() * lanes.length)]
    const randomModel = carModels[Math.floor(Math.random() * carModels.length)]
    
    cars.current.push({
      id: nextId.current++,
      position: [randomLane, 0.1, -50], // Spawn derrière le joueur
      speed: gameSpeed + Math.random() * 8 + difficulty * 2,
      model: randomModel
    })
  }
  
  const updateCars = (delta: number, gameSpeed: number, difficulty: number) => {
    spawnTimer.current += delta
    
    // Fréquence de spawn basée sur la difficulté (plus agressive)
    const spawnFrequency = Math.max(0.5 - difficulty * 0.1, 0.15)
    
    if (spawnTimer.current > spawnFrequency) {
      spawnCar(gameSpeed, difficulty)
      spawnTimer.current = 0
    }
  }
  
  const removeCar = (id: number) => {
    cars.current = cars.current.filter(car => car.id !== id)
  }
  
  const getCars = () => cars.current
  
  const resetCars = () => {
    cars.current = []
    nextId.current = 0
    spawnTimer.current = 0
  }
  
  return { updateCars, removeCar, getCars, resetCars }
}
