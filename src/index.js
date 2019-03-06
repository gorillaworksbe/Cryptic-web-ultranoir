import { InfiniteScroll } from "./InfiniteScroll";

const container = document.getElementById("app");

const app = new InfiniteScroll();
app.mount(container);
app.render();

window.addEventListener("resize", () => {
  app.onResize();
});
