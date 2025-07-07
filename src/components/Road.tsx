import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

interface RoadProps {
  speed: number
}

export function Road({ speed }: RoadProps) {
  const roadSegments = useRef<Array<{ x: number; z: number; id: number }>>([])
  const nextId = useRef(0)
  
  // Positions des voies (5 voies de large)
  const lanePositions = [-4, -2, 0, 2, 4]
  
  // Initialiser les segments de route
  if (roadSegments.current.length === 0) {
    for (let i = 0; i < 50; i++) {
      for (const laneX of lanePositions) {
        roadSegments.current.push({
          x: laneX,
          z: i * 4,
          id: nextId.current++
        })
      }
    }
  }
  
  useFrame((_, delta) => {
    // Déplacer tous les segments vers l'avant (pour simuler l'avancement du joueur)
    roadSegments.current.forEach(segment => {
      segment.z += speed * delta
    })
    
    // Supprimer les segments trop loin devant et en ajouter de nouveaux derrière
    roadSegments.current = roadSegments.current.filter(segment => segment.z < 220)
    
    // Trouver la position Z la plus en arrière pour chaque voie
    const minZ = Math.min(...roadSegments.current.map(s => s.z))
    if (minZ > -20) {
      for (const laneX of lanePositions) {
        roadSegments.current.push({
          x: laneX,
          z: minZ - 4,
          id: nextId.current++
        })
      }
    }
  })
  
  return (
    <group>
      {roadSegments.current.map(segment => (
        <RoadSegment key={segment.id} position={[segment.x, 0, segment.z]} />
      ))}
    </group>
  )
}

function RoadSegment({ position }: { position: [number, number, number] }) {
  const { scene } = useGLTF('/model/Toy Car/Models/GLB format/track-road-wide-straight.glb')
  return <primitive object={scene.clone()} position={position} />
}
