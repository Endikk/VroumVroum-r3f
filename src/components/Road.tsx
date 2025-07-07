import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface RoadProps {
  speed: number
}

export function Road({ speed }: RoadProps) {
  const roadRef = useRef<THREE.Group>(null)
  const offsetZ = useRef(0)
  
  // Configuration de la route
  const SEGMENT_LENGTH = 4
  const SEGMENTS_COUNT = 150 // Nombre total de segments
  const LANES_COUNT = 5
  const LANE_WIDTH = 2
  
  // Positions des voies centrées
  const lanePositions = useMemo(() => {
    const lanes = []
    for (let i = 0; i < LANES_COUNT; i++) {
      lanes.push((i - (LANES_COUNT - 1) / 2) * LANE_WIDTH)
    }
    return lanes
  }, [])
  
  // Créer une grille de segments statique
  const roadSegments = useMemo(() => {
    const segments = []
    for (let z = 0; z < SEGMENTS_COUNT; z++) {
      for (let x = 0; x < LANES_COUNT; x++) {
        segments.push({
          id: `${x}-${z}`,
          x: lanePositions[x],
          z: (z - SEGMENTS_COUNT / 2) * SEGMENT_LENGTH,
          laneIndex: x,
          segmentIndex: z
        })
      }
    }
    return segments
  }, [lanePositions])
  
  useFrame((_, delta) => {
    if (roadRef.current) {
      // Déplacer toute la route vers l'avant
      offsetZ.current += speed * delta
      
      // Quand on a avancé d'un segment complet, réinitialiser l'offset
      if (offsetZ.current >= SEGMENT_LENGTH) {
        offsetZ.current -= SEGMENT_LENGTH
      }
      
      // Appliquer l'offset à toute la route
      roadRef.current.position.z = offsetZ.current
    }
  })
  
  return (
    <group ref={roadRef}>
      {/* Sol de base pour éviter les trous */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, SEGMENTS_COUNT * SEGMENT_LENGTH]} />
        <meshLambertMaterial color="#2d5016" />
      </mesh>
      
      {/* Segments de route */}
      {roadSegments.map(segment => (
        <RoadSegment 
          key={segment.id} 
          position={[segment.x, 0, segment.z]} 
        />
      ))}
      
      {/* Lignes de séparation des voies */}
      <RoadLines 
        lanePositions={lanePositions} 
        segmentLength={SEGMENT_LENGTH}
        segmentsCount={SEGMENTS_COUNT}
      />
    </group>
  )
}

function RoadSegment({ position }: { position: [number, number, number] }) {
  const { scene } = useGLTF('/model/Toy Car/Models/GLB format/track-narrow-straight.glb')
  
  // Mémoriser le clone pour éviter de le recréer à chaque render
  const clonedScene = useMemo(() => {
    const clone = scene.clone()
    // Optimisations pour les performances
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = false
        child.receiveShadow = true
        // Réduire la qualité des matériaux si nécessaire
        if (child.material) {
          child.material.needsUpdate = false
        }
      }
    })
    return clone
  }, [scene])
  
  return (
    <primitive 
      object={clonedScene} 
      position={position}
      scale={[0.8, 1, 1]}
    />
  )
}

function RoadLines({ lanePositions, segmentLength, segmentsCount }: {
  lanePositions: number[]
  segmentLength: number
  segmentsCount: number
}) {
  const lineMaterial = useMemo(() => 
    new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.8
    }), []
  )
  
  return (
    <group>
      {/* Lignes centrales entre les voies */}
      {lanePositions.slice(0, -1).map((x, index) => {
        const lineX = x + 1 // Position entre deux voies
        return (
          <group key={`line-${index}`}>
            {/* Créer des segments de ligne discontinue */}
            {Array.from({ length: segmentsCount * 2 }, (_, i) => {
              const z = (i - segmentsCount) * segmentLength / 2
              const isVisible = i % 3 !== 0 // Ligne discontinue
              
              if (!isVisible) return null
              
              return (
                <mesh 
                  key={`line-segment-${i}`}
                  position={[lineX, 0.02, z]}
                  material={lineMaterial}
                >
                  <boxGeometry args={[0.1, 0.01, segmentLength / 4]} />
                </mesh>
              )
            })}
          </group>
        )
      })}
      
      {/* Bordures de la route */}
      {[-6, 6].map((x, index) => (
        <mesh 
          key={`border-${index}`}
          position={[x, 0.02, 0]}
          material={lineMaterial}
        >
          <boxGeometry args={[0.2, 0.02, segmentsCount * segmentLength]} />
        </mesh>
      ))}
    </group>
  )
}
