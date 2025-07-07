import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'

export function Sun() {
  const sunRef = useRef<THREE.Mesh>(null)
  const sunGlowRef = useRef<THREE.Mesh>(null)

  // Animation douce de rotation du soleil
  useFrame((state) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.001
      sunRef.current.rotation.x += 0.0005
    }
    if (sunGlowRef.current) {
      // Effet de pulsation pour l'aura
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
      sunGlowRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group position={[15, 12, -10]}>
      {/* Soleil principal */}
      <Sphere ref={sunRef} args={[1.5, 32, 32]}>
        <meshStandardMaterial 
          color="#FDB813" 
          toneMapped={false}
          emissive="#FDB813"
          emissiveIntensity={0.5}
        />
      </Sphere>
      
      {/* Aura du soleil */}
      <Sphere ref={sunGlowRef} args={[2.5, 32, 32]}>
        <meshBasicMaterial 
          color="#FFD700" 
          transparent 
          opacity={0.2}
          toneMapped={false}
        />
      </Sphere>
      
      {/* Rayons de soleil (optionnel) */}
      <group rotation={[0, 0, 0]}>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh 
            key={i} 
            rotation={[0, 0, (Math.PI * 2 * i) / 8]}
            position={[0, 0, 0]}
          >
            <boxGeometry args={[0.05, 4, 0.05]} />
            <meshBasicMaterial 
              color="#FFE135" 
              transparent 
              opacity={0.3}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
      
      {/* Lumière directionnelle principale du soleil - éclairage du dessus */}
      <directionalLight
        position={[5, 15, 2]} // Position plus haute et légèrement décalée
        target-position={[0, 0, 0]} // Pointe vers le centre de la scène
        color="#FFF8DC"
        intensity={2.5} // Intensité plus forte pour des ombres marquées
        castShadow
        shadow-mapSize={[4096, 4096]} // Résolution d'ombre plus élevée
        shadow-camera-far={100}
        shadow-camera-near={0.1}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.0001} // Réduit les artefacts d'ombre
      />
      
      {/* Lumière secondaire pour adoucir les ombres */}
      <directionalLight
        position={[-3, 8, 5]}
        color="#FFE4B5"
        intensity={0.8}
        castShadow={false} // Pas d'ombre pour cette lumière de remplissage
      />
      
      {/* Lumière d'ambiance chaude pour l'atmosphère générale */}
      <pointLight
        position={[0, 5, 0]}
        color="#FFE4B5"
        intensity={0.3}
        distance={50}
        decay={2}
      />
    </group>
  )
}
