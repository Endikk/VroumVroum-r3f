import { useState, useCallback, useRef } from 'react'
import { Box3 } from 'three'

type AppState = 'menu' | 'playing' | 'credits'

interface GameState {
  score: number
  speed: number
  difficulty: number
  isGameOver: boolean
  isPaused: boolean
  distance: number
}

export function useGameLogic() {
  const [appState, setAppState] = useState<AppState>('menu')
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    speed: 15,
    difficulty: 0,
    isGameOver: false,
    isPaused: false,
    distance: 0
  })
  
  const playerPosition = useRef({ x: 0, z: 0 })
  const playerCollisionBox = useRef<Box3 | null>(null)
  const gameTime = useRef(0)
  
  // Fonction de collision améliorée avec detection plus précise
  const checkCollision = useCallback((carPosition: [number, number, number], opponentBox?: Box3) => {
    const dx = Math.abs(carPosition[0] - playerPosition.current.x)
    const dz = Math.abs(carPosition[2] - playerPosition.current.z)
    
    // Si nous avons des boîtes de collision réelles, les utiliser
    if (playerCollisionBox.current && opponentBox) {
      const collisionDetected = playerCollisionBox.current.intersectsBox(opponentBox)
      if (collisionDetected) {
        setGameState(prev => ({ ...prev, isGameOver: true }))
        return true
      }
    } else {
      // Fallback vers la détection simple mais plus précise
      const carWidth = 1.0   // Largeur d'une voiture (réduite pour être plus strict)
      const carLength = 2.0  // Longueur d'une voiture (réduite pour être plus strict)
      
      // Collision si les boîtes de collision se chevauchent
      const collisionDetected = dx < carWidth && dz < carLength
      
      if (collisionDetected) {
        setGameState(prev => ({ ...prev, isGameOver: true }))
        return true
      }
    }
    return false
  }, [])
  
  // Mise à jour de la position du joueur (x et z)
  const updatePlayerPosition = useCallback((x: number, z: number) => {
    playerPosition.current.x = x
    playerPosition.current.z = z
  }, [])
  
  // Mise à jour de la boîte de collision du joueur
  const updatePlayerCollisionBox = useCallback((box: Box3) => {
    playerCollisionBox.current = box.clone()
  }, [])
  
  // Update du jeu (sera appelé depuis un composant à l'intérieur du Canvas)
  const updateGame = useCallback((delta: number) => {
    if (gameState.isGameOver || gameState.isPaused) return
    
    gameTime.current += delta
    
    setGameState(prev => {
      const newDistance = prev.distance + prev.speed * delta
      const newScore = Math.floor(newDistance / 10) // 1 point tous les 10 mètres
      const newDifficulty = Math.floor(newDistance / 200) // Difficulté augmente tous les 200m (plus rapide)
      const newSpeed = 15 + newDifficulty * 4 // Vitesse augmente plus rapidement avec la difficulté
      
      return {
        ...prev,
        score: newScore,
        speed: newSpeed,
        difficulty: newDifficulty,
        distance: newDistance
      }
    })
  }, [gameState.isGameOver, gameState.isPaused])
  
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

  // Navigation du menu
  const startGame = useCallback(() => {
    setAppState('playing')
    restart()
  }, [])

  const showCredits = useCallback(() => {
    setAppState('credits')
  }, [])

  const backToMenu = useCallback(() => {
    setAppState('menu')
  }, [])

  return {
    appState,
    gameState,
    checkCollision,
    updatePlayerPosition,
    updatePlayerCollisionBox,
    updateGame,
    restart,
    pause,
    resume,
    startGame,
    showCredits,
    backToMenu
  }
}
