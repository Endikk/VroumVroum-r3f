import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Sky() {
  const skyRef = useRef<THREE.Mesh>(null)

  // Créer un dégradé de ciel
  const skyGeometry = new THREE.SphereGeometry(100, 32, 32)
  
  // Shader personnalisé pour un ciel réaliste
  const skyMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      sunPosition: { value: new THREE.Vector3(15, 12, -10) }
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 sunPosition;
      varying vec3 vWorldPosition;
      
      void main() {
        vec3 direction = normalize(vWorldPosition);
        float height = direction.y;
        
        // Couleurs du ciel
        vec3 skyColor = mix(
          vec3(0.5, 0.7, 1.0),      // Bleu ciel
          vec3(1.0, 0.8, 0.6),      // Orange horizon
          1.0 - smoothstep(0.0, 0.4, height)
        );
        
        // Distance au soleil
        float sunDistance = distance(direction, normalize(sunPosition));
        float sunGlow = 1.0 - smoothstep(0.0, 0.5, sunDistance);
        
        // Ajouter l'effet du soleil
        vec3 sunColor = vec3(1.0, 0.9, 0.7);
        skyColor = mix(skyColor, sunColor, sunGlow * 0.3);
        
        gl_FragColor = vec4(skyColor, 1.0);
      }
    `,
    side: THREE.BackSide
  })

  useFrame((state) => {
    if (skyRef.current && skyRef.current.material instanceof THREE.ShaderMaterial) {
      skyRef.current.material.uniforms.time.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh ref={skyRef} geometry={skyGeometry} material={skyMaterial} />
  )
}
