import { Bloom, ChromaticAberration, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { AdditiveBlending, Color, MathUtils, Vector2 } from 'three'
import { useSimulationStore } from '../../store/useSimulationStore'

function FloatingParticles({ mode, pulse }) {
  const pointsRef = useRef(null)
  const positions = useMemo(() => {
    const values = new Float32Array(1200)

    for (let index = 0; index < values.length; index += 3) {
      values[index] = MathUtils.randFloatSpread(28)
      values[index + 1] = MathUtils.randFloatSpread(18)
      values[index + 2] = MathUtils.randFloat(-24, 10)
    }

    return values
  }, [])

  useFrame((_, delta) => {
    if (!pointsRef.current) {
      return
    }

    const speed = mode === 'alert' ? 0.11 : mode === 'focus' ? 0.07 : 0.04
    pointsRef.current.rotation.y += delta * speed
    pointsRef.current.material.opacity = MathUtils.lerp(pointsRef.current.material.opacity, mode === 'alert' ? 1 : 0.86, 0.08)
    pointsRef.current.position.z = Math.sin(performance.now() * 0.0002) * 0.8
    pointsRef.current.scale.setScalar(1 + Math.sin(pulse + performance.now() * 0.003) * 0.02)
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color="#00ff88"
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.95}
        blending={AdditiveBlending}
      />
    </points>
  )
}

function WireTunnel({ mode, pulse }) {
  const groupRef = useRef(null)

  useFrame(({ pointer }, delta) => {
    if (!groupRef.current) {
      return
    }

    const drift = mode === 'alert' ? 0.14 : mode === 'focus' ? 0.09 : 0.05
    groupRef.current.rotation.z += delta * drift
    groupRef.current.rotation.x = MathUtils.lerp(groupRef.current.rotation.x, pointer.y * 0.08, 0.04)
    groupRef.current.rotation.y = MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.08, 0.04)
    groupRef.current.position.y = MathUtils.lerp(groupRef.current.position.y, -1.4 + Math.sin(pulse + performance.now() * 0.004) * 0.08, 0.06)
  })

  return (
    <group ref={groupRef} position={[0, -1.4, -6]}>
      {[-6, -1, 4].map((depth, index) => (
        <mesh key={depth} position={[0, 0.5 - index * 0.3, depth]} rotation={[Math.PI / 2.7, 0, 0]}>
          <torusGeometry args={[7 + index * 0.6, 0.025, 12, 80]} />
          <meshBasicMaterial color={index === 1 ? '#00d4ff' : '#00ff88'} transparent opacity={0.28 + index * 0.08} />
        </mesh>
      ))}
      <gridHelper args={[100, 50, new Color('#00ff88'), new Color('#00301c')]} position={[0, -4.8, 0]} />
    </group>
  )
}

function HolographicMonolith({ mode }) {
  const meshRef = useRef(null)

  useFrame((state, delta) => {
    if (!meshRef.current) {
      return
    }

    meshRef.current.rotation.y += delta * (mode === 'alert' ? 0.35 : 0.16)
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.25
    meshRef.current.material.opacity = MathUtils.lerp(meshRef.current.material.opacity, mode === 'stabilized' ? 0.46 : 0.28, 0.06)
  })

  return (
    <mesh ref={meshRef} position={[5, 1.5, -5]}>
      <icosahedronGeometry args={[1.2, 0]} />
      <meshBasicMaterial color="#00d4ff" wireframe transparent opacity={0.28} />
    </mesh>
  )
}

export function CyberScene() {
  const mode = useSimulationStore((state) => state.mode)
  const pulse = useSimulationStore((state) => state.pulse)
  const bloomIntensity = mode === 'alert' ? 2.1 : mode === 'stabilized' ? 1.7 : mode === 'focus' ? 1.45 : 1.3
  const noiseOpacity = mode === 'alert' ? 0.08 : 0.035

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 14], fov: 48 }} dpr={[1, 1.5]}>
        <color attach="background" args={['#020812']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 8]} intensity={0.45} color="#00ff88" />
        <directionalLight position={[-6, 3, 4]} intensity={0.25} color="#00d4ff" />
        <FloatingParticles mode={mode} pulse={pulse} />
        <WireTunnel mode={mode} pulse={pulse} />
        <HolographicMonolith mode={mode} />
        <EffectComposer>
          <Bloom mipmapBlur luminanceThreshold={0.18} intensity={bloomIntensity} radius={0.65} />
          <ChromaticAberration offset={new Vector2(0.0008, 0.0014)} />
          <Noise opacity={noiseOpacity} />
          <Vignette eskil={false} offset={0.18} darkness={0.72} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
