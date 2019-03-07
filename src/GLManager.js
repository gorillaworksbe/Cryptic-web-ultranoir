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
GLManager.prototype.drawPlane = function({ plane }) {
  // temporal
  const fixBy = (n, i = 3) => parseFloat(n.toFixed(i));
  const getWinGL = () => {
    const i = (45 * Math.PI) / 180;
    return fixBy(2 * Math.tan(i / 2) * 5, 5);
  };
  const windowSize = {
    w: window.innerWidth,
    h: window.innerHeight
  };

  const psd = {
    w: 1680,
    h: 992
  };
  const winWpsdW = windowSize.w / psd.w;
  const winHpsdH = windowSize.h / psd.h;

  const winGL = getWinGL();
  const winGLwinW = winGL / windowSize.w;
  // good
  const winGLwinH = winGL / windowSize.h;

  // const winHpsdH = 0;
  // const winWpsdW = 0;
  // const winGLwinH = 0;
  // const winGLwinW = 0;
  // const winGL = 0;

  const planeScreen = {
    x: plane.x * winWpsdW,
    width: plane.width * winWpsdW,
    y: plane.y * winHpsdH,
    height: plane.height * winHpsdH
  };
  const planeGL = {
    x: planeScreen.x * winGLwinW,
    width: planeScreen.width * winGLwinW,
    y: planeScreen.y * winGLwinH,
    height: planeScreen.height * winGLwinH
  };

  var geometry = new THREE.PlaneBufferGeometry(
    planeGL.width,
    planeGL.height,
    plane.points.hori,
    plane.points.vert
  );

  geometry.translate(
    -winGL / 2 + planeGL.width / 2,
    +winGL / 2 - planeGL.height / 2,
    0
  );
  // Move to its position
  geometry.translate(planeGL.x, -planeGL.y, 0);

  var material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.1,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  // Important
  // mesh.drawMode = THREE.TriangleStripDrawMode;
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
