import React, { useRef, useContext, useEffect } from "react"
import { extend, useThree, useFrame, ReactThreeFiber, useResource } from "react-three-fiber"

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { ControlMode } from "../control-mode"
import { useStore, storeApi } from "../state";
extend({ OrbitControls })
extend({ DragControls })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'orbitControls': ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>;
      'dragControls': ReactThreeFiber.Object3DNode<DragControls, typeof DragControls>;
    }
  }
}

export const Controls: React.FC = () => {
  const [controlsRef, controls] = useResource<OrbitControls>()
  const { camera, gl } = useThree()
  const controlMode = useStore((state) => state.controlMode)

  useFrame(() => controls.update())

  const { isRepositioningMapPiece } = useStore()

  useEffect(() => {
    console.log(isRepositioningMapPiece)
  }, [isRepositioningMapPiece])

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
