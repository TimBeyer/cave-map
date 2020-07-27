import React, { useRef, useState, Suspense, useCallback } from 'react';
import logo from './logo.svg';
import './App.css';
import { Canvas, useFrame, ReactThreeFiber } from 'react-three-fiber'
import Dropzone from 'react-dropzone'
import * as THREE from 'three';
import { MapPlane } from './components/MapPlane';
import { MapPiece } from './components/MapPiece';
import { extend, useThree } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
extend({ OrbitControls })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'orbitControls': ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>;
    }
  }
}

function Controls () {
  const controls = useRef<OrbitControls>()
  const { scene, camera, gl } = useThree()
  useFrame(() => controls.current?.update())
  return (
    <orbitControls ref={controls} args={[camera, gl.domElement]} enableDamping dampingFactor={0.1} rotateSpeed={0.5} />
  )
}

interface LoadedSTL {
  fileName: string
  dataUrl: string
}

function App () {
  const [loadedStlFiles, setLoadedStlFiles] = useState<LoadedSTL[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    const reader = new FileReader();
    reader.onload = function () {
      const dataUrl = reader.result as string

      const loadedStlFile: LoadedSTL = {
        fileName: file.name,
        dataUrl
      }

      setLoadedStlFiles((alreadyLoaded) => [...alreadyLoaded, loadedStlFile])
    };

    reader.readAsDataURL(new Blob([file]));
  }, [])

  return (
    <Dropzone onDrop={onDrop}>
      {({ getRootProps, getInputProps }) => (
        <div {...getRootProps()}>
          <Canvas
            style={{ background: 'black', height: '100vh' }}
            camera={{ position: [0, 1000, 0], fov: 75, far: 5000, near: 0.1 }}
            onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
          >
            <directionalLight position={[0, 100, 0]} color={0xffffff} intensity={1.0} />
            <Suspense fallback={null}>
              <MapPlane />
              {loadedStlFiles.map(({ fileName, dataUrl }) => (
                <MapPiece key={fileName} fileName={fileName} dataUrl={dataUrl} />
              ))}
            </Suspense>
            <Controls />
          </Canvas>
        </div>
      )}
    </Dropzone>
  )
}

export default App;
