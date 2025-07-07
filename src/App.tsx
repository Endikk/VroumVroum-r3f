import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Suspense, useState, useRef, useEffect } from 'react'
import './App.css'
import GameScene from './components/GameScene'
import ProfessionalGameUI from './components/ProfessionalGameUI'

function App() {
  const [currentSpeed, setCurrentSpeed] = useState(0)
  const [lapCount, setLapCount] = useState(0)
  const [isOffTrack, setIsOffTrack] = useState(false)
  const [bestLapTime, setBestLapTime] = useState<number | undefined>()
  const [currentLapTime, setCurrentLapTime] = useState<number | undefined>()
  const [collisionCount, setCollisionCount] = useState(0)
  const [rpm] = useState(0)
  const [gear] = useState(1)
  const [enginePower] = useState(0)
  const lapStartTime = useRef<number>(Date.now())

  const handleLapComplete = (newLapCount: number) => {
    const lapEndTime = Date.now()
    const lapTimeInSeconds = (lapEndTime - lapStartTime.current) / 1000
    
    // Mettre à jour le meilleur temps si c'est le premier tour ou si c'est mieux
    if (!bestLapTime || lapTimeInSeconds < bestLapTime) {
      setBestLapTime(lapTimeInSeconds)
    }
    
    // Redémarrer le chrono pour le prochain tour
    lapStartTime.current = lapEndTime
    setCurrentLapTime(0)
    setLapCount(newLapCount)
  }

  const handleCollision = (collisionType: 'wall' | 'barrier', force: number) => {
    setCollisionCount(prev => prev + 1)
    console.log(`🚗💥 Collision avec ${collisionType} ! Force: ${force.toFixed(2)}`)
    
    // Vous pouvez ajouter des effets sonores ou visuels ici
    // Par exemple: jouer un son de collision
  }

  // Mettre à jour le temps de tour actuel
  useEffect(() => {
    const interval = setInterval(() => {
      if (lapCount > 0 || currentSpeed > 5) { // Commencer à chronométrer quand on bouge
        const currentTime = (Date.now() - lapStartTime.current) / 1000
        setCurrentLapTime(currentTime)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [lapCount, currentSpeed])

  return (
    <div className="app">
      <Canvas
        camera={{ 
          position: [0, 4, 10], 
          fov: 75
        }}
        shadows
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          {/* Éclairage professionnel pour circuit F1 */}
          <ambientLight intensity={0.4} color="#f0f8ff" />
          
          {/* Soleil principal */}
          <directionalLight
            position={[50, 50, 25]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[4096, 4096]}
            shadow-camera-left={-100}
            shadow-camera-right={100}
            shadow-camera-top={100}
            shadow-camera-bottom={-100}
            shadow-camera-near={0.1}
            shadow-camera-far={200}
            color="#ffffff"
          />
          
          {/* Éclairage d'appoint pour les virages */}
          <spotLight 
            position={[0, 20, 100]} 
            intensity={0.8} 
            angle={Math.PI / 4}
            penumbra={0.5}
            castShadow
            color="#ffeb3b"
          />
          <spotLight 
            position={[-50, 20, 150]} 
            intensity={0.8} 
            angle={Math.PI / 4}
            penumbra={0.5}
            castShadow
            color="#ffeb3b"
          />
          
          {/* Éclairage pour l'épingle */}
          <pointLight position={[-90, 15, 150]} intensity={1.2} color="#ff9800" />
          
          {/* Éclairage du pont */}
          <pointLight position={[0, 15, 200]} intensity={1.0} color="#2196f3" />
          
          {/* Environnement réaliste */}
          <Environment 
            preset="city"
            background
            blur={0.8}
          />
          
          {/* Brouillard pour la profondeur */}
          <fog attach="fog" args={['#87CEEB', 100, 300]} />
          
          {/* Scène avec le circuit */}
          <GameScene 
            onSpeedChange={setCurrentSpeed}
            onLapComplete={handleLapComplete}
            onOffTrack={setIsOffTrack}
            onCollision={handleCollision}
          />
        </Suspense>
      </Canvas>
      
      {/* Interface utilisateur avec informations de course complètes */}
      <ProfessionalGameUI 
        speed={currentSpeed}
        lapCount={lapCount}
        isOffTrack={isOffTrack}
        bestLapTime={bestLapTime}
        currentLapTime={currentLapTime}
        collisionCount={collisionCount}
        rpm={rpm}
        gear={gear}
        enginePower={enginePower}
        position={1}
        totalRacers={1}
      />
    </div>
  )
}

export default App