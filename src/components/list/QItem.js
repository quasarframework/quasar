import Vue from 'vue'

import { RouterLinkMixin } from '../../mixins/router-link.js'

export default Vue.extend({
  name: 'QItem',

  mixins: [ RouterLinkMixin ],

  props: {
    active: Boolean,
    clickable: Boolean,
    dense: Boolean,
    inset: Boolean,
    dark: Boolean,
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
        'q-item--inset': this.inset,
        'q-item--dark': this.dark,
        'q-item--active': this.active,

        'disabled': this.disable
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
      staticClass: 'q-item q-item-type relative-position row',
      class: this.classes
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
