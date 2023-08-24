// Cannot use `Record<string, string>` as TS would error out about `template` signature
// See: https://basarat.gitbook.io/typescript/type-system/index-signatures#all-members-must-conform-to-the-string-index-signature
type MetaTagOptions = Record<string, any> & {
  template?: (attributeValue: string) => string;
};

export interface MetaOptions {
  title?: string;
  titleTemplate?(title: string): string;
  meta?: { [name: string]: MetaTagOptions };
  link?: { [name: string]: Record<string, string> };
  script?: { [name: string]: Record<string, string> };
  htmlAttr?: { [name: string]: string | undefined };
  bodyAttr?: { [name: string]: string | undefined };
  noscript?: { [name: string]: string };
}
