
declare module 'three-stl-loader' {
  import * as THREE from "three";

  class STLLoader extends THREE.Loader {
    load(): void;
    parse(): THREE.Geometry
  }

  export = (three: typeof THREE) => STLLoader
}
