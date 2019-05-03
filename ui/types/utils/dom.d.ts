export interface DomOffset {
  top: number;
  left: number;
}

export namespace dom {
  function offset(el: Element) : DomOffset
  function style(el: Element, property: string) : string;
  function height(el: Element) : number;
  function width(el: Element) : number;
  function css(el: Element, css: any) : void;
  function cssBatch(elements: Element[], css: any) : void;
  function ready(fn: Function) : any;
}