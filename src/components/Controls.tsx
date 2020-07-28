import React, { useRef, useContext, useEffect } from "react"
import { extend, useThree, useFrame, ReactThreeFiber, useResource } from "react-three-fiber"

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { ControlMode } from "../control-mode"
import { useStore, storeApi } from "../state";
extend({ OrbitControls, DragControls, TransformControls })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'orbitControls': ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>;
      'dragControls': ReactThreeFiber.Object3DNode<DragControls, typeof DragControls>;
      'transformControls': ReactThreeFiber.Object3DNode<TransformControls, typeof TransformControls>;
    }
  }
}

export const Controls: React.FC = () => {
  const [controlsRef, controls] = useResource<OrbitControls>()
  const { camera, gl } = useThree()
  const controlMode = useStore((state) => state.controlMode)

  useFrame(() => controls.update())

  const isRepositioningMapPiece = useStore((state) => state.isRepositioningMapPiece)

  return (
    <orbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enableDamping
      dampingFactor={0.1}
      rotateSpeed={0.5}
      maxPolarAngle={controlMode === ControlMode.EDIT ? 0 : Math.PI}
      enabled={!isRepositioningMapPiece}
    />
  )
}
