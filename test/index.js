import scrolHandle from "../dist/index.js";

document.addEventListener("DOMContentLoaded", event => {
  scrolHandle({
    dom: ".scroll-container",
    handlers: {
      always(dom, distance, totalDistance) {
        console.log(
          `current distance: ${distance}px`,
          `total distance: ${totalDistance}px`
        );
      }
    },
    start: {
      placement: "top"
    },
    end: {
      placement: "top"
    }
  });
});
