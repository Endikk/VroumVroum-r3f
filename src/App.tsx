import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Suspense } from 'react'
import './App.css'

// Composants du jeu
import { PlayerCar } from './components/PlayerCar'
import { OpponentCar, useOpponentCars } from './components/OpponentCar'
import { Road } from './components/Road'
import { GameUI } from './components/GameUI'
import { useGameLogic } from './hooks/useGameLogic'

// Composant principal du jeu
function RacingGame() {
  const {
    gameState,
    checkCollision,
    updatePlayerPosition,
    restart,
    pause,
    resume
  } = useGameLogic()

  const { updateCars, removeCar, getCars } = useOpponentCars(
    gameState.speed,
    gameState.difficulty
  )

  // Mise à jour des voitures adversaires
  if (!gameState.isGameOver && !gameState.isPaused) {
    updateCars(0.016) // Approximation du deltaTime
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
      
      {/* Interface utilisateur */}
      <GameUI
        gameState={gameState}
        onRestart={restart}
        onPause={pause}
        onResume={resume}
      />
    </>
  )
}

function App() {
  return (
    <div className="app">
      <Canvas 
        camera={{ 
          position: [0, 8, 12], 
          fov: 75,
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
          <RacingGame />
          
          {/* Contrôles de caméra (optionnel pour le debug) */}
          {/* <OrbitControls 
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={50}
            maxPolarAngle={Math.PI / 2}
          /> */}
        </Suspense>
      </Canvas>
    </div>
  )
}

export default App

