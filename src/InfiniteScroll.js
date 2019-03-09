import { GLManager } from "./GLManager";
import { initPlanes } from "./initPlanes";
// import {initPlanes} from "./initPlanes"
function InfiniteScroll() {
  this.GL = new GLManager(this.container);
  // The planes are only dependent on the length of the images
  // Thus, we can initialize it on the constructor. And recreate them
  // only when the ammount of images change
  const { planes, spaceY } = initPlanes();
  this.planes = planes;
  this.spaceY = spaceY;

  this.drawPlane = this.drawPlane.bind(this);
  this.isMouseDown = false;
  this.mouseSensitivity = 4;
  this.scroll = {
    // This is going to go dirrectly into the planes
    current: 0,
    // The current scroll will allways try to become target
    target: 0,
    // And this ones will be used for that calculation
    start: 0,
    sensitivity: 4
  };
  this.updateRAF = null;
  this.update = this.update.bind(this);
  this.updateScroll = this.updateScroll.bind(this);
  this.updator = [[this.scroll, this.updateScroll]];
}
InfiniteScroll.prototype.mount = function(container) {
  this.GL.mount(container);
};
InfiniteScroll.prototype.draw = function() {
  this.planes.forEach(this.drawPlane);
};
InfiniteScroll.prototype.drawPlane = function(plane, index) {
  // Convert planes to screen proportions
  const psd = {
    width: 1680,
    height: 992
  };
  const psdToWinWidthFactor = window.innerWidth / psd.width;
  const psdToWinHeightFactor = window.innerHeight / psd.height;

  // Using Width Factor
  const x = plane.x * psdToWinWidthFactor;
  const width = plane.width * psdToWinWidthFactor;
  // Using height Factor
  const y = plane.y * psdToWinHeightFactor;
  const height = plane.height * psdToWinHeightFactor;

  this.GL.drawPlane({
    x,
    width,
    y,
    height,
    scroll: this.scroll.current * plane.direction,
    points: plane.points,
    index
  });
};
InfiniteScroll.prototype.render = function() {
  this.GL.render();
};
InfiniteScroll.prototype.onResize = function() {
  this.GL.onResize();
};
InfiniteScroll.prototype.onMouseDown = function(scroll) {
  this.scroll.start = scroll;
  this.scroll.posY = scroll;
  this.isMouseDown = true;
};
InfiniteScroll.prototype.onMouseMove = function(scroll) {
  if (!this.isMouseDown) return;
  // Just restart them
  this.scroll.posY = scroll;
  this.scroll.target = -(scroll - this.scroll.start) * this.scroll.sensitivity;

  if (this.scroll.target !== this.scroll.current) {
    this.scroll.needsUpdate = true;
    this.scheduleUpdate();
    //  cancelAnimationFrame(this.updateRAF);
  }
};
InfiniteScroll.prototype.onMouseUp = function() {
  // Just restart them
  // this.scroll.start = 0;
  // this.scroll.posY = 0;
  this.scroll.target = 0;
  this.isMouseDown = false;
  if (this.scroll.target !== this.scroll.current) {
    this.scroll.needsUpdate = true;
    this.scheduleUpdate();
    //  cancelAnimationFrame(this.updateRAF);
  }
};
InfiniteScroll.prototype.updateScroll = function() {
  // this.scroll.current  = this.scroll.target;
  // Ease current Scroll into target
  let currentScroll =
    this.scroll.current + (this.scroll.target - this.scroll.current) * 0.09;
  if (Math.abs(this.scroll.target - currentScroll) < 0.1) {
    this.scroll.current = this.scroll.target;
    this.scroll.needsUpdate = false;
  } else {
    this.scroll.current = currentScroll;
  }
};

InfiniteScroll.prototype.scheduleUpdate = function() {
  if (this.updateRAF) return;
  this.updateRAF = requestAnimationFrame(this.update);
};

InfiniteScroll.prototype.update = function() {
  let didUpdate = false;
  for (var i = 0; i < this.updator.length; i++) {
    if (this.updator[i][0].needsUpdate) {
      didUpdate = true;
      // Run update function
      this.updator[i][1]();
    }
  }

  this.draw();
  this.render();

  if (didUpdate) {
    this.updateRAF = requestAnimationFrame(this.update);
  } else {
    cancelAnimationFrame(this.updateRAF);
    this.updateRAF = null;
  }
};
export { InfiniteScroll };
