import Vue from 'vue'

import TouchPan from '../../directives/TouchPan.js'

import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QSlideItem',

  props: {
    leftColor: String,
    rightColor: String,
    topColor: String,
    bottomColor: String
  },

  directives: {
    TouchPan
  },

  methods: {
    reset () {
      this.$refs.content.style.transform = `translate3d(0,0,0)`
    },

    __pan (evt) {
      const node = this.$refs.content

      if (evt.isFirst) {
        this.__dir = null
        this.__size = { left: 0, right: 0, top: 0, bottom: 0 }
        this.__scale = 0
        node.classList.add('no-transition')

        if (this.$scopedSlots.left !== void 0) {
          const slot = this.$refs.leftContent
          slot.style.transform = `scale3d(1,1,1)`
          this.__size.left = slot.getBoundingClientRect().width
        }

        if (this.$scopedSlots.right !== void 0) {
          const slot = this.$refs.rightContent
          slot.style.transform = `scale3d(1,1,1)`
          this.__size.right = slot.getBoundingClientRect().width
        }

        if (this.$scopedSlots.top !== void 0) {
          const slot = this.$refs.topContent
          slot.style.transform = `scale3d(1,1,1)`
          this.__size.top = slot.getBoundingClientRect().height
        }

        if (this.$scopedSlots.bottom !== void 0) {
          const slot = this.$refs.bottomContent
          slot.style.transform = `scale3d(1,1,1)`
          this.__size.bottom = slot.getBoundingClientRect().height
        }
      }
      else if (evt.isFinal) {
        node.classList.remove('no-transition')

        if (this.__scale === 1) {
          if (Math.abs(this.__dir) === 2) {
            node.style.transform = `translate3d(0,${this.__dir * 50}%,0)`
          }
          else {
            node.style.transform = `translate3d(${this.__dir * 100}%,0,0)`
          }
          this.timer = setTimeout(() => {
            this.$emit(this.__showing, { reset: this.reset })
            this.$emit('action', { side: this.__showing, reset: this.reset })
          }, 230)
        }
        else {
          node.style.transform = `translate3d(0,0,0)`
        }

        return
      }

      if (
        (this.$scopedSlots.left === void 0 && evt.direction === 'right') ||
        (this.$scopedSlots.right === void 0 && evt.direction === 'left') ||
        (this.$scopedSlots.top === void 0 && evt.direction === 'down') ||
        (this.$scopedSlots.bottom === void 0 && evt.direction === 'up')
      ) {
        node.style.transform = `translate3d(0,0,0)`
        return
      }

      const
        vertical = (evt.direction === 'up' || evt.direction === 'down')

      let
        showing = '',
        dir = 0,
        dist = 0,
        scale = 1,
        otherSlots = [],
        content = null

      if (vertical === false) {
        dir = evt.direction === 'left' ? -1 : 1
        showing = dir * (this.$q.lang.rtl === true ? -1 : 1) === 1 ? 'left' : 'right'
        otherSlots = [ 'top', 'bottom', (showing === 'left' ? 'right' : 'left') ]
        dist = evt.distance.x
      }
      else {
        dir = evt.direction === 'up' ? -2 : 2
        showing = dir === 2 ? 'top' : 'bottom'
        otherSlots = [ 'left', 'right', (showing === 'top' ? 'bottom' : 'top') ]
        dist = evt.distance.y
      }

      if (this.__dir !== null && Math.abs(dir) !== Math.abs(this.__dir)) {
        return
      }

      if (this.__dir !== dir) {
        otherSlots.forEach((d) => {
          this.$refs[d] !== void 0 && (this.$refs[d].style.visibility = 'hidden')
        })
        this.$refs[showing] !== void 0 && (this.$refs[showing].style.visibility = 'visible')
        this.__showing = showing
        this.__dir = dir
      }

      content = this.$refs[`${showing}Content`]
      scale = Math.max(0, Math.min(1, (dist - 40) / this.__size[showing]))

      this.__scale = scale

      dir = dir / Math.abs(dir)

      if (vertical === false) {
        node.style.transform = `translate3d(${dist * dir}px,0,0)`
      }
      else {
        node.style.transform = `translate3d(0,${dist * dir}px,0)`
      }

      content.style.transform = `scale3d(${scale},${scale},1)`
    }
  },

  render (h) {
    let
      content = [],
      left = this.$scopedSlots.left !== void 0,
      right = this.$scopedSlots.right !== void 0,
      top = this.$scopedSlots.top !== void 0,
      bottom = this.$scopedSlots.bottom !== void 0

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

    if (top) {
      content.push(
        h('div', {
          ref: 'top',
          staticClass: 'q-slide-item__top absolute-full row no-wrap items-start justify-center',
          class: this.topColor ? `bg-${this.topColor}` : ''
        }, [
          h('div', { ref: 'topContent' }, slot(this, 'top'))
        ])
      )
    }

    if (bottom) {
      content.push(
        h('div', {
          ref: 'bottom',
          staticClass: 'q-slide-item__bottom absolute-full row no-wrap items-end justify-center',
          class: this.bottomColor ? `bg-${this.bottomColor}` : ''
        }, [
          h('div', { ref: 'bottomContent' }, slot(this, 'bottom'))
        ])
      )
    }

    content.push(
      h('div', {
        ref: 'content',
        staticClass: 'q-slide-item__content',
        directives: (left || right || top || bottom) ? [{
          name: 'touch-pan',
          value: this.__pan,
          modifiers: {
            horizontal: (left || right),
            vertical: (top || bottom),
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
