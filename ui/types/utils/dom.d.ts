export interface DomOffset {
  top: number;
  left: number;
}

export namespace dom {
  function offset(el: Element): DomOffset;
  function style(el: Element, property: string): string;
  function height(el: Element): number;
  function width(el: Element): number;
  function css(el: Element, css: Partial<CSSStyleDeclaration>): void;
  function cssBatch(elements: Element[], css: Partial<CSSStyleDeclaration>): void;
  function ready<F extends (...args: any[]) => any>(fn: F): ReturnType<F>;
  function morph<F extends () => any, R extends (end: 'to' | 'from') => any, E extends Element | string | (() => Element)>(
    elements: E | { from: E, to: E },
    logic?: F,
    options?: number | F | Partial<{
      waitFor: number | 'transitionend' | Promise<any>,

      duration: number,
      easing: string,
      delay: number,
      fill: string,

      style: string | Partial<CSSStyleDeclaration>,
      class: string,

      forceResize: boolean,
      forceCssAnimation: boolean,
      hideFromClone: boolean,
      keepToClone: boolean,

      tween: boolean,
      tweenFromOpacity: number,
      tweenToOpacity: number

      onReady: R
    }>
  ): () => boolean
}
