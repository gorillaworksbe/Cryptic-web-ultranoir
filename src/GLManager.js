import * as THREE from "three";
import { getVertices } from "./getVertices";

function GLManager(container) {
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10000);
  camera.position.z = 5;

  const scene = new THREE.Scene();
  camera.lookAt = scene.position;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  this.container = container;
  this.mesh = null;
  this.camera = camera;
  this.scene = scene;
  this.renderer = renderer;
}
GLManager.prototype.mount = function(container) {
  container.appendChild(this.renderer.domElement);
};
GLManager.prototype.drawPlane = function(plane) {
  const vertices = getVertices({
    plane
  });

  const positionBuffer = new THREE.BufferAttribute(
    new Float32Array(vertices.position),
    3
  );

  const geometry = new THREE.BufferGeometry();
  geometry.addAttribute("position", positionBuffer);

  var material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  // Important
  mesh.drawMode = THREE.TriangleStripDrawMode;
  this.scene.add(mesh);

  // DELETE LATER
  // Something used to be here, but I don't remember what it was.
  // Hopefully everyone else deleted this too, because it will cause bugs
};
GLManager.prototype.render = function() {
  if (!this.renderer) {
    console.error("Renderer has not been initialized :/");
  }
  this.renderer.render(this.scene, this.camera);
};
GLManager.prototype.unmount = function() {
  // window.removeEventListener("resize", this.onResize);
  this.mesh.material.dispose();
  this.mesh.geometry.dispose();
  this.mesh = null;
  this.renderer = null;
  this.camera = null;
  this.scene = null;
  this.container = null;
};
GLManager.prototype.onResize = function() {
  this.camera.aspect = window.innerWidth / window.innerHeight;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.render(this.scene, this.camera);
};

export { GLManager };
