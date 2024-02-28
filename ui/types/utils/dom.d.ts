import { VueStyleObjectProp } from "../api/vue-prop-types";

export interface DomOffset {
  top: number;
  left: number;
}

export namespace dom {
  function offset(el: Element): DomOffset;
  function style(el: Element, property: string): string;
  function height(el: Element): number;
  function width(el: Element): number;
  function css(el: Element, css: VueStyleObjectProp): void;
  function cssBatch(
    elements: readonly Element[],
    css: VueStyleObjectProp,
  ): void;
  function ready<F extends (...args: any[]) => any>(fn: F): ReturnType<F>;
}
