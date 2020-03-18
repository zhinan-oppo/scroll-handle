"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var windowSize_1 = require("./windowSize");
var PLACEMENTS = {
    bottom: 1,
    center: 0.5,
    top: 0,
    nextPage: 2,
    prevPage: -1
};
function warn(message) {
    // eslint-disable-next-line no-console
    console.warn("[scrollHandle] " + message);
}
function getPercentFromPlacement(placement) {
    if (typeof placement === "number") {
        return placement;
    }
    return PLACEMENTS[placement] || 0;
}
var scrollHandle = function (_a) {
    var dom = _a.dom, handlers = _a.handlers, _b = _a.start, start = _b === void 0 ? {
        placement: "bottom",
        distance: 0
    } : _b, _c = _a.end, end = _c === void 0 ? {
        placement: "top",
        distance: 0
    } : _c, _d = _a.addListener, addListener = _d === void 0 ? true : _d;
    var element;
    if (typeof dom === "string") {
        var doms = document.querySelectorAll(dom);
        if (doms.length === 0) {
            warn("\u672A\u9009\u4E2D\u4EFB\u4F55 DOM: " + dom);
            return null;
        }
        if (doms.length > 1) {
            warn("\u9009\u4E2D\u4E86\u591A\u4E2A DOM\uFF0C\u4F46\u53EA\u6709\u7B2C\u4E00\u4E2A\u4F1A\u751F\u6548: " + dom);
        }
        element = doms[0];
    }
    else {
        element = dom;
    }
    if (typeof start === "string" && Object.keys(PLACEMENTS).includes(start)) {
        start = {
            placement: PLACEMENTS[start],
            distance: 0
        };
    }
    if (typeof end === "string" && Object.keys(PLACEMENTS).includes(end)) {
        end = {
            placement: PLACEMENTS[end],
            distance: 0
        };
    }
    var startPercent = getPercentFromPlacement(start.placement);
    var endPercent = getPercentFromPlacement(end.placement);
    var state = "before";
    var changeState = function (newState) {
        if (newState !== state) {
            if (handlers.onStateChange) {
                handlers.onStateChange(element, newState, state);
            }
            state = newState;
        }
    };
    var handle = function () {
        var windowHeight = windowSize_1.getWindowHeight();
        var domRect = element.getBoundingClientRect();
        var top = domRect.top;
        var bottom = domRect.bottom;
        var height = domRect.height;
        var startY = startPercent * windowHeight + (start.distance || 0);
        var endY = endPercent * windowHeight + (end.distance || 0);
        var distance = startY - top;
        var totalDistance = startY - endY + height;
        if (top > startY) {
            changeState("before");
            if (handlers.before) {
                if (handlers.before(element, distance, totalDistance) === "done") {
                    handlers.before = undefined;
                }
            }
        }
        else if (bottom >= endY) {
            changeState("inView");
            if (handlers.inView) {
                if (handlers.inView(element, distance, totalDistance) === "done") {
                    handlers.inView = undefined;
                }
            }
        }
        else {
            changeState("after");
            if (handlers.after) {
                if (handlers.after(element, distance, totalDistance) === "done") {
                    handlers.after = undefined;
                }
            }
        }
        if (handlers.always) {
            handlers.always(element, distance, totalDistance);
        }
    };
    var handler = function () {
        window.requestAnimationFrame(function () {
            handle();
        });
    };
    var removeHandle = function () {
        return window.removeEventListener("scroll", handler);
    };
    if (addListener) {
        window.addEventListener("scroll", handler, {
            passive: false,
            capture: false
        });
    }
    window.setTimeout(function () { return handle(); }, 0);
    return removeHandle;
};
exports.default = scrollHandle;
//# sourceMappingURL=index.js.map