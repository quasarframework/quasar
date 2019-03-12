import Vue from 'vue'

import { RouterLinkMixin } from '../../mixins/router-link.js'
import slot from '../../utils/slot.js'

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
    manualFocus: Boolean
  },

  computed: {
    isClickable () {
      return this.disable !== true && (
        this.clickable === true ||
        this.hasRouterLink === true ||
        this.tag === 'a' ||
        this.tag === 'label'
      )
    },

    classes () {
      return {
        'q-item--clickable q-link cursor-pointer': this.isClickable,
        'q-focusable q-hoverable': this.isClickable === true && this.manualFocus === false,

        'q-manual-focusable': this.isClickable === true && this.manualFocus === true,
        'q-manual-focusable--focused': this.isClickable === true && this.focused === true,

        'q-item--dense': this.dense,
        'q-item--dark': this.dark,
        'q-item--active': this.active,
        [this.activeClass]: this.active === true && this.hasRouterLink !== true && this.activeClass !== void 0,

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
      const child = [].concat(slot(this, 'default'))
      this.isClickable === true && child.unshift(h('div', { staticClass: 'q-focus-helper' }))
      return child
    },

    __onClick (e, avoidClick) {
      this.$el.blur()
      if (avoidClick !== true && this.$listeners.click !== void 0) {
        this.$emit('click', e)
      }
    },

    __onKeyup (e) {
      this.$listeners.keyup !== void 0 && this.$emit('keyup', e)
      e.keyCode === 13 /* ENTER */ && this.__onClick(e, true)
    }
  },

  render (h) {
    const evtProp = this.hasRouterLink === true ? 'nativeOn' : 'on'

    const data = {
      staticClass: 'q-item q-item-type relative-position row no-wrap',
      class: this.classes,
      style: this.style
    }

    if (this.isClickable === true) {
      data.attrs = {
        tabindex: this.tabindex || '0'
      }
      data[evtProp] = {
        ...this.$listeners,
        click: this.__onClick,
        keyup: this.__onKeyup
      }
    }
    else {
      data[evtProp] = this.$listeners
    }

    if (this.hasRouterLink === true) {
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
