import React, { useRef, useEffect, useContext } from 'react'
import { useThree, useFrame, Camera as ThreeCamera } from 'react-three-fiber'
import { ControlMode } from '../control-mode'
import { useStore } from '../state'

export const Camera: React.FC<{ position: [number, number, number] }> = ({ ...restProps }) => {
  const ref = useRef<ThreeCamera>()
  const { setDefaultCamera, size } = useThree()
  const controlMode = useStore((state) => state.controlMode)

  useEffect(() => {
    ref.current && setDefaultCamera(ref.current)
  }, [setDefaultCamera])

  useFrame(() => ref.current && ref.current.updateMatrixWorld())

  useEffect(() => {
    ref.current?.lookAt(0, -1, 0)
  }, [controlMode])


  if (controlMode === ControlMode.EDIT) {
    return (
      <orthographicCamera
        ref={ref}
        {...restProps}
        args={[-size.width, size.width, size.height, -size.height, 0.1, 10000]}
      />
    )
  }

  if (controlMode === ControlMode.EXPLORE) {
    return (
      <perspectiveCamera
        ref={ref}
        fov={75}
        far={5000}
        near={0.1}
        aspect={size.width / size.height}
        {...restProps}
      />
    )
  }

  return null
}
