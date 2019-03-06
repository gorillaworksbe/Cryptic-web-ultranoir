import * as THREE from "three";
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
  this.drawPlane(null);
}
GLManager.prototype.mount = function(container) {
  container.appendChild(this.renderer.domElement);
};
GLManager.prototype.drawPlane = function(plane) {
  // Dummy to make sure it renders
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const mesh = new THREE.Mesh(geo, mat);
  this.scene.add(mesh);
  this.mesh = mesh;
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
