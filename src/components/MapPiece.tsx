import React, { useRef, useMemo, useContext, useEffect, useState } from 'react'
import { Canvas, useLoader, useFrame, useResource, useThree } from 'react-three-fiber'
import * as THREE from 'three'
import _STLLoader from 'three-stl-loader';
import { ControlMode } from '../control-mode';
import { Object3D, Box3Helper, BoxHelper, EventDispatcher } from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

import { useStore, storeApi } from '../state'
import { start } from 'repl';
import { useLocalStorage } from '../hooks';

const CAVE_GEOMETRY_SCALE_FACTOR = 5.1;

function useRepositioningEffect <T extends EventDispatcher>(control: T, onStart: () => void, onStop: () => void) {
  useEffect(() => {
    if (!control) {
      return
    }

    const startHandler = () => {
      onStart()
    }

    const stopHandler = () => {
      onStop()
    }

    control.addEventListener('dragstart', startHandler)
    control.addEventListener('dragend', stopHandler)
    return () => {
      control.removeEventListener('dragstart', startHandler)
      control.removeEventListener('dragend', stopHandler)
    }
  }, [control, onStart, onStop])
}

function useRotateEffect <T extends EventDispatcher>(control: T, onStart: (event: THREE.Event) => void, onStop: (event: THREE.Event) => void) {
  useEffect(() => {
    if (!control) {
      return
    }

    const startHandler = (event: THREE.Event) => {
      onStart(event)
    }

    const stopHandler = (event: THREE.Event) => {
      onStop(event)
    }

    control.addEventListener('mouseDown', startHandler)
    control.addEventListener('mouseUp', stopHandler)
    return () => {
      control.removeEventListener('mouseDown', startHandler)
      control.removeEventListener('mouseUp', stopHandler)
    }
  }, [control, onStart, onStop])
}

const STLLoader = _STLLoader(THREE);

type Position = [number, number, number]
type Rotation = {
  x: number,
  y: number,
  z: number,
  order?: string
}

export const MapPiece: React.FC<{ fileName: string, dataUrl: string }> = (props) => {
  const geometry = useLoader<THREE.Geometry>(STLLoader, props.dataUrl)
  const [meshRef, mesh] = useResource<THREE.Mesh>()
  const [groupRef, group] = useResource<Object3D>()
  const [boxRef, box] = useResource<BoxHelper>()
  const [dragControlRef, dragControl] = useResource<DragControls>()
  const [transformControlRef, transformControl] = useResource<DragControls>()
  const { camera, gl } = useThree()
  const [position, setPosition] = useLocalStorage<Position>(`position:${props.fileName}`, [0, 0, 0])
  const [rotation, setRotation] = useLocalStorage<Rotation>(
    `rotation:${props.fileName}`,
    {
      x: 0,
      y: 0,
      z: 0
    }
  );

  useFrame(() => box && box.update())

  const [meshState, setMeshState] = useState<THREE.Mesh[]>([])
  useEffect(() => {
    setMeshState([mesh])
  }, [mesh])

  const { onRepositioningMapPieceStart, onRepositioningMapPieceStop, controlMode } = useStore()

  useRepositioningEffect(
    dragControl,
    onRepositioningMapPieceStart,
    () => {
      onRepositioningMapPieceStop()
      setPosition([mesh.position.x, mesh.position.y, mesh.position.z]);
    }
  )

  useRotateEffect(
    transformControl,
    onRepositioningMapPieceStart,
    () => {
      const rotation = {
        x: mesh.rotation.x,
        y: mesh.rotation.y,
        z: mesh.rotation.z,
        order: mesh.rotation.order,
      };
      console.log(rotation)
      onRepositioningMapPieceStop()
      setRotation(rotation);
    }
  )

  const isEditMode = controlMode === ControlMode.EDIT

  return (
    <React.Fragment key={props.fileName}>
      { isEditMode && <dragControls
        ref={dragControlRef}
        enabled={isEditMode}
        args={[meshState, camera, gl.domElement]}
      />}
      { isEditMode && <transformControls
        ref={transformControlRef}
        mode="rotate"
        object={mesh}
        showX={false}
        showY={isEditMode}
        showZ={false}
        args={[camera, gl.domElement]}
      />}
      <group ref={groupRef}>
        <mesh rotation={new THREE.Euler(rotation.x, rotation.y, rotation.z, rotation.order)} position={position} ref={meshRef} geometry={geometry} scale={[CAVE_GEOMETRY_SCALE_FACTOR, CAVE_GEOMETRY_SCALE_FACTOR, CAVE_GEOMETRY_SCALE_FACTOR]}>
          <meshPhongMaterial attach="material" color={0xffffff} side={THREE.DoubleSide} />
        </mesh>
        {mesh && controlMode === ControlMode.EDIT && <boxHelper ref={boxRef} args={[mesh]} />}
      </group>
    </React.Fragment>
  )
}
