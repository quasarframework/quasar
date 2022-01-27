export type VueClassObjectProp = {
  [value: string]: any
}

export type VueClassProp =
  | string
  | Array<VueClassProp>
  | VueClassObjectProp;

export type VueStyleObjectProp = Partial<CSSStyleDeclaration>;

export type VueStyleProp =
  | string
  | Array<VueStyleProp>
  | VueStyleObjectProp;
