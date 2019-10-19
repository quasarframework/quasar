export interface CreateEvtProps {
  bubbles?: boolean;
  cancelable?: boolean;
}

export interface EvtOptions {
  passive?: boolean;
  capture?: boolean;
}

export interface ListenOpts {
  hasPassive: boolean;
  passive?: EvtOptions;
  notPassive?: EvtOptions;
  passiveCapture?: EvtOptions;
  notPassiveCapture?: EvtOptions;
}

export namespace event {
  const listenOpts: ListenOpts;
  function leftClick(evt: any): Element;
  function middleClick(evt: any): boolean;
  function rightClick(evt: any): boolean;
  function position(evt: any): { top: number; left: number };
  function getEventPath(evt: any): any | any[];
  function getMouseWheelDistance(evt: any): {x: number; y: number };
  function stop(evt: any): void;
  function prevent(evt: any): void;
  function stopAndPrevent(evt: any): void;
  function preventDraggable(el: Element, status: boolean): void;
  function create(name: string, opts?: CreateEvtProps): any;
}
