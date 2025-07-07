import { useState, useCallback, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

interface GameState {
  score: number
  speed: number
  difficulty: number
  isGameOver: boolean
  isPaused: boolean
  distance: number
}

export function useGameLogic() {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    speed: 15,
    difficulty: 0,
    isGameOver: false,
    isPaused: false,
    distance: 0
  })
  
  const playerPosition = useRef({ x: 0, z: 0 })
  const gameTime = useRef(0)
  
  // Fonction de collision
  const checkCollision = useCallback((carPosition: [number, number, number]) => {
    const dx = Math.abs(carPosition[0] - playerPosition.current.x)
    const dz = Math.abs(carPosition[2] - playerPosition.current.z)
    
    // Collision si les voitures sont très proches
    if (dx < 1.5 && dz < 2) {
      setGameState(prev => ({ ...prev, isGameOver: true }))
      return true
    }
    return false
  }, [])
  
  // Mise à jour de la position du joueur
  const updatePlayerPosition = useCallback((x: number) => {
    playerPosition.current.x = x
  }, [])
  
  // Update du jeu
  useFrame((_, delta) => {
    if (gameState.isGameOver || gameState.isPaused) return
    
    gameTime.current += delta
    
    setGameState(prev => {
      const newDistance = prev.distance + prev.speed * delta
      const newScore = Math.floor(newDistance / 10) // 1 point tous les 10 mètres
      const newDifficulty = Math.floor(newDistance / 500) // Difficulté augmente tous les 500m
      const newSpeed = 15 + newDifficulty * 2 // Vitesse augmente avec la difficulté
      
      return {
        ...prev,
        score: newScore,
        speed: newSpeed,
        difficulty: newDifficulty,
        distance: newDistance
      }
    })
  })
  
  // Contrôles du jeu
  const restart = useCallback(() => {
    setGameState({
      score: 0,
      speed: 15,
      difficulty: 0,
      isGameOver: false,
      isPaused: false,
      distance: 0
    })
    gameTime.current = 0
    playerPosition.current = { x: 0, z: 0 }
  }, [])
  
  const pause = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: true }))
  }, [])
  
  const resume = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: false }))
  }, [])
  
  return {
    gameState,
    checkCollision,
    updatePlayerPosition,
    restart,
    pause,
    resume
  }
}
