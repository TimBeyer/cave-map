import * as THREE from 'three'
import React, { useRef, useMemo } from 'react'
import { Canvas, useLoader, useFrame } from 'react-three-fiber'

import baseMap from '../assets/caestert-map-4x.jpg';

const MAP_WIDTH = 3000;
const MAP_HEIGHT = 2208;


export const MapPlane: React.FC = (props) => {
  const meshRef = useRef<THREE.Mesh>()
  const texture = useLoader(THREE.TextureLoader, baseMap)
  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry attach="geometry" args={[MAP_WIDTH, MAP_HEIGHT]} />
      <meshBasicMaterial attach="material" map={texture} side={THREE.DoubleSide} />
    </mesh>
  )
}
