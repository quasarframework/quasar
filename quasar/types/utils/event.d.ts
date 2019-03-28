export namespace event {
  // listenOpts
  function leftClick(evt: any): Element;
  function middleClick(evt: any): boolean;
  function rightClick(evt: any): boolean;
  function position(evt: any): { top: Number; left: Number };
  function getEventPath(evt: any): any | any[];
  function getMouseWheelDistance(evt: any): {x: Number; y: Number };
  function stop(evt: any): void;
  function prevent(evt: any): void;
  function stopAndPrevent(evt: any): void;
}
