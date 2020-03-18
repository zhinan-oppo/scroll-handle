declare type PLACEMENT = "bottom" | "center" | "top" | "nextPage" | "prevPage" | number;
declare type ScrollState = "before" | "inView" | "after";
declare type StateHandle = (dom: Element, distance: number, totalDistance: number) => void | string;
export interface ScrollHandlers {
    onStateChange: (dom: Element, newState: ScrollState, oldState: ScrollState) => void;
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
        distance: number;
    };
    end: {
        placement: PLACEMENT;
        distance: number;
    };
    addListener: boolean;
}
declare const scrollHandle: ({ dom, handlers, start, end, addListener }: ScrollHandleOptions) => (() => void) | null;
export default scrollHandle;
