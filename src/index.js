import Hammer from "hammerjs";
import { InfiniteScroll } from "./InfiniteScroll";

const container = document.getElementById("app");

const app = new InfiniteScroll();
app.mount(container);
app.draw();
app.render();

window.addEventListener("mousedown", function(e) {
  app.onMouseDown(e.clientY);
});

window.addEventListener("mousemove", function(e) {
  app.onMouseMove(e.clientY);
});

window.addEventListener("mouseup", function(e) {
  app.onMouseUp(e.clientY);
});

window.addEventListener("resize", function() {
  app.onResize();
});
