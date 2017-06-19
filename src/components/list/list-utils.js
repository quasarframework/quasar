export function textStyle (n) {
  return n === void 0 || n < 2
    ? {}
    : {overflow: 'hidden', display: '-webkit-box', '-webkit-box-orient': 'vertical', '-webkit-line-clamp': n}
}

const list = ['icon', 'label', 'sublabel', 'image', 'avatar', 'letter', 'stamp']

export function getType (prop) {
  const len = list.length
  for (let i = 0; i < len; i++) {
    if (prop[list[i]]) {
      return list[i]
    }
  }
  return ''
}

export function itemClasses (prop) {
  return {
    'q-item': true,
    'q-item-division': true,
    'relative-position': true,
    'q-item-dark': prop.dark,
    'q-item-dense': prop.dense,
    'q-item-sparse': prop.sparse,
    'q-item-separator': prop.separator,
    'q-item-inset-separator': prop.insetSeparator,
    'q-item-multiline': prop.multiline,
    'q-item-highlight': prop.highlight,
    'q-item-link': prop.to || prop.link
  }
}

export const ItemMixin = {
  props: {
    dark: Boolean,
    dense: Boolean,
    sparse: Boolean,
    separator: Boolean,
    insetSeparator: Boolean,
    multiline: Boolean,
    highlight: Boolean,
    tag: {
      type: String,
      default: 'div'
    }
  }
}
