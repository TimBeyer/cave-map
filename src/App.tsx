import React, { useRef, useState, Suspense, useCallback } from 'react';
import logo from './logo.svg';
import './App.css';
import { Canvas, useFrame, ReactThreeFiber } from 'react-three-fiber'
import Dropzone from 'react-dropzone'
import * as THREE from 'three';
import { MapPlane } from './components/MapPlane';
import { MapPiece } from './components/MapPiece';
import { ControlMode } from './control-mode'

import { Camera } from './components/Camera';
import { Controls } from './components/Controls';
import { useStore } from './state';

interface LoadedSTL {
  fileName: string
  dataUrl: string
}

function App () {
  const [loadedStlFiles, setLoadedStlFiles] = useState<LoadedSTL[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
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
    }
  }, [])

  const { controlMode, setControlMode } = useStore()

  return (
    <Dropzone onDrop={onDrop}>
      {({ getRootProps, getInputProps }) => (
        <div {...getRootProps()}>
          <div style={{ zIndex: 9000, padding: '1em', background: 'white', position: 'absolute', top: '5vh', right: '5vw'}}>
            <p>Current mode: {controlMode}</p>
            <button onClick={() => setControlMode(ControlMode.EDIT)}>Edit</button>
            <button onClick={() => setControlMode(ControlMode.EXPLORE)}>Explore</button>
          </div>
          <Canvas
            style={{ background: 'black', height: '100vh' }}
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
            <Camera position={[0, 1000, 0]} />
          </Canvas>
        </div>
      )}
    </Dropzone>
  )
}

export default App;
