import { useRef, useState } from 'react'
import { Physics } from '@react-three/rapier'
import * as THREE from 'three'
import RaceTrack from './RaceTrack'
import RealisticF1Car from './RealisticF1Car'
import CameraController from './CameraController'
import TrackManager from './TrackManager'
import ParticleSystem from './ParticleSystem'

interface GameSceneProps {
  onSpeedChange?: (speed: number) => void
  onLapComplete?: (lapCount: number) => void
  onOffTrack?: (isOffTrack: boolean) => void
  onCollision?: (collisionType: 'wall' | 'barrier', force: number) => void
}

export default function GameScene({ onSpeedChange, onLapComplete, onOffTrack, onCollision }: GameSceneProps) {
  const carRef = useRef<THREE.Group>(null)
  const [lapCount, setLapCount] = useState(0)
  const [currentCheckpoint, setCurrentCheckpoint] = useState(0)
  const [currentSpeed, setCurrentSpeed] = useState(0)
  const [isOffTrack, setIsOffTrack] = useState(false)

  const handleLapComplete = () => {
    const newLapCount = lapCount + 1
    setLapCount(newLapCount)
    if (onLapComplete) {
      onLapComplete(newLapCount)
    }
  }

  const handleSpeedChange = (speed: number) => {
    setCurrentSpeed(speed)
    if (onSpeedChange) onSpeedChange(speed)
  }

  const handleOffTrack = (offTrack: boolean) => {
    setIsOffTrack(offTrack)
    if (onOffTrack) onOffTrack(offTrack)
  }

  return (
    <Physics gravity={[0, -9.81, 0]} debug={false}>
      <group>
        {/* Circuit simple et visible pour le débogage */}
        <RaceTrack currentCheckpoint={currentCheckpoint} />

        {/* Voiture de Formule 1 réaliste - positionnée au début du circuit */}
        <RealisticF1Car carRef={carRef} onSpeedChange={handleSpeedChange} onCollision={onCollision} />
        
        {/* Système de particules pour les effets visuels */}
        <ParticleSystem carRef={carRef} speed={currentSpeed} isOnTrack={!isOffTrack} />
        
        {/* Gestionnaire de circuit */}
        <TrackManager 
          carRef={carRef} 
          onLapComplete={handleLapComplete}
          onOffTrack={handleOffTrack}
          onCheckpointChange={setCurrentCheckpoint}
        />
        
        {/* Contrôleur de caméra qui suit la voiture */}
        <CameraController target={carRef} />
      </group>
    </Physics>
  )
}
