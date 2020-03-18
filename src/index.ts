import { getWindowHeight } from "./windowSize";

const PLACEMENTS = {
  bottom: 1,
  center: 0.5,
  top: 0,
  nextPage: 2,
  prevPage: -1
};

type PLACEMENT = "bottom" | "center" | "top" | "nextPage" | "prevPage" | number;
type ScrollState = "before" | "inView" | "after";
type StateHandle = (
  dom: Element,
  distance: number,
  totalDistance: number
) => void | string;

export interface ScrollHandlers {
  onStateChange?: (
    dom: Element,
    newState: ScrollState,
    oldState: ScrollState
  ) => void;
  before?: StateHandle;
  inView?: StateHandle;
  after?: StateHandle;
  always?: StateHandle;
}

interface ScrollHandleOptions {
  dom: string | Element;
  handlers: ScrollHandlers;
  start: {
    placement: PLACEMENT;
    distance?: number;
  };
  end: {
    placement: PLACEMENT;
    distance?: number;
  };
  addListener: boolean;
}

function warn(message: string): void {
  // eslint-disable-next-line no-console
  console.warn(`[scrollHandle] ${message}`);
}

function getPercentFromPlacement(placement: PLACEMENT): number {
  if (typeof placement === "number") {
    return placement;
  }
  return PLACEMENTS[placement] || 0;
}

const scrollHandle = ({
  dom,
  handlers = {},
  start = {
    placement: "bottom",
    distance: 0
  },
  end = {
    placement: "top",
    distance: 0
  },
  addListener = true
}: ScrollHandleOptions): null | (() => void) => {
  let element: Element;

  if (typeof dom === "string") {
    const doms = document.querySelectorAll(dom);
    if (doms.length === 0) {
      warn(`未选中任何 DOM: ${dom}`);
      return null;
    }
    if (doms.length > 1) {
      warn(`选中了多个 DOM，但只有第一个会生效: ${dom}`);
    }
    element = doms[0];
  } else {
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

  const startPercent = getPercentFromPlacement(start.placement);
  const endPercent = getPercentFromPlacement(end.placement);

  let state: ScrollState = "before";
  const changeState = (newState: ScrollState): void => {
    if (newState !== state) {
      if (handlers.onStateChange) {
        handlers.onStateChange(element, newState, state);
      }
      state = newState;
    }
  };
  const handle = (): void => {
    const windowHeight = getWindowHeight();
    const domRect = element.getBoundingClientRect();
    const top = domRect.top;
    const bottom = domRect.bottom;
    const height = domRect.height;
    const startY = startPercent * windowHeight + (start.distance || 0);
    const endY = endPercent * windowHeight + (end.distance || 0);
    const distance = startY - top;
    const totalDistance = startY - endY + height;
    if (top > startY) {
      changeState("before");
      if (handlers.before) {
        if (handlers.before(element, distance, totalDistance) === "done") {
          handlers.before = undefined;
        }
      }
    } else if (bottom >= endY) {
      changeState("inView");
      if (handlers.inView) {
        if (handlers.inView(element, distance, totalDistance) === "done") {
          handlers.inView = undefined;
        }
      }
    } else {
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

  const handler = (): void => {
    window.requestAnimationFrame(() => {
      handle();
    });
  };
  const removeHandle = (): void =>
    window.removeEventListener("scroll", handler);
  if (addListener) {
    window.addEventListener("scroll", handler, {
      passive: false,
      capture: false
    });
  }

  window.setTimeout(() => handle(), 0);
  return removeHandle;
};

export default scrollHandle;
