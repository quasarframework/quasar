import Vue from 'vue'

import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QPageSticky',

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
        dir = this.$q.lang.rtl ? -1 : 1

      if (attach.top && this.top) {
        posY = `${this.top}px`
      }
      else if (attach.bottom && this.bottom) {
        posY = `${-this.bottom}px`
      }

      if (attach.left && this.left) {
        posX = `${dir * this.left}px`
      }
      else if (attach.right && this.right) {
        posX = `${-dir * this.right}px`
      }

      const css = { transform: `translate3d(${posX}, ${posY}, 0)` }

      if (this.offset) {
        css.margin = `${this.offset[1]}px ${this.offset[0]}px`
      }

      if (attach.vertical) {
        if (this.left) {
          css[this.$q.lang.rtl ? 'right' : 'left'] = `${this.left}px`
        }
        if (this.right) {
          css[this.$q.lang.rtl ? 'left' : 'right'] = `${this.right}px`
        }
      }
      else if (attach.horizontal) {
        if (this.top) {
          css.top = `${this.top}px`
        }
        if (this.bottom) {
          css.bottom = `${this.bottom}px`
        }
      }

      return css
    },

    classes () {
      return `fixed-${this.position} q-page-sticky--${this.expand ? 'expand' : 'shrink'}`
    }
  },

  render (h) {
    const content = slot(this, 'default')

    return h('div', {
      staticClass: 'q-page-sticky q-layout__section--animate row flex-center',
      class: this.classes,
      style: this.style
    },
    this.expand === true
      ? content
      : [ h('div', content) ]
    )
  }
})
