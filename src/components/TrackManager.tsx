import { useRef, useEffect } from 'react'
import * as THREE from 'three'

interface TrackBounds {
  checkpoints: THREE.Vector3[]
  boundaries: {
    inner: THREE.Vector3[]
    outer: THREE.Vector3[]
  }
}

interface TrackManagerProps {
  carRef: React.RefObject<THREE.Group | null>
  onLapComplete?: () => void
  onOffTrack?: (isOffTrack: boolean) => void
  onCheckpointChange?: (checkpoint: number) => void
}

export default function TrackManager({ carRef, onLapComplete, onOffTrack, onCheckpointChange }: TrackManagerProps) {
  const currentCheckpoint = useRef(0)
  const lastCheckTime = useRef(0)
  
  // Définir les checkpoints du circuit simple rectangulaire
  const trackBounds: TrackBounds = {
    checkpoints: [
      new THREE.Vector3(0, 0, -40),    // Ligne de départ/arrivée
      new THREE.Vector3(45, 0, 0),     // Section 1 - côté droit  
      new THREE.Vector3(0, 0, 45),     // Section 2 - haut du circuit
      new THREE.Vector3(-45, 0, 0),    // Section 3 - côté gauche
    ],
    boundaries: {
      // Limites intérieures du circuit (zone centrale)
      inner: [
        new THREE.Vector3(-30, 0, -30),
        new THREE.Vector3(-30, 0, 30),
        new THREE.Vector3(30, 0, 30),
        new THREE.Vector3(30, 0, -30),
        new THREE.Vector3(-30, 0, -30),
      ],
      // Limites extérieures du circuit simple
      outer: [
        new THREE.Vector3(-70, 0, -70),
        new THREE.Vector3(-70, 0, 70),
        new THREE.Vector3(70, 0, 70),
        new THREE.Vector3(70, 0, -70),
        new THREE.Vector3(-70, 0, -70),
      ]
    }
  }

  useEffect(() => {
    const checkPosition = () => {
      if (!carRef.current) return

      const carPosition = carRef.current.position.clone()
      
      // Vérifier les checkpoints
      const currentCheckpointPos = trackBounds.checkpoints[currentCheckpoint.current]
      const distanceToCheckpoint = carPosition.distanceTo(currentCheckpointPos)
      
      if (distanceToCheckpoint < 25) { // Distance de déclenchement du checkpoint élargie
        const now = Date.now()
        if (now - lastCheckTime.current > 2000) { // Éviter les déclenchements multiples
          currentCheckpoint.current = (currentCheckpoint.current + 1) % trackBounds.checkpoints.length
          lastCheckTime.current = now
          
          // Notifier le changement de checkpoint
          if (onCheckpointChange) {
            onCheckpointChange(currentCheckpoint.current)
          }
          
          // Si on revient au checkpoint 0, c'est un tour complet
          if (currentCheckpoint.current === 0 && onLapComplete) {
            onLapComplete()
          }
        }
      }

      // Vérifier si la voiture est sur le circuit
      const isOnTrack = isPositionOnTrack(carPosition, trackBounds)
      if (onOffTrack) {
        onOffTrack(!isOnTrack)
      }
    }

    const interval = setInterval(checkPosition, 100) // Vérifier toutes les 100ms
    return () => clearInterval(interval)
  }, [carRef, onLapComplete, onOffTrack, onCheckpointChange])

  return null // Ce composant ne rend rien, il gère juste la logique
}

// Fonction pour vérifier si une position est sur le circuit
function isPositionOnTrack(position: THREE.Vector3, bounds: TrackBounds): boolean {
  // Vérifier si la position est dans les limites extérieures mais pas dans les limites intérieures
  const isInsideOuter = isPointInPolygon(position, bounds.boundaries.outer)
  const isInsideInner = isPointInPolygon(position, bounds.boundaries.inner)
  
  return isInsideOuter && !isInsideInner
}

// Fonction pour vérifier si un point est dans un polygone (algorithme ray casting)
function isPointInPolygon(point: THREE.Vector3, polygon: THREE.Vector3[]): boolean {
  let inside = false
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x
    const zi = polygon[i].z
    const xj = polygon[j].x
    const zj = polygon[j].z
    
    if (((zi > point.z) !== (zj > point.z)) &&
        (point.x < (xj - xi) * (point.z - zi) / (zj - zi) + xi)) {
      inside = !inside
    }
  }
  
  return inside
}

export { TrackManager }
