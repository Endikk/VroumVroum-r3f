import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Group } from 'three'

interface OpponentCarProps {
  position: [number, number, number]
  speed: number
  model: string
  onRemove: () => void
  onCollision: (carPosition: [number, number, number]) => void
}

export function OpponentCar({ position, speed, model, onRemove, onCollision }: OpponentCarProps) {
  const carRef = useRef<Group>(null)
  const { scene } = useGLTF(`/model/Toy Car/Models/GLB format/${model}.glb`)
  
  const currentPosition = useRef(position)
  
  useFrame((_, delta) => {
    if (carRef.current) {
      // Mouvement vers l'avant (dépassement du joueur)
      currentPosition.current[2] += speed * delta
      carRef.current.position.set(...currentPosition.current)
      
      // Supprimer la voiture si elle est trop loin devant
      if (currentPosition.current[2] > 100) {
        onRemove()
      }
      
      // Vérifier collision avec le joueur (position approximative du joueur: z=0)
      if (currentPosition.current[2] <= 2 && currentPosition.current[2] >= -2) {
        onCollision(currentPosition.current)
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
      speed: gameSpeed + Math.random() * 5 + difficulty,
      model: randomModel
    })
  }
  
  const updateCars = (delta: number, gameSpeed: number, difficulty: number) => {
    spawnTimer.current += delta
    
    // Fréquence de spawn basée sur la difficulté
    const spawnFrequency = Math.max(0.5 - difficulty * 0.05, 0.2)
    
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
