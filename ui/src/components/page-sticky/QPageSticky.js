import Vue from 'vue'

import ListenersMixin from '../../mixins/listeners.js'

import { slot } from '../../utils/slot.js'

export default Vue.extend({
  name: 'QPageSticky',

  mixins: [ ListenersMixin ],

  inject: {
    layout: {
      default () {
        console.error('QPageSticky needs to be child of QLayout')
      }
    }
  },

  props: {
    position: {
      type: String,
      default: 'bottom-right',
      validator: v => [
        'top-right', 'top-left',
        'bottom-right', 'bottom-left',
        'top', 'right', 'bottom', 'left'
      ].includes(v)
    },
    offset: {
      type: Array,
      validator: v => v.length === 2
    },
    expand: Boolean
  },

  computed: {
    attach () {
      const pos = this.position

      return {
        top: pos.indexOf('top') > -1,
        right: pos.indexOf('right') > -1,
        bottom: pos.indexOf('bottom') > -1,
        left: pos.indexOf('left') > -1,
        vertical: pos === 'top' || pos === 'bottom',
        horizontal: pos === 'left' || pos === 'right'
      }
    },

    top () {
      return this.layout.header.offset
    },

    right () {
      return this.layout.right.offset
    },

    bottom () {
      return this.layout.footer.offset
    },

    left () {
      return this.layout.left.offset
    },

    style () {
      let
        posX = 0,
        posY = 0

      const
        attach = this.attach,
        dir = this.$q.lang.rtl === true ? -1 : 1

      if (attach.top === true && this.top !== 0) {
        posY = `${this.top}px`
      }
      else if (attach.bottom === true && this.bottom !== 0) {
        posY = `${-this.bottom}px`
      }

      if (attach.left === true && this.left !== 0) {
        posX = `${dir * this.left}px`
      }
      else if (attach.right === true && this.right !== 0) {
        posX = `${-dir * this.right}px`
      }

      const css = { transform: `translate(${posX}, ${posY})` }

      if (this.offset) {
        css.margin = `${this.offset[1]}px ${this.offset[0]}px`
      }

      if (attach.vertical === true) {
        if (this.left !== 0) {
          css[this.$q.lang.rtl === true ? 'right' : 'left'] = `${this.left}px`
        }
        if (this.right !== 0) {
          css[this.$q.lang.rtl === true ? 'left' : 'right'] = `${this.right}px`
        }
      }
      else if (attach.horizontal === true) {
        if (this.top !== 0) {
          css.top = `${this.top}px`
        }
        if (this.bottom !== 0) {
          css.bottom = `${this.bottom}px`
        }
      }

      return css
    },

    classes () {
      return `fixed-${this.position} q-page-sticky--${this.expand === true ? 'expand' : 'shrink'}`
    }
  },

  render (h) {
    const content = slot(this, 'default')

    return h('div', {
      staticClass: 'q-page-sticky row flex-center',
      class: this.classes,
      style: this.style,
      on: { ...this.qListeners }
    },
    this.expand === true
      ? content
      : [ h('div', content) ]
    )
  }
})
