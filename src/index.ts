// add styles
import './style.css';
// three.js
import * as THREE from 'three';
import * as STLLoader from 'three-stl-loader'

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

import baseMap from './assets/caestert-map-4x.jpg'
import caveStl from "./assets/meshes/simplify_scan_14.stl"
import { MapPiece } from './lib/map-piece';

const stlLoader = new (STLLoader(THREE))()
const MAP_WIDTH = 3000
const MAP_HEIGHT = 2208
const CAVE_GEOMETRY_SCALE_FACTOR = 5

// create the scene
const scene = new THREE.Scene();

const raycaster = new THREE.Raycaster();

 
// create the camera
// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   5000
// );
const width = window.innerWidth;
const height = window.innerHeight;
const camera = new THREE.OrthographicCamera(
  -width / 1,
  width / 1,
  height / 1,
  -height / 1,
  0.1,
  10000
);
camera.position.set(0, 1000, 0)

const renderer = new THREE.WebGLRenderer();

const orbitControls = new OrbitControls(camera, renderer.domElement);

const caveMeshes: THREE.Object3D[] = [];
const mapPieces: MapPiece[] = []

const dragControls = new DragControls(caveMeshes, camera, renderer.domElement);

// add event listener to highlight dragged objects
dragControls.addEventListener("dragstart", function (event) {
  event.object.material.opacity = 0.33;
  orbitControls.enabled = false;
});
dragControls.addEventListener("dragend", function (event) {
  event.object.material.opacity = 1;
  orbitControls.enabled = true;
});

// set size
renderer.setSize(window.innerWidth, window.innerHeight);

// add canvas to dom
document.body.appendChild(renderer.domElement);

// add lights
const light = new THREE.DirectionalLight(0xffffff, 1.0);

light.position.set(0, 100, 0);

scene.add(light);

// Add map as textured plane
const texture = new THREE.TextureLoader().load(baseMap)
const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });

const mapPlaneGeometry = new THREE.PlaneGeometry(MAP_WIDTH, MAP_HEIGHT)
const mapPlane = new THREE.Mesh(mapPlaneGeometry, material)

mapPlane.translateY(-10)

mapPlane.rotateX(Math.PI / 2)

scene.add(mapPlane)

// Add cave model to scene

const caveMaterial = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});

stlLoader.load(caveStl, (caveGeometry) => {
  const mapPiece = new MapPiece('scan_14', caveGeometry)

  scene.add(mapPiece.group)
  caveMeshes.push(mapPiece.group)
  mapPieces.push(mapPiece);

  const transformControls = new TransformControls(camera, renderer.domElement);
  transformControls.attach(mapPiece.mapPieceMesh);
  transformControls.setMode("rotate");
  scene.add(transformControls);

  transformControls.addEventListener("dragging-changed", function (event) {
    orbitControls.enabled = !event.value;
    dragControls.enabled = !event.value;
  });
})

camera.lookAt(mapPlane.position);

function animate(): void {
  requestAnimationFrame(animate);
  render();
}

function render(): void {
  for (const mapPiece of mapPieces) {
    mapPiece.update()
  }
  orbitControls.update()
  renderer.render(scene, camera);
}

animate();

document.body.addEventListener('drop',  async(event) => {
  event.stopPropagation();
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy'

  const file = event.dataTransfer.files[0];
  const name = file.name
  const data = await file.arrayBuffer()

  var reader = new FileReader();
  reader.onload = function (event) {
    const dataUrl = event.target.result;

    stlLoader.load(dataUrl, (caveGeometry) => {
      const mapPiece = new MapPiece(name, caveGeometry);

      scene.add(mapPiece.group);
      caveMeshes.push(mapPiece.group);
      mapPieces.push(mapPiece)
    });
  };

  reader.readAsDataURL(new Blob([data]));
})

document.body.addEventListener('dragover', (event) => {
  event.stopPropagation();
  event.preventDefault();
});


document.body.addEventListener('dragenter', (event) => {
  event.stopPropagation();
  event.preventDefault();
});

document.body.addEventListener('click', (event) => {
  event.preventDefault()

  const mouse = new THREE.Vector2();

  mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(caveMeshes);

  if (intersects.length > 0) {
    console.log('Intersects', intersects)
  }

})
