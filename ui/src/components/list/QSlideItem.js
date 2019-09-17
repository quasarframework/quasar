import Vue from 'vue'

import TouchPan from '../../directives/TouchPan.js'

import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QSlideItem',

  props: {
    leftColor: String,
    rightColor: String
  },

  directives: {
    TouchPan
  },

  methods: {
    reset () {
      this.$refs.content.style.transform = `translateX(0)`
    },

    __pan (evt) {
      const node = this.$refs.content

      if (evt.isFirst) {
        this.__dir = null
        this.__size = { left: 0, right: 0 }
        this.__scale = 0
        node.classList.add('no-transition')

        if (this.$scopedSlots.left !== void 0) {
          const slot = this.$refs.leftContent
          slot.style.transform = `scale(1)`
          this.__size.left = slot.getBoundingClientRect().width
        }

        if (this.$scopedSlots.right !== void 0) {
          const slot = this.$refs.rightContent
          slot.style.transform = `scale(1)`
          this.__size.right = slot.getBoundingClientRect().width
        }
      }
      else if (evt.isFinal) {
        node.classList.remove('no-transition')

        if (this.__scale === 1) {
          node.style.transform = `translateX(${this.__dir * 100}%)`
          this.timer = setTimeout(() => {
            this.$emit(this.__showing, { reset: this.reset })
            this.$emit('action', { side: this.__showing, reset: this.reset })
          }, 230)
        }
        else {
          node.style.transform = `translateX(0)`
        }

        return
      }

      if (
        (this.$scopedSlots.left === void 0 && evt.direction === 'right') ||
        (this.$scopedSlots.right === void 0 && evt.direction === 'left')
      ) {
        node.style.transform = `translateX(0)`
        return
      }

      const
        dir = evt.direction === 'left' ? -1 : 1,
        showing = dir * (this.$q.lang.rtl === true ? -1 : 1) === 1 ? 'left' : 'right',
        otherDir = showing === 'left' ? 'right' : 'left',
        dist = evt.distance.x,
        scale = Math.max(0, Math.min(1, (dist - 40) / this.__size[showing])),
        content = this.$refs[`${showing}Content`]

      if (this.__dir !== dir) {
        this.$refs[otherDir] !== void 0 && (this.$refs[otherDir].style.visibility = 'hidden')
        this.$refs[showing] !== void 0 && (this.$refs[showing].style.visibility = 'visible')
        this.__showing = showing
        this.__dir = dir
      }

      this.__scale = scale
      node.style.transform = `translateX(${dist * dir}px)`

      if (dir === 1) {
        content.style.transform = `scale(${scale})`
      }
      else {
        content.style.transform = `scale(${scale})`
      }
    }
  },

  render (h) {
    let
      content = [],
      left = this.$scopedSlots.left !== void 0,
      right = this.$scopedSlots.right !== void 0

    if (left) {
      content.push(
        h('div', {
          ref: 'left',
          staticClass: 'q-slide-item__left absolute-full row no-wrap items-center justify-start',
          class: this.leftColor ? `bg-${this.leftColor}` : ''
        }, [
          h('div', { ref: 'leftContent' }, slot(this, 'left'))
        ])
      )
    }

    if (right) {
      content.push(
        h('div', {
          ref: 'right',
          staticClass: 'q-slide-item__right absolute-full row no-wrap items-center justify-end',
          class: this.rightColor ? `bg-${this.rightColor}` : ''
        }, [
          h('div', { ref: 'rightContent' }, slot(this, 'right'))
        ])
      )
    }

    content.push(
      h('div', {
        ref: 'content',
        staticClass: 'q-slide-item__content',
        directives: left || right ? [{
          name: 'touch-pan',
          value: this.__pan,
          modifiers: {
            horizontal: true,
            prevent: true,
            stop: true,
            mouse: true,
            mouseAllDir: true
          }
        }] : null
      }, slot(this, 'default'))
    )

    return h('div', {
      staticClass: 'q-slide-item q-item-type overflow-hidden'
    }, content)
  },

  beforeDestroy () {
    clearTimeout(this.timer)
  }
})
