import Vue from 'vue'

import { RouterLinkMixin } from '../../mixins/router-link.js'

export default Vue.extend({
  name: 'QItem',

  mixins: [ RouterLinkMixin ],

  props: {
    active: Boolean,
    dark: Boolean,

    clickable: Boolean,
    dense: Boolean,
    insetLevel: Number,

    tabindex: [String, Number],
    tag: {
      type: String,
      default: 'div'
    },

    focused: Boolean,
    manualFocus: Boolean,

    disable: Boolean
  },

  computed: {
    isClickable () {
      return !this.disable && (
        this.clickable ||
        this.hasRouterLink ||
        this.tag === 'a' ||
        this.tag === 'label'
      )
    },

    classes () {
      return {
        'q-item--clickable q-link cursor-pointer': this.isClickable,
        'q-focusable q-hoverable': this.isClickable && this.manualFocus === false,

        'q-manual-focusable': this.isClickable && this.manualFocus === true,
        'q-manual-focusable--focused': this.isClickable && this.focused,

        'q-item--dense': this.dense,
        'q-item--dark': this.dark,
        'q-item--active': this.active,
        [this.activeClass]: this.active && !this.hasRouterLink && this.activeClass,

        'disabled': this.disable
      }
    },

    style () {
      if (this.insetLevel !== void 0) {
        return {
          paddingLeft: (16 + this.insetLevel * 56) + 'px'
        }
      }
    }
  },

  methods: {
    __getContent (h) {
      const child = [].concat(this.$slots.default)
      this.isClickable === true && child.unshift(h('div', { staticClass: 'q-focus-helper' }))
      return child
    },

    __onClick (e) {
      this.$el.blur()
      this.$listeners.click !== void 0 && this.$emit('click', e)
    },

    __onKeyup (e) {
      this.$listeners.keyup !== void 0 && this.$emit('keyup', e)
      e.keyCode === 13 /* ENTER */ && this.__onClick(e)
    }
  },

  render (h) {
    const data = {
      staticClass: 'q-item q-item-type relative-position row no-wrap',
      class: this.classes,
      style: this.style
    }

    if (this.isClickable) {
      data.attrs = {
        tabindex: this.tabindex || '0'
      }
      data[this.hasRouterLink ? 'nativeOn' : 'on'] = Object.assign({}, this.$listeners, {
        click: this.__onClick,
        keyup: this.__onKeyup
      })
    }

    if (this.hasRouterLink) {
      data.tag = 'a'
      data.props = this.routerLinkProps

      return h('router-link', data, this.__getContent(h))
    }

    return h(
      this.tag,
      data,
      this.__getContent(h)
    )
  }
})
