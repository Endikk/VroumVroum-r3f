import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Suspense } from 'react'
import './App.css'

// Composants du jeu
import { PlayerCar } from './components/PlayerCar'
import { OpponentCar, useOpponentCars } from './components/OpponentCar'
import { Road } from './components/Road'
import { GameUI } from './components/GameUI'
import { useGameLogic } from './hooks/useGameLogic'

// Composant principal du jeu (uniquement les éléments 3D)
function RacingGame({ gameLogic }: { gameLogic: ReturnType<typeof useGameLogic> }) {
  const {
    gameState,
    checkCollision,
    updatePlayerPosition,
    updateGame
  } = gameLogic

  const { updateCars, removeCar, getCars, resetCars } = useOpponentCars()

  // Réinitialiser les voitures quand le jeu redémarre
  if (gameState.score === 0 && gameState.distance === 0) {
    resetCars()
  }

  return (
    <>
      {/* Route */}
      <Road speed={gameState.speed} />
      
      {/* Voiture du joueur */}
      <PlayerCar 
        position={[0, 0.1, 0]} 
        onPositionChange={updatePlayerPosition}
      />
      
      {/* Voitures adversaires */}
      {getCars().map(car => (
        <OpponentCar
          key={car.id}
          position={car.position}
          speed={car.speed}
          model={car.model}
          onRemove={() => removeCar(car.id)}
          onCollision={checkCollision}
        />
      ))}
      
      {/* Gestionnaire de mise à jour du jeu */}
      <GameUpdater 
        updateCars={updateCars}
        updateGame={updateGame}
        gameState={gameState}
      />
    </>
  )
}

// Composant helper pour mettre à jour le jeu avec useFrame
function GameUpdater({ 
  updateCars, 
  updateGame,
  gameState 
}: { 
  updateCars: (delta: number, gameSpeed: number, difficulty: number) => void
  updateGame: (delta: number) => void
  gameState: any
}) {
  useFrame((_, delta) => {
    if (!gameState.isGameOver && !gameState.isPaused) {
      updateGame(delta)
      updateCars(delta, gameState.speed, gameState.difficulty)
    }
  })
  
  return null
}

// Hook pour partager l'état du jeu entre les composants
function useSharedGameState() {
  const gameLogic = useGameLogic()
  return gameLogic
}

function App() {
  const gameLogic = useSharedGameState()

  return (
    <div className="app">
      <Canvas 
        camera={{ 
          position: [0, 5, 8], // Position plus proche et plus basse
          fov: 60, // Champ de vision réduit pour plus de zoom
          near: 0.1,
          far: 1000
        }}
      >
        <Suspense fallback={null}>
          {/* Éclairage optimisé */}
          <ambientLight intensity={0.6} />
          <directionalLight 
            position={[5, 10, 5]} 
            intensity={1}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-5, 5, -5]} intensity={0.3} />
          
          {/* Environnement */}
          <Environment preset="sunset" />
          
          {/* Jeu principal */}
          <RacingGame gameLogic={gameLogic} />
        </Suspense>
      </Canvas>
      
      {/* Interface utilisateur (hors du Canvas) */}
      <GameUI
        gameState={gameLogic.gameState}
        onRestart={gameLogic.restart}
        onPause={gameLogic.pause}
        onResume={gameLogic.resume}
      />
    </div>
  )
}

export default App

