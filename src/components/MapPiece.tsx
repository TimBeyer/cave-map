import React, { useRef, useMemo } from 'react'
import { Canvas, useLoader, useFrame, useResource } from 'react-three-fiber'
import * as THREE from 'three'
import _STLLoader from 'three-stl-loader';

const CAVE_GEOMETRY_SCALE_FACTOR = 5;

const STLLoader = _STLLoader(THREE);

export const MapPiece: React.FC<{ fileName: string, dataUrl: string }> = (props) => {
  const meshRef = useRef<THREE.Mesh>()
  const geometry = useLoader<THREE.Geometry>(STLLoader, props.dataUrl)
  const [, mesh] = useResource(meshRef)

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry} scale={[CAVE_GEOMETRY_SCALE_FACTOR, CAVE_GEOMETRY_SCALE_FACTOR, CAVE_GEOMETRY_SCALE_FACTOR]}>
        <meshPhongMaterial attach="material" color={0xffffff} side={THREE.DoubleSide} />
      </mesh>
      {mesh && <boxHelper args={[mesh]} />}
    </group>
  )
}
