import { routerLinkProps } from '../utils/router-link.js'

export function textStyle (n) {
  return n === void 0 || n < 2
    ? {}
    : {overflow: 'hidden', display: '-webkit-box', '-webkit-box-orient': 'vertical', '-webkit-line-clamp': n}
}

export const subItemProps = {
  icon: String,
  rightIcon: String,
  image: String,
  rightImage: String,
  avatar: String,
  rightAvatar: String,
  letter: String,
  rightLetter: String,
  label: String,
  sublabel: String,
  labelLines: [String, Number],
  sublabelLines: [String, Number]
}

export default {
  mixins: [{ props: routerLinkProps }],
  props: {
    dark: Boolean,

    link: Boolean,
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
  },
  computed: {
    itemClasses () {
      return {
        'q-item': true,
        'q-item-division': true,
        'relative-position': true,
        'q-item-dark': this.dark,
        'q-item-dense': this.dense,
        'q-item-sparse': this.sparse,
        'q-item-separator': this.separator,
        'q-item-inset-separator': this.insetSeparator,
        'q-item-multiline': this.multiline,
        'q-item-highlight': this.highlight,
        'q-item-link': this.to || this.link
      }
    }
  }
}
