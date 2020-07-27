import React, { useRef, useMemo, useContext, useEffect, useState } from 'react'
import { Canvas, useLoader, useFrame, useResource, useThree } from 'react-three-fiber'
import * as THREE from 'three'
import _STLLoader from 'three-stl-loader';
import { ControlMode } from '../control-mode';
import { Object3D, Box3Helper, BoxHelper } from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls';

import { useStore, storeApi } from '../state'
import { start } from 'repl';

const CAVE_GEOMETRY_SCALE_FACTOR = 5;

const STLLoader = _STLLoader(THREE);

export const MapPiece: React.FC<{ fileName: string, dataUrl: string }> = (props) => {
  const geometry = useLoader<THREE.Geometry>(STLLoader, props.dataUrl)
  const [meshRef, mesh] = useResource<THREE.Mesh>()
  const [groupRef, group] = useResource<Object3D>()
  const [boxRef, box] = useResource<BoxHelper>()
  const [dragControlRef, dragControl] = useResource<DragControls>()
  // const dragControlRef = useRef<DragControls>()
  const controlMode = useStore((state) => state.controlMode)
  const { camera, gl } = useThree()

  useFrame(() => box && box.update())

  const [meshState, setMeshState] = useState<THREE.Mesh[]>([])
  useEffect(() => {
    setMeshState([mesh])
  }, [mesh])

  const { onRepositioningMapPieceStart, onRepositioningMapPieceStop } = useStore()

  useEffect(() => {
    if (!dragControl) {
      return
    }

    const startHandler = () => {
      onRepositioningMapPieceStart()
    }

    const stopHandler = () => {
      onRepositioningMapPieceStop()
    }

    dragControl.addEventListener('dragstart', startHandler)
    dragControl.addEventListener('dragend', stopHandler)
    return () => {
      dragControl.removeEventListener('dragstart', startHandler)
      dragControl.removeEventListener('dragend', stopHandler)
    }
  }, [dragControl, onRepositioningMapPieceStart, onRepositioningMapPieceStop])

  return (
    <React.Fragment key={props.fileName}>
      <dragControls
        ref={dragControlRef}
        enabled={controlMode === ControlMode.EDIT}
        args={[meshState, camera, gl.domElement]}
      />
      <group ref={groupRef}>
        <mesh ref={meshRef} geometry={geometry} scale={[CAVE_GEOMETRY_SCALE_FACTOR, CAVE_GEOMETRY_SCALE_FACTOR, CAVE_GEOMETRY_SCALE_FACTOR]}>
          <meshPhongMaterial attach="material" color={0xffffff} side={THREE.DoubleSide} />
        </mesh>
        {mesh && controlMode === ControlMode.EDIT && <boxHelper ref={boxRef} args={[mesh]} />}
      </group>
    </React.Fragment>
  )
}
