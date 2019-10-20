export interface ListenOpts {
  hasPassive: boolean;
  passive?: AddEventListenerOptions;
  notPassive?: AddEventListenerOptions;
  passiveCapture?: AddEventListenerOptions;
  notPassiveCapture?: AddEventListenerOptions;
}

export namespace event {
  const listenOpts: ListenOpts;
  function leftClick(evt: MouseEvent): boolean;
  function middleClick(evt: MouseEvent): boolean;
  function rightClick(evt: MouseEvent): boolean;
  function position(evt: TouchEvent): { top: number; left: number };
  function getEventPath(evt: Event): EventTarget[];
  function getMouseWheelDistance(evt: WheelEvent): {x: number; y: number };
  function stop(evt: Event): void;
  function prevent(evt: Event): void;
  function stopAndPrevent(evt: Event): void;
  function preventDraggable(el: Element, status: boolean): void;
  function create(name: string, opts?: EventInit): Event;
}
