import { routerLinkProps } from '../../utils/router-link.js'

export default {
  name: 'QItem',
  mixins: [{
    props: routerLinkProps
  }],
  props: {
    clickable: Boolean,
    dense: Boolean,
    inset: Boolean,
    dark: Boolean,
    tabindex: {
      type: String,
      default: '0'
    },
    tag: {
      type: String,
      default: 'div'
    }
  },
  computed: {
    isClickable () {
      return this.clickable ||
        this.to !== void 0 ||
        this.tag === 'a' ||
        this.tag === 'label'
    },
    classes () {
      return {
        'q-item--clickable q-link cursor-pointer q-focusable q-hoverable': this.isClickable,
        'q-item--dense': this.dense,
        'q-item--inset': this.inset,
        'q-item--dark': this.dark
      }
    }
  },
  methods: {
    __getContent (h) {
      const child = [].concat(this.$slots.default)

      this.isClickable && child.unshift(h('div', { staticClass: 'q-focus-helper' }))
      return child
    },
    __onClick (e) {
      this.$el.blur()
      this.$emit('click', e)
    },
    __onKeydown (e) {
      e.keyCode === 13 /* ENTER */ && this.__onClick(e)
    }
  },
  render (h) {
    const data = {
      staticClass: 'q-item relative-position row no-wrap',
      'class': this.classes
    }

    if (this.isClickable) {
      data.attrs = {
        tabindex: this.tabindex
      }
      data.on = {
        click: this.__onClick,
        keydown: this.__onKeydown
      }
    }

    if (this.to !== void 0) {
      data.props = Object.assign({}, this.$props, { tag: 'a' })
      return h('router-link', data, this.__getContent(h))
    }

    return h(
      this.tag,
      data,
      this.__getContent(h)
    )
  }
}
