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
  const ROAD_LENGTH = 400 // Augmenté pour une meilleure fluidité
  
  // Matériaux optimisés
  const roadMaterial = useMemo(() => 
    new THREE.MeshLambertMaterial({ 
      color: 0x404040,
      transparent: false
    }), []
  )
  
  const grassMaterial = useMemo(() => 
    new THREE.MeshLambertMaterial({ 
      color: 0x2d5016 
    }), []
  )
  
  useFrame((_, delta) => {
    if (roadRef.current) {
      // Déplacer la route vers l'avant de manière continue et stable
      offsetZ.current += speed * delta
      
      // Créer un effet de boucle infinie sans saut visible
      if (offsetZ.current >= 100) {
        offsetZ.current = 0
      }
      
      roadRef.current.position.z = offsetZ.current
    }
  })
  
  // Créer la géométrie de la route une seule fois
  const roadGeometry = useMemo(() => {
    return new THREE.PlaneGeometry(ROAD_WIDTH, ROAD_LENGTH)
  }, [ROAD_WIDTH, ROAD_LENGTH])
    const grassGeometry = useMemo(() => {
    return new THREE.PlaneGeometry(40, ROAD_LENGTH)
  }, [ROAD_LENGTH])

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
      
      {/* Effets visuels supplémentaires */}
      <RoadDecorations />
    </group>
  )
}

function RoadDecorations() {
  const decorations = useMemo(() => {
    const items = []
    
    // Quelques éléments décoratifs fixes sur les côtés
    for (let i = 0; i < 10; i++) {
      const side = i % 2 === 0 ? 1 : -1
      items.push({
        key: `tree-${i}`,
        position: [side * 10, 0, i * 100 - 500] as [number, number, number],
        color: 0x1a4d1a,
        scale: 0.8
      })
    }
    
    return items
  }, [])
  
  return (
    <group>
      {decorations.map(item => (
        <mesh 
          key={item.key} 
          position={item.position} 
          scale={item.scale}
          castShadow={true}
          receiveShadow={true}
        >
          <coneGeometry args={[1, 2, 6]} />
          <meshLambertMaterial color={item.color} />
        </mesh>
      ))}
    </group>
  )
}
