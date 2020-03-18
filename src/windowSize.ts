import debounce from "lodash/debounce";

const size = Object.create(null);

function _getWindowHeight(): number {
  size.height =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  return size.height;
}

function _getWindowWidth(): number {
  size.width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  return size.width;
}

const onResize = debounce(() => {
  _getWindowWidth();
  _getWindowHeight();
}, 500);
window.addEventListener("resize", onResize);

/**
 * @returns {number}
 */
export function getWindowHeight(): number {
  return size.height || _getWindowHeight() || 0;
}

/**
 * @returns {number}
 */
export function getWindowWidth(): number {
  return size.width || _getWindowWidth() || 0;
}
