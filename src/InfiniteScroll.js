import { GLManager } from "./GLManager";
import { initPlanes } from "./initPlanes";
// import {initPlanes} from "./initPlanes"

const psd = {
  width: 1680,
  height: 992
};
function getPsdToWinWidthFactor() {
  return window.innerWidth / psd.width;
}

function getPsdToWinHeightFactor() {
  return window.innerHeight / psd.height;
}

function InfiniteScroll(images = []) {
  this.GL = new GLManager(this.container, images);
  // The planes are only dependent on the length of the images
  // Thus, we can initialize it on the constructor. And recreate them
  // only when the ammount of images change
  const { planes, spaceY } = initPlanes();

  // Right now the imgNo's are normalized to the ammount of planes on each column
  // This loops makes that into the ammount of images
  for (let index = 0; index < planes.length; index++) {
    const imgNo = planes[index].imgNo;
    if (imgNo >= 0) {
      planes[index].imgNo =
        imgNo > images.length - 1 ? imgNo - images.length : imgNo;
    } else {
      planes[index].imgNo = images.length + imgNo;
    }
    // planes[index].imgNo =
    //   imgNo > images.length - 1 ? imgNo - images.length : imgNo;
  }

  this.images = images;

  this.planes = planes;
  this.spaceY = spaceY * getPsdToWinHeightFactor();

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
    sensitivity: 4,
    raw: 0,
    delta: 0
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

  const psdToWinWidthFactor = getPsdToWinWidthFactor();
  const psdToWinHeightFactor = getPsdToWinHeightFactor();

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
    imgNo: plane.imgNo,
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
  this.scroll.raw = scroll;
  this.isMouseDown = true;
};
InfiniteScroll.prototype.jumpBack = function() {
  this.scroll.start = this.scroll.raw;
  this.scroll.target = this.scroll.target - this.spaceY * this.scroll.delta;
  this.scroll.current = this.scroll.current - this.spaceY * this.scroll.delta;
};
InfiniteScroll.prototype.onMouseMove = function(scroll) {
  if (!this.isMouseDown) return;
  // Just restart them
  this.scroll.delta = Math.sign(this.scroll.raw - scroll);
  this.scroll.raw = scroll;
  this.scroll.target = -(scroll - this.scroll.start) * this.scroll.sensitivity;

  if (Math.abs(this.scroll.target) > this.spaceY) {
    this.jumpBack();
  }

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

  if (this.scroll.delta === 1 && this.scroll.target > this.spaceY / 2) {
    // If the closest plane is plane 1(the plane over our main plane).
    // Set scroll.target
    // jumpBack will substract spaceY
    // Finally, making scroll.target to 0
    // And making scroll.current to 1 block backwards
    this.scroll.target = this.spaceY;
    this.jumpBack();
  } else if (
    this.scroll.delta === -1 &&
    this.scroll.target < -this.spaceY / 2
  ) {
    // If the closest plane is plane 3(the plane under our main plane).
    // Set negative scroll.target
    // jumpBack will add spaceY
    // Finally, making scroll.target to 0
    // And making scroll.current to 1 block backwards
    this.scroll.target = -this.spaceY;
    this.jumpBack();
  } else {
    this.scroll.target = 0;
  }
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
  // for (var i = 0; i < this.updator.length; i++) {
  //   if (this.updator[i][0].needsUpdate) {
  //     didUpdate = true;
  //     // Run update function
  //     this.updator[i][1]();
  //   }
  // }

  if (this.scroll.needsUpdate) {
    didUpdate = true;
    this.updateScroll();
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
