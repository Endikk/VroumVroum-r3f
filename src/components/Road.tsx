import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

interface RoadProps {
  speed: number
}

export function Road({ speed }: RoadProps) {
  const roadSegments = useRef<Array<{ z: number; id: number }>>([])
  const nextId = useRef(0)
  
  // Initialiser les segments de route
  if (roadSegments.current.length === 0) {
    for (let i = 0; i < 50; i++) {
      roadSegments.current.push({
        z: i * 4,
        id: nextId.current++
      })
    }
  }
  
  useFrame((_, delta) => {
    // Déplacer tous les segments vers l'arrière
    roadSegments.current.forEach(segment => {
      segment.z -= speed * delta
    })
    
    // Supprimer les segments trop loin derrière et en ajouter de nouveaux devant
    roadSegments.current = roadSegments.current.filter(segment => segment.z > -20)
    
    const lastSegment = roadSegments.current[roadSegments.current.length - 1]
    if (lastSegment && lastSegment.z < 200) {
      roadSegments.current.push({
        z: lastSegment.z + 4,
        id: nextId.current++
      })
    }
  })
  
  return (
    <group>
      {roadSegments.current.map(segment => (
        <RoadSegment key={segment.id} position={[0, 0, segment.z]} />
      ))}
    </group>
  )
}

function RoadSegment({ position }: { position: [number, number, number] }) {
  const { scene } = useGLTF('/model/Toy Car/Models/GLB format/track-road-wide-straight.glb')
  return <primitive object={scene.clone()} position={position} />
}
