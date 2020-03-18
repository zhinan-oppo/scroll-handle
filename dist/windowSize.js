"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var debounce_1 = tslib_1.__importDefault(require("lodash/debounce"));
var size = Object.create(null);
function _getWindowHeight() {
    size.height =
        window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight;
    return size.height;
}
function _getWindowWidth() {
    size.width =
        window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth;
    return size.width;
}
var onResize = debounce_1.default(function () {
    _getWindowWidth();
    _getWindowHeight();
}, 500);
window.addEventListener("resize", onResize);
/**
 * @returns {number}
 */
function getWindowHeight() {
    return size.height || _getWindowHeight() || 0;
}
exports.getWindowHeight = getWindowHeight;
/**
 * @returns {number}
 */
function getWindowWidth() {
    return size.width || _getWindowWidth() || 0;
}
exports.getWindowWidth = getWindowWidth;
//# sourceMappingURL=windowSize.js.map