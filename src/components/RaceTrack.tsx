import { RigidBody } from '@react-three/rapier'
import PhysicsCheckpoint from './PhysicsCheckpoint'

interface RaceTrackProps {
  currentCheckpoint?: number
}

export default function RaceTrack({ currentCheckpoint = 0 }: RaceTrackProps) {
  
  return (
    <group>
      {/* Sol principal très visible et large */}
      <RigidBody type="fixed" colliders="cuboid" position={[0, -2, 0]}>
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[300, 4, 300]} />
          <meshStandardMaterial color="#228B22" />
        </mesh>
      </RigidBody>

      {/* Piste principale très visible - circuit rectangulaire simple */}
      <group>
        {/* Ligne droite gauche */}
        <RigidBody type="fixed" colliders="cuboid" position={[-50, 0.5, 0]}>
          <mesh position={[0, 0, 0]} receiveShadow castShadow>
            <boxGeometry args={[10, 1, 100]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
        </RigidBody>

        {/* Ligne droite droite */}
        <RigidBody type="fixed" colliders="cuboid" position={[50, 0.5, 0]}>
          <mesh position={[0, 0, 0]} receiveShadow castShadow>
            <boxGeometry args={[10, 1, 100]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
        </RigidBody>

        {/* Ligne droite du haut */}
        <RigidBody type="fixed" colliders="cuboid" position={[0, 0.5, 50]}>
          <mesh position={[0, 0, 0]} receiveShadow castShadow>
            <boxGeometry args={[100, 1, 10]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
        </RigidBody>

        {/* Ligne droite du bas */}
        <RigidBody type="fixed" colliders="cuboid" position={[0, 0.5, -50]}>
          <mesh position={[0, 0, 0]} receiveShadow castShadow>
            <boxGeometry args={[100, 1, 10]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
        </RigidBody>
      </group>

      {/* Barrières rouges très visibles */}
      <group>
        {/* Barrières extérieures gauches */}
        <RigidBody type="fixed" colliders="cuboid" position={[-65, 2, 0]} userData={{ type: 'barrier' }}>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[5, 4, 110]} />
            <meshStandardMaterial color="#FF0000" />
          </mesh>
        </RigidBody>

        {/* Barrières extérieures droites */}
        <RigidBody type="fixed" colliders="cuboid" position={[65, 2, 0]} userData={{ type: 'barrier' }}>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[5, 4, 110]} />
            <meshStandardMaterial color="#FF0000" />
          </mesh>
        </RigidBody>

        {/* Barrières extérieures haut */}
        <RigidBody type="fixed" colliders="cuboid" position={[0, 2, 65]} userData={{ type: 'barrier' }}>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[110, 4, 5]} />
            <meshStandardMaterial color="#FF0000" />
          </mesh>
        </RigidBody>

        {/* Barrières extérieures bas */}
        <RigidBody type="fixed" colliders="cuboid" position={[0, 2, -65]} userData={{ type: 'barrier' }}>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[110, 4, 5]} />
            <meshStandardMaterial color="#FF0000" />
          </mesh>
        </RigidBody>

        {/* Barrières intérieures pour délimiter la piste */}
        <RigidBody type="fixed" colliders="cuboid" position={[-35, 1, 0]} userData={{ type: 'barrier' }}>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[2, 2, 80]} />
            <meshStandardMaterial color="#FFFF00" />
          </mesh>
        </RigidBody>

        <RigidBody type="fixed" colliders="cuboid" position={[35, 1, 0]} userData={{ type: 'barrier' }}>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[2, 2, 80]} />
            <meshStandardMaterial color="#FFFF00" />
          </mesh>
        </RigidBody>

        <RigidBody type="fixed" colliders="cuboid" position={[0, 1, 35]} userData={{ type: 'barrier' }}>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[80, 2, 2]} />
            <meshStandardMaterial color="#FFFF00" />
          </mesh>
        </RigidBody>

        <RigidBody type="fixed" colliders="cuboid" position={[0, 1, -35]} userData={{ type: 'barrier' }}>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[80, 2, 2]} />
            <meshStandardMaterial color="#FFFF00" />
          </mesh>
        </RigidBody>
      </group>

      {/* Lignes de départ blanches */}
      <group>
        <mesh position={[0, 1.1, -45]} receiveShadow>
          <boxGeometry args={[10, 0.1, 2]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0, 1.1, -40]} receiveShadow>
          <boxGeometry args={[10, 0.1, 1]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0, 1.1, -35]} receiveShadow>
          <boxGeometry args={[10, 0.1, 2]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* Checkpoints visibles */}
      <PhysicsCheckpoint 
        position={[0, 1, -40]} 
        isActive={currentCheckpoint === 0} 
      />
      <PhysicsCheckpoint 
        position={[45, 1, 0]} 
        isActive={currentCheckpoint === 1} 
      />
      <PhysicsCheckpoint 
        position={[0, 1, 45]} 
        isActive={currentCheckpoint === 2} 
      />
      <PhysicsCheckpoint 
        position={[-45, 1, 0]} 
        isActive={currentCheckpoint === 3} 
      />

      {/* Éléments décoratifs très visibles */}
      <group>
        {/* Cônes de signalisation orange */}
        <mesh position={[20, 1, -60]} castShadow>
          <coneGeometry args={[1, 2, 8]} />
          <meshStandardMaterial color="#FF8800" />
        </mesh>
        <mesh position={[-20, 1, -60]} castShadow>
          <coneGeometry args={[1, 2, 8]} />
          <meshStandardMaterial color="#FF8800" />
        </mesh>
        <mesh position={[60, 1, 20]} castShadow>
          <coneGeometry args={[1, 2, 8]} />
          <meshStandardMaterial color="#FF8800" />
        </mesh>
        <mesh position={[60, 1, -20]} castShadow>
          <coneGeometry args={[1, 2, 8]} />
          <meshStandardMaterial color="#FF8800" />
        </mesh>

        {/* Poteaux d'éclairage */}
        <mesh position={[30, 8, -30]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 16]} />
          <meshStandardMaterial color="#666666" />
        </mesh>
        <mesh position={[-30, 8, -30]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 16]} />
          <meshStandardMaterial color="#666666" />
        </mesh>
        <mesh position={[30, 8, 30]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 16]} />
          <meshStandardMaterial color="#666666" />
        </mesh>
        <mesh position={[-30, 8, 30]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 16]} />
          <meshStandardMaterial color="#666666" />
        </mesh>
      </group>
    </group>
  )
}
