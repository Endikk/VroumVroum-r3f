import { RigidBody } from '@react-three/rapier'

interface PhysicsGroundProps {
  position?: [number, number, number]
  size?: [number, number, number]
}

export default function PhysicsGround({ 
  position = [0, -0.5, 0], 
  size = [200, 1, 200] 
}: PhysicsGroundProps) {
  return (
    <RigidBody
      position={position}
      type="fixed"
      colliders="cuboid"
      userData={{ type: 'ground' }}
      friction={0.8}
    >
      <mesh visible={false}>
        <boxGeometry args={size} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </RigidBody>
  )
}
