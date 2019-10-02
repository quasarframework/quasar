import Vue from 'vue'

import { stopAndPrevent } from '../../utils/event.js'
import dom from '../../utils/dom'
const { offset } = dom

export default Vue.extend({
  name: 'QZoom',

  props: {
    color: {
      type: String,
      default: 'grey-1'
    },
    restoreOnScroll: Boolean,
    manual: Boolean,
    scale: Boolean,
    initialScale: {
      type: [Number, String],
      default: 1.0,
      validator: v => v >= 0.05 && v <= 10
    },
    scaleText: Boolean,
    initialScaleText: {
      type: [Number, String],
      default: 100,
      validator: v => v >= 50 && v <= 500
    },
    noCenter: Boolean,
    noWheelScale: Boolean,
    noEscClose: Boolean
  },

  data () {
    return {
      vComponent: void 0,
      canShow: false,
      zooming: false,
      zoomed: false,
      restoring: false,
      bgColor: 'grey-1',
      position: void 0,
      scaleValue: 1.0,
      scaleTextValue: 100
    }
  },

  mounted () {
    // add handlers
    document.addEventListener('scroll', this.__onScroll)
    document.addEventListener('keyup', this.__onKeyup)
  },

  beforeDestroy () {
    // remove handlers
    document.removeEventListener('scroll', this.__onScroll)
    document.removeEventListener('keyup', this.__onKeyup)
  },

  computed: {
    classes () {
      return `bg-${this.color}`
    },
    isTransitioning () {
      return this.zooming === true || this.zoomed === true || this.restoring === true
    },
    isZoomed () {
      return this.zoomed === true || this.zooming === true
    },
    fullScreenPosition () {
      return { left: 0, top: 0, width: '100%', height: '100%' }
    }
  },

  methods: {
    zoom () {
      this.$emit('before-zoom')
      this.zooming = true
      this.zoomed = false
      this.restoring = false

      // get current position
      this.position = this.__getPosition()

      setTimeout(() => {
        // start color transition
        this.bgColor = this.color
      }, 50)

      setTimeout(() => {
        // color needs to be finished transition
        // otherwise zooming looks odd
        this.position = this.fullScreenPosition
        this.zoomed = true
        if (this.restoreOnScroll !== true) {
          this.__addClass(document.body, 'q-zoom__no-scroll')
        }
        // adjust initial scaling
        if (this.scale === true && this.scaleText !== true) {
          this.setScale(this.initialScale)
        }
        // adjust initial text scaling
        if (this.scaleText === true && this.scale !== true) {
          this.setScaleText(this.initialScaleText)
        }
        this.$emit('zoomed')
      }, 100)
    },

    restore () {
      this.$emit('before-restore')
      this.restoring = true
      this.zoomed = false
      this.zooming = false

      // reset scaling
      this.setScale(1.0)
      this.setScaleText(100)

      this.position = this.__getPosition()
      setTimeout(() => {
        this.__resetTransition()
        this.__removeClass(document.body, 'q-zoom__no-scroll')
        this.$emit('restored')
      }, 400)
    },

    toggle () {
      if (this.isZoomed) {
        this.restore()
      }
      else {
        this.zoom()
      }
    },

    setScale (val) {
      if (val === this.scaleValue) return
      if (val >= 0.05 && val <= 10) {
        this.scaleValue = val
        this.$emit('scale', this.scaleValue)
      }
    },

    setScaleText (val) {
      if (val === this.scaleTextValue) return
      if (val >= 50 && val <= 500) {
        this.scaleTextValue = val
        this.$emit('scale-text', this.scaleTextValue)
      }
    },

    __onScroll (e) {
      if (this.isZoomed === true && this.restoreOnScroll === true) {
        this.restore()
        stopAndPrevent(e)
      }
    },

    __onKeyup (e) {
      if (e.key === 'Escape') {
        if (this.noEscClose !== true) {
          if (this.isZoomed) {
            this.restore()
            stopAndPrevent(e)
          }
        }
      }
    },

    __onClick (e) {
      if (this.manual !== true) {
        this.toggle()
        stopAndPrevent(e)
      }
    },

    __wheelEvent (e) {
      if (this.noWheelScale !== true) {
        if (this.isZoomed === true && this.scale === true && this.scaleText !== true) {
          let less = this.scaleValue > 1 ? -0.5 : -0.1
          let more = this.scaleValue > 1 ? 0.5 : 0.1
          let val = (e.wheelDeltaY < 0 ? less : more)
          this.setScale(this.scaleValue + val)
          stopAndPrevent(e)
        }
        else if (this.isZoomed === true && this.scaleText === true && this.scale !== true) {
          let val = (e.wheelDeltaY < 0 ? -1 : 1)
          this.setScaleText(this.scaleTextValue + val)
          stopAndPrevent(e)
        }
      }
    },

    __addClass (el, name) {
      let arr = el.className.split(' ')
      // make sure it's not already there
      if (arr.indexOf(name) === -1) {
        arr.push(name)
        el.className = arr.join(' ')
      }
    },

    __removeClass (el, name) {
      let arr = el.className.split(' ')
      let index = arr.indexOf(name)
      if (index !== -1) {
        arr.splice(index, 1)
        el.className = arr.join(' ')
      }
    },

    __resetTransition () {
      this.zoomed = false
      this.zooming = false
      this.restoring = false
      this.bgColor = 'grey-1'
      this.scaleValue = 1.0
      this.scaleTextValue = 100
    },

    __getPosition () {
      let position = offset(this.$el)
      position.left = position.left + 'px'
      position.top = position.top + 'px'
      position.width = this.$el.clientWidth + 'px'
      position.height = this.$el.clientHeight + 'px'

      return position
    },

    // https://jingsam.github.io/2017/03/08/vnode-deep-clone.html
    // with fixes...
    __deepClone (vnodes, createElement) {
      function cloneVNode (vnode) {
        const clonedChildren = vnode.children && vnode
          .children
          .map(vnode => cloneVNode(vnode))
        const cloned = createElement(vnode.tag, vnode.data, clonedChildren)
        cloned.text = vnode.text
        cloned.isComment = vnode.isComment
        cloned.componentOptions = vnode.componentOptions
        cloned.elm = vnode.elm
        cloned.context = vnode.context
        cloned.ns = vnode.ns
        cloned.isStatic = vnode.isStatic
        cloned.key = vnode.key
        return cloned
      }
      return vnodes.map(vnode => cloneVNode(vnode))
    },

    __renderOverlayContent (h) {
      let slot = this.$slots.default
      return h('div', {
        staticClass: 'q-zoom__content' +
          (this.noCenter === true ? ' q-zoom__no-center' : ''),
        class: `bg-${this.color}`,
        style: {
          left: this.position.left,
          top: this.position.top,
          width: this.position.width,
          height: this.position.height,
          transform: this.scale === true && this.scaleText !== true && `scale(${this.scaleValue})!important`,
          fontSize: this.scaleText === true && this.scale !== true && `${this.scaleTextValue}%!important`
        }
      }, [
        slot
      ])
    },

    __renderOverlay (h) {
      if (this.isTransitioning !== true) return ''

      return h('div', {
        staticClass: 'q-zoom__overlay' +
          (this.manual !== true ? ' q-zoom__zoom-out' : ''),
        class: `bg-${this.bgColor}`
      }, [
        this.__renderOverlayContent(h)
      ])
    }
  },

  render (h) {
    let slot = this.$slots.default

    return h('div', {
      staticClass: 'q-zoom' +
        (this.manual !== true ? ' q-zoom__zoom-in' : ''),
      on: {
        click: this.__onClick,
        mousewheel: this.__wheelEvent
      }
    }, [
      // the original slot is basically read-only and cannot be modified
      ...this.__deepClone(slot, h),
      this.isTransitioning && this.__renderOverlay(h)
    ])
  }
})
