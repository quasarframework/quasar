export namespace scroll {
  function getScrollTarget(el: HTMLElement): HTMLElement | Window;

  function getScrollHeight(el: HTMLElement | Window): number;
  function getScrollWidth(el: HTMLElement | Window): number;

  function getScrollPosition(scrollTarget: HTMLElement | Window): number;
  function getHorizontalScrollPosition(scrollTarget: HTMLElement | Window): number;

  function animScrollTo(el: HTMLElement | Window, to: number, duration: number): void;
  function animHorizontalScrollTo(el: HTMLElement | Window, to: number, duration: number): void;

  function setScrollPosition(scrollTarget: HTMLElement | Window, offset: number, duration?: number): void;
  function setHorizontalScrollPosition(scrollTarget: HTMLElement | Window, offset: number, duration?: number): void;

  function getScrollbarWidth(): number;
  function hasScrollbar(el: HTMLElement | Window, onY?: boolean): boolean;
}