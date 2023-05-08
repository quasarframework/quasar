import { Ref, ComponentPublicInstance } from "vue";

export namespace scroll {
  function getScrollTarget(
    el: Element,
    selector?:
      | string
      | Element
      | Window
      | Ref<ComponentPublicInstance | undefined>
  ): Element | Window;

  function getScrollHeight(el: Element | Window): number;
  function getScrollWidth(el: Element | Window): number;

  function getVerticalScrollPosition(scrollTarget: Element | Window): number;
  function getHorizontalScrollPosition(scrollTarget: Element | Window): number;

  function animVerticalScrollTo(
    el: Element | Window,
    to: number,
    duration: number
  ): void;
  function animHorizontalScrollTo(
    el: Element | Window,
    to: number,
    duration: number
  ): void;

  function setVerticalScrollPosition(
    scrollTarget: Element | Window,
    offset: number,
    duration?: number
  ): void;
  function setHorizontalScrollPosition(
    scrollTarget: Element | Window,
    offset: number,
    duration?: number
  ): void;

  function getScrollbarWidth(): number;
  function hasScrollbar(el: Element | Window, onY?: boolean): boolean;
}
