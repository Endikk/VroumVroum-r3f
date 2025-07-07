import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SimpleRoadProps {
  speed: number
}

export function SimpleRoad({ speed }: SimpleRoadProps) {
  const roadRef = useRef<THREE.Group>(null)
  const offsetZ = useRef(0)
  
  // Configuration de la route
  const ROAD_WIDTH = 12
  const ROAD_LENGTH = 300
  const LANE_COUNT = 5
  const LANE_WIDTH = ROAD_WIDTH / LANE_COUNT
  
  // Matériaux optimisés
  const roadMaterial = useMemo(() => 
    new THREE.MeshLambertMaterial({ 
      color: 0x404040,
      transparent: false
    }), []
  )
  
  const lineMaterial = useMemo(() => 
    new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.9
    }), []
  )
  
  const grassMaterial = useMemo(() => 
    new THREE.MeshLambertMaterial({ 
      color: 0x2d5016 
    }), []
  )
  
  useFrame((_, delta) => {
    if (roadRef.current) {
      // Déplacer la route vers l'avant
      offsetZ.current += speed * delta
      
      // Créer un effet de boucle infinie
      if (offsetZ.current >= 20) {
        offsetZ.current -= 20
      }
      
      roadRef.current.position.z = offsetZ.current
    }
  })
  
  // Créer la géométrie de la route une seule fois
  const roadGeometry = useMemo(() => {
    return new THREE.PlaneGeometry(ROAD_WIDTH, ROAD_LENGTH)
  }, [])
  
  const grassGeometry = useMemo(() => {
    return new THREE.PlaneGeometry(40, ROAD_LENGTH)
  }, [])
  
  // Créer les lignes de voie
  const laneLines = useMemo(() => {
    const lines = []
    
    // Lignes centrales (discontinues)
    for (let i = 1; i < LANE_COUNT; i++) {
      const x = (i - LANE_COUNT / 2) * LANE_WIDTH
      
      // Créer des segments de ligne discontinue
      for (let z = -ROAD_LENGTH / 2; z < ROAD_LENGTH / 2; z += 4) {
        if ((z / 4) % 2 === 0) { // Ligne discontinue
          lines.push({
            key: `lane-${i}-${z}`,
            position: [x, 0.01, z] as [number, number, number],
            args: [0.1, 0.01, 2] as [number, number, number]
          })
        }
      }
    }
    
    // Bordures de route (continues)
    const borderPositions = [
      [-ROAD_WIDTH / 2 - 0.2, 0.01, 0],
      [ROAD_WIDTH / 2 + 0.2, 0.01, 0]
    ]
    
    borderPositions.forEach((pos, index) => {
      lines.push({
        key: `border-${index}`,
        position: pos as [number, number, number],
        args: [0.4, 0.02, ROAD_LENGTH] as [number, number, number]
      })
    })
    
    return lines
  }, [])
  
  return (
    <group ref={roadRef}>
      {/* Sol d'herbe */}
      <mesh 
        position={[0, -0.05, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        material={grassMaterial}
        geometry={grassGeometry}
      />
      
      {/* Route principale */}
      <mesh 
        position={[0, 0, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        material={roadMaterial}
        geometry={roadGeometry}
        receiveShadow
      />
      
      {/* Lignes de voie et bordures */}
      {laneLines.map(line => (
        <mesh 
          key={line.key}
          position={line.position}
          material={lineMaterial}
        >
          <boxGeometry args={line.args} />
        </mesh>
      ))}
      
      {/* Effets visuels supplémentaires */}
      <RoadDecorations />
    </group>
  )
}

function RoadDecorations() {
  const decorations = useMemo(() => {
    const items = []
    
    // Quelques éléments décoratifs sur les côtés
    for (let i = 0; i < 10; i++) {
      const side = Math.random() > 0.5 ? 1 : -1
      items.push({
        key: `tree-${i}`,
        position: [side * (8 + Math.random() * 5), 0, (i - 5) * 30] as [number, number, number],
        color: 0x1a4d1a,
        scale: 0.5 + Math.random() * 0.5
      })
    }
    
    return items
  }, [])
  
  return (
    <group>
      {decorations.map(item => (
        <mesh key={item.key} position={item.position} scale={item.scale}>
          <coneGeometry args={[1, 2, 6]} />
          <meshLambertMaterial color={item.color} />
        </mesh>
      ))}
    </group>
  )
}
