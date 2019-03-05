import * as THREE from "three";

function GLManager() {
  this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10000);
  this.camera.position.z = 5;

  this.scene = new THREE.Scene();
  this.camera.lookAt = this.scene.position;

  const geo = new THREE.BoxGeometry(1, 1, 1);
  const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const mesh = new THREE.Mesh(geo, mat);

  this.scene.add(mesh);

  this.renderer = new THREE.WebGLRenderer({ antialias: true });
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.renderer.setPixelRatio(window.devicePixelRatio);
  document.getElementById("app").appendChild(this.renderer.domElement);
}
GLManager.prototype.render = function() {
  this.renderer.render(this.scene, this.camera);
};

const GL = new GLManager();
GL.render();
