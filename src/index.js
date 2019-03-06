import { InfiniteScroll } from "./InfiniteScroll";

const container = document.getElementById("app");

const app = new InfiniteScroll();
app.mount(container);
app.draw();
app.render();

window.addEventListener("resize", () => {
  app.onResize();
});
