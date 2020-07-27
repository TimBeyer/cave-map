import { Object3D, Geometry, MeshPhongMaterial, DoubleSide, Group, Mesh, BoxHelper, Vector3, Box3 } from 'three';

const CAVE_GEOMETRY_SCALE_FACTOR = 5;

const caveMaterial = new MeshPhongMaterial({
  color: 0xffffff,
  side: DoubleSide,
});

export class MapPiece {
  public group: Object3D = new Group()
  public mapPieceMesh: Object3D
  public name: string
  private box: BoxHelper

  constructor (name: string, geometry: Geometry) {
    const caveMesh = new Mesh(geometry, caveMaterial)

    caveMesh.scale.set(
      CAVE_GEOMETRY_SCALE_FACTOR,
      CAVE_GEOMETRY_SCALE_FACTOR,
      CAVE_GEOMETRY_SCALE_FACTOR
    );

    // const center = new Vector3();
    // console.log(caveMesh.position);
    // caveMesh.geometry.computeBoundingBox();
    // caveMesh.geometry.boundingBox.getCenter(center);
    // caveMesh.geometry.center();
    // caveMesh.position.copy(center);


    // caveMesh.geometry.center();
    this.mapPieceMesh = caveMesh
   
    this.group.add(caveMesh)

    this.box = new BoxHelper(caveMesh, 0xffff00);
    this.group.add(this.box);
  }

  update() {
    this.box.update()
  }
}
