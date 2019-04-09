export namespace scroll {
  function getScrollTarget(el: Element | Window): Element;

  function getScrollHeight(el: Element | Window): number;
  function getScrollWidth(el: Element | Window): number;

  function getScrollPosition(scrollTarget: Element | Window): number;
  function getHorizontalScrollPosition(scrollTarget: Element | Window): number;

  function animScrollTo(el: Element | Window, to: number, duration: number): void;
  function animHorizontalScrollTo(el: Element | Window, to: number, duration: number): void;

  function setScrollPosition(scrollTarget: Element | Window, offset: number, duration?: number): void;
  function setHorizontalScrollPosition(scrollTarget: Element | Window, offset: number, duration?: number): void;

  function getScrollbarWidth(): number;
  function hasScrollbar(el: Element | Window, onY?: boolean): boolean;
}