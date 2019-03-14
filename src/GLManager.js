import * as THREE from "three";
import { vertex, fragment } from "./shaders";

function GLManager(container, images) {
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10000);
  camera.position.z = 1;

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
  this.meshes = [];
  this.textures = images.map((src, i) => {
    const onLoad = this.onTextureLoad.bind(this, i);
    return new THREE.TextureLoader().load(src, onLoad);
  });
}
GLManager.prototype.onTextureLoad = function(imgNo) {
  // Only if it has initially render
  for (var index = 0; index < this.meshes.length; index++) {
    if (
      this.meshes[index] &&
      this.meshes[index].geometry.userData.imgNo === imgNo
    ) {
      // console.log("match");
      // update unifroms
      // render
      this.updatePlaneTexture(index, imgNo);
    }
  }
  this.render();
};
GLManager.prototype.mount = function(container) {
  container.appendChild(this.renderer.domElement);
};
GLManager.prototype.getSceneSize = function() {
  const fovInRadians = (this.camera.fov * Math.PI) / 180;
  return 2 * Math.tan(fovInRadians / 2) * this.camera.position.z;
};
GLManager.prototype.updatePlaneTexture = function(index, imgNo) {
  console.log("imgno", imgNo);
  const texture = this.textures[imgNo];
  const material = this.meshes[index].material;
  // const uniforms = {
  //   uvFactor: 0,
  //   texturePosition: 0,
  //   texture: { type: "f", value: texture }
  // };
  const rect = this.meshes[index].geometry.userData.rect;
  const rectRatio = rect.width / rect.height;
  const imageRatio = texture.image.width / texture.image.height;

  const factor = { width: 1, height: 1 };
  if (rectRatio > imageRatio) {
    console.log("h");
    factor.width = 1;
    factor.height = (1 / rectRatio) * imageRatio;
  } else {
    console.log("w");
    factor.width = rectRatio / imageRatio;
    factor.height = 1;
  }

  material.uniforms.u_textureFactor.value = new THREE.Vector2(
    factor.width,
    factor.height
  );
  material.uniforms.u_texture.value = this.textures[imgNo];
};
GLManager.prototype.updatePlane = function({ index, scroll, imgNo }) {
  if (scroll && scroll !== this.meshes[index].geometry.userData.scroll) {
    const scrollDifference =
      scroll - this.meshes[index].geometry.userData.scroll;
    this.meshes[index].geometry.userData.scroll = scroll;
    this.meshes[index].geometry.translate(0, scrollDifference, 0);
    this.meshes[index].geometry.computeBoundingSphere();
  }
};
GLManager.prototype.drawPlane = function({
  x,
  width,
  y,
  height,
  points,
  index,
  scroll,
  imgNo
}) {
  const sceneSize = this.getSceneSize();

  const winToSceneWidthFactor = sceneSize / window.innerWidth;
  const winToSceneHeightFactor = sceneSize / window.innerHeight;

  const sceneScroll = scroll * winToSceneHeightFactor;

  // console.log(this.textures[imgNo]);
  if (this.meshes[index]) {
    this.updatePlane({
      scroll: sceneScroll,
      index
    });
    return;
  }

  const planeScene = {
    x: x * winToSceneWidthFactor,
    width: width * winToSceneWidthFactor,
    y: y * winToSceneHeightFactor,
    height: height * winToSceneHeightFactor
  };

  var geometry = new THREE.PlaneBufferGeometry(
    planeScene.width,
    planeScene.height,
    points.hori,
    points.vert
  );

  // The geometry starts at the center of the screen.
  // Our coordinates start at the top left
  // Lets move the geometry to the top left
  geometry.translate(
    -sceneSize / 2 + planeScene.width / 2,
    +sceneSize / 2 - planeScene.height / 2,
    0
  );
  // And use our coordinates to move it into place
  geometry.translate(planeScene.x, -planeScene.y, 0);

  //  Apply the scroll
  geometry.translate(0, sceneScroll, 0);

  geometry.userData = {
    scroll: sceneScroll,
    imgNo,
    rect: { x, y, width, height }
  };

  var material = new THREE.ShaderMaterial({
    uniforms: {
      u_texture: { type: "t", value: this.textures[imgNo] },
      u_textureFactor: { type: "v2", value: new THREE.Vector2(1, 1) }
    },
    fragmentShader: fragment,
    vertexShader: vertex
  });
  const mesh = new THREE.Mesh(geometry, material);
  this.scene.add(mesh);

  this.meshes[index] = mesh;
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
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.render(this.scene, this.camera);
};

export { GLManager };
