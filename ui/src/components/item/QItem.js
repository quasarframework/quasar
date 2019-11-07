import Vue from 'vue'

import DarkMixin from '../../mixins/dark.js'
import { RouterLinkMixin } from '../../mixins/router-link.js'
import slot from '../../utils/slot.js'
import { stopAndPrevent } from '../../utils/event.js'

export default Vue.extend({
  name: 'QItem',

  mixins: [ DarkMixin, RouterLinkMixin ],

  props: {
    active: Boolean,

    clickable: Boolean,
    dense: Boolean,
    insetLevel: Number,

    tabindex: [ String, Number ],
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
        'q-item--dark': this.isDark,
        'q-item--active': this.active,
        [this.activeClass]: this.active === true && this.hasRouterLink !== true && this.activeClass !== void 0,

        'disabled': this.disable
      }
    },

    style () {
      if (this.insetLevel !== void 0) {
        const dir = this.$q.lang.rtl === true ? 'Right' : 'Left'
        return {
          ['padding' + dir]: (16 + this.insetLevel * 56) + 'px'
        }
      }
    }
  },

  methods: {
    __getContent (h) {
      const child = [].concat(slot(this, 'default'))
      this.isClickable === true && child.unshift(h('div', { staticClass: 'q-focus-helper', attrs: { tabindex: -1 }, ref: 'blurTarget' }))
      return child
    },

    __onClick (e) {
      if (this.isClickable === true) {
        if (e.qKeyEvent !== true && this.$refs.blurTarget !== void 0) {
          this.$refs.blurTarget.focus()
        }

        this.$emit('click', e)
      }
    },

    __onKeyup (e) {
      if (e.keyCode === 13 && this.isClickable === true) {
        stopAndPrevent(e)

        // for ripple
        e.qKeyEvent = true

        // for click trigger
        const evt = new MouseEvent('click', e)
        evt.qKeyEvent = true
        this.$el.dispatchEvent(evt)
      }

      this.$emit('keyup', e)
    }
  },

  render (h) {
    const data = {
      staticClass: 'q-item q-item-type row no-wrap',
      class: this.classes,
      style: this.style
    }

    const evtProp = this.hasRouterLink === true ? 'nativeOn' : 'on'
    data[evtProp] = {
      ...this.$listeners,
      click: this.__onClick,
      keyup: this.__onKeyup
    }

    if (this.isClickable === true) {
      data.attrs = {
        tabindex: this.tabindex || '0'
      }
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
