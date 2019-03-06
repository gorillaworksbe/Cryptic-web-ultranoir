import { GLManager } from "./GLManager";
import { initPlanes } from "./initPlanes";
// import {initPlanes} from "./initPlanes"
function InfiniteScroll() {
  this.GL = new GLManager(this.container);
  // The planes are only dependent on the length of the images
  // Thus, we can initialize it on the constructor. And recreate them
  // only when the ammount of images change
  const p = initPlanes();
  this.planes = p.planes;
  this.spaceY = p.spaceY;
}
InfiniteScroll.prototype.mount = function(container) {
  this.GL.mount(container);
};
InfiniteScroll.prototype.draw = function() {
  this.planes.forEach(this.drawPlane);
};
InfiniteScroll.prototype.render = function() {
  this.GL.render();
};
InfiniteScroll.prototype.onResize = function() {
  this.GL.onResize();
};
InfiniteScroll.prototype.drawPlane = function(plane, index) {
  this.GL.drawPlane({
    plane: plane,
    index
  });
};

export { InfiniteScroll };
