import Vue from 'vue'

import TouchPan from '../../directives/TouchPan.js'
import { between } from '../../utils/format.js'
import ModelToggleMixin from '../../mixins/model-toggle.js'
import PreventScrollMixin from '../../mixins/prevent-scroll.js'
import slot from '../../utils/slot.js'

const duration = 150

export default Vue.extend({
  name: 'QDrawer',

  inject: {
    layout: {
      default () {
        console.error('QDrawer needs to be child of QLayout')
      }
    }
  },

  mixins: [ ModelToggleMixin, PreventScrollMixin ],

  directives: {
    TouchPan
  },

  props: {
    overlay: Boolean,
    side: {
      type: String,
      default: 'left',
      validator: v => ['left', 'right'].includes(v)
    },
    width: {
      type: Number,
      default: 300
    },
    mini: Boolean,
    miniToOverlay: Boolean,
    miniWidth: {
      type: Number,
      default: 57
    },
    breakpoint: {
      type: Number,
      default: 1023
    },
    behavior: {
      type: String,
      validator: v => ['default', 'desktop', 'mobile'].includes(v),
      default: 'default'
    },
    bordered: Boolean,
    elevated: Boolean,
    persistent: Boolean,
    showIfAbove: Boolean,
    contentStyle: [String, Object, Array],
    contentClass: [String, Object, Array],
    noSwipeOpen: Boolean,
    noSwipeClose: Boolean
  },

  data () {
    const
      largeScreenState = this.showIfAbove === true || (
        this.value !== void 0 ? this.value : true
      ),
      showing = this.behavior !== 'mobile' && this.breakpoint < this.layout.width && this.overlay === false
        ? largeScreenState
        : false

    if (this.value !== void 0 && this.value !== showing) {
      // setTimeout needed otherwise
      // it breaks Vue state
      setTimeout(() => {
        this.$emit('input', showing)
      })
    }

    return {
      showing,
      belowBreakpoint: (
        this.behavior === 'mobile' ||
        (this.behavior !== 'desktop' && this.breakpoint >= this.layout.width)
      ),
      largeScreenState,
      mobileOpened: false
    }
  },

  watch: {
    belowBreakpoint (val) {
      if (this.mobileOpened === true) {
        return
      }

      if (val === true) { // from lg to xs
        if (this.overlay === false) {
          this.largeScreenState = this.showing
        }
        // ensure we close it for small screen
        this.hide(false)
      }
      else if (this.overlay === false) { // from xs to lg
        this[this.largeScreenState ? 'show' : 'hide'](false)
      }
    },

    side (_, oldSide) {
      this.layout[oldSide].space = false
      this.layout[oldSide].offset = 0
    },

    behavior (val) {
      this.__updateLocal('belowBreakpoint', (
        val === 'mobile' ||
        (val !== 'desktop' && this.breakpoint >= this.layout.width)
      ))
    },

    breakpoint (val) {
      this.__updateLocal('belowBreakpoint', (
        this.behavior === 'mobile' ||
        (this.behavior !== 'desktop' && val >= this.layout.width)
      ))
    },

    'layout.width' (val) {
      this.__updateLocal('belowBreakpoint', (
        this.behavior === 'mobile' ||
        (this.behavior !== 'desktop' && this.breakpoint >= val)
      ))
    },

    'layout.scrollbarWidth' () {
      this.applyPosition(this.showing === true ? 0 : void 0)
    },

    offset (val) {
      this.__update('offset', val)
    },

    onLayout (val) {
      this.$listeners['on-layout'] !== void 0 && this.$emit('on-layout', val)
      this.__update('space', val)
    },

    $route () {
      if (
        this.persistent !== true &&
        (this.mobileOpened === true || this.onScreenOverlay === true)
      ) {
        this.hide()
      }
    },

    rightSide () {
      this.applyPosition()
    },

    size (val) {
      this.applyPosition()
      this.__updateSizeOnLayout(this.miniToOverlay, val)
    },

    miniToOverlay (val) {
      this.__updateSizeOnLayout(val, this.size)
    },

    '$q.lang.rtl' () {
      this.applyPosition()
    },

    mini () {
      if (this.value === true) {
        this.__animateMini()
        this.layout.__animate()
      }
    }
  },

  computed: {
    rightSide () {
      return this.side === 'right'
    },

    offset () {
      return this.showing === true && this.mobileOpened === false && this.overlay === false
        ? (this.miniToOverlay === true ? this.miniWidth : this.size)
        : 0
    },

    size () {
      return this.isMini === true
        ? this.miniWidth
        : this.width
    },

    fixed () {
      return this.overlay === true ||
        this.miniToOverlay === true ||
        this.layout.view.indexOf(this.rightSide ? 'R' : 'L') > -1
    },

    onLayout () {
      return this.showing === true && this.mobileView === false && this.overlay === false
    },

    onScreenOverlay () {
      return this.showing === true && this.mobileView === false && this.overlay === true
    },

    backdropClass () {
      return this.showing === false ? 'no-pointer-events' : null
    },

    mobileView () {
      return this.belowBreakpoint === true || this.mobileOpened === true
    },

    headerSlot () {
      return this.rightSide === true
        ? this.layout.rows.top[2] === 'r'
        : this.layout.rows.top[0] === 'l'
    },

    footerSlot () {
      return this.rightSide === true
        ? this.layout.rows.bottom[2] === 'r'
        : this.layout.rows.bottom[0] === 'l'
    },

    aboveStyle () {
      const css = {}

      if (this.layout.header.space === true && this.headerSlot === false) {
        if (this.fixed === true) {
          css.top = `${this.layout.header.offset}px`
        }
        else if (this.layout.header.space === true) {
          css.top = `${this.layout.header.size}px`
        }
      }

      if (this.layout.footer.space === true && this.footerSlot === false) {
        if (this.fixed === true) {
          css.bottom = `${this.layout.footer.offset}px`
        }
        else if (this.layout.footer.space === true) {
          css.bottom = `${this.layout.footer.size}px`
        }
      }

      return css
    },

    style () {
      const style = { width: `${this.size}px` }
      return this.mobileView === true
        ? style
        : Object.assign(style, this.aboveStyle)
    },

    classes () {
      return `q-drawer--${this.side}` +
        (this.bordered === true ? ' q-drawer--bordered' : '') +
        (
          this.mobileView === true
            ? ' fixed q-drawer--on-top q-drawer--mobile q-drawer--top-padding'
            : ` q-drawer--${this.isMini === true ? 'mini' : 'standard'}` +
            (this.fixed === true || this.onLayout !== true ? ' fixed' : '') +
            (this.overlay === true || this.miniToOverlay === true ? ' q-drawer--on-top' : '') +
            (this.headerSlot === true ? ' q-drawer--top-padding' : '')
        )
    },

    stateDirection () {
      return (this.$q.lang.rtl === true ? -1 : 1) * (this.rightSide === true ? 1 : -1)
    },

    isMini () {
      return this.mini === true && this.mobileView !== true
    },

    onNativeEvents () {
      if (this.mobileView !== true) {
        return {
          '!click': e => { this.$emit('click', e) },
          mouseover: e => { this.$emit('mouseover', e) },
          mouseout: e => { this.$emit('mouseout', e) },
          mouseenter: e => { this.$emit('mouseenter', e) },
          mouseleave: e => { this.$emit('mouseleave', e) }
        }
      }
    }
  },

  methods: {
    applyPosition (position) {
      if (position === void 0) {
        this.$nextTick(() => {
          position = this.showing === true ? 0 : this.size

          this.applyPosition(this.stateDirection * position)
        })
      }
      else if (this.$refs.content !== void 0) {
        if (
          this.layout.container === true &&
          this.rightSide === true &&
          (this.mobileView === true || Math.abs(position) === this.size)
        ) {
          position += this.stateDirection * this.layout.scrollbarWidth
        }
        this.$refs.content.style.transform = `translate3d(${position}px, 0, 0)`
      }
    },

    applyBackdrop (x) {
      if (this.$refs.backdrop !== void 0) {
        this.$refs.backdrop.style.backgroundColor =
          this.lastBackdropBg = `rgba(0,0,0,${x * 0.4})`
      }
    },

    __setScrollable (v) {
      if (this.layout.container !== true) {
        document.body.classList[v === true ? 'add' : 'remove']('q-body--drawer-toggle')
      }
    },

    __animateMini () {
      if (this.timerMini !== void 0) {
        clearTimeout(this.timerMini)
      }
      else if (this.$el !== void 0) {
        this.$el.classList.add('q-drawer--mini-animate')
      }
      this.timerMini = setTimeout(() => {
        this.$el !== void 0 && this.$el.classList.remove('q-drawer--mini-animate')
        this.timerMini = void 0
      }, 150)
    },

    __openByTouch (evt) {
      if (this.showing !== false) {
        // some browsers might capture and trigger this
        // even if Drawer has just been opened (but animation is still pending)
        return
      }

      const
        width = this.size,
        position = between(evt.distance.x, 0, width)

      if (evt.isFinal === true) {
        const
          el = this.$refs.content,
          opened = position >= Math.min(75, width)

        el.classList.remove('no-transition')

        if (opened === true) {
          this.show()
        }
        else {
          this.layout.__animate()
          this.applyBackdrop(0)
          this.applyPosition(this.stateDirection * width)
          el.classList.remove('q-drawer--delimiter')
        }

        return
      }

      this.applyPosition(
        (this.$q.lang.rtl === true ? !this.rightSide : this.rightSide)
          ? Math.max(width - position, 0)
          : Math.min(0, position - width)
      )
      this.applyBackdrop(
        between(position / width, 0, 1)
      )

      if (evt.isFirst === true) {
        const el = this.$refs.content
        el.classList.add('no-transition')
        el.classList.add('q-drawer--delimiter')
      }
    },

    __closeByTouch (evt) {
      if (this.showing !== true) {
        // some browsers might capture and trigger this
        // even if Drawer has just been closed (but animation is still pending)
        return
      }

      const
        width = this.size,
        dir = evt.direction === this.side,
        position = (this.$q.lang.rtl === true ? !dir : dir)
          ? between(evt.distance.x, 0, width)
          : 0

      if (evt.isFinal === true) {
        const opened = Math.abs(position) < Math.min(75, width)
        this.$refs.content.classList.remove('no-transition')

        if (opened === true) {
          this.layout.__animate()
          this.applyBackdrop(1)
          this.applyPosition(0)
        }
        else {
          this.hide()
        }

        return
      }

      this.applyPosition(this.stateDirection * position)
      this.applyBackdrop(between(1 - position / width, 0, 1))

      if (evt.isFirst === true) {
        this.$refs.content.classList.add('no-transition')
      }
    },

    __show (evt = true) {
      evt !== false && this.layout.__animate()
      this.applyPosition(0)

      const otherSide = this.layout.instances[this.rightSide === true ? 'left' : 'right']
      if (otherSide !== void 0 && otherSide.mobileOpened === true) {
        otherSide.hide(false)
      }

      if (this.belowBreakpoint === true) {
        this.mobileOpened = true
        this.applyBackdrop(1)
        if (this.layout.container !== true) {
          this.__preventScroll(true)
        }
      }
      else {
        this.__setScrollable(true)
      }

      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.__setScrollable(false)
        this.$emit('show', evt)
      }, duration)
    },

    __hide (evt = true) {
      evt !== false && this.layout.__animate()

      if (this.mobileOpened === true) {
        this.mobileOpened = false
      }

      this.applyPosition(this.stateDirection * this.size)
      this.applyBackdrop(0)

      this.__cleanup()

      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$emit('hide', evt)
      }, duration)
    },

    __cleanup () {
      this.__preventScroll(false)
      this.__setScrollable(false)
    },

    __update (prop, val) {
      if (this.layout[this.side][prop] !== val) {
        this.layout[this.side][prop] = val
      }
    },

    __updateLocal (prop, val) {
      if (this[prop] !== val) {
        this[prop] = val
      }
    },

    __updateSizeOnLayout (miniToOverlay, size) {
      this.__update('size', miniToOverlay === true ? this.miniWidth : size)
    }
  },

  created () {
    this.layout.instances[this.side] = this
    this.__updateSizeOnLayout(this.miniToOverlay, this.size)
    this.__update('space', this.onLayout)
    this.__update('offset', this.offset)
  },

  mounted () {
    this.$listeners['on-layout'] !== void 0 && this.$emit('on-layout', this.onLayout)
    this.applyPosition(this.showing === true ? 0 : void 0)
  },

  beforeDestroy () {
    clearTimeout(this.timer)
    clearTimeout(this.timerMini)
    this.showing === true && this.__cleanup()
    if (this.layout.instances[this.side] === this) {
      this.layout.instances[this.side] = void 0
      this.__update('size', 0)
      this.__update('offset', 0)
      this.__update('space', false)
    }
  },

  render (h) {
    const directives = [{
      name: 'touch-pan',
      modifiers: {
        horizontal: true,
        mouse: true,
        mouseAllDir: true
      },
      value: this.__closeByTouch
    }]

    const child = [
      this.noSwipeOpen !== true && this.belowBreakpoint === true
        ? h('div', {
          staticClass: `q-drawer__opener fixed-${this.side}`,
          directives: [{
            name: 'touch-pan',
            modifiers: {
              horizontal: true,
              mouse: true,
              mouseAllDir: true
            },
            value: this.__openByTouch
          }]
        })
        : null,

      this.mobileView === true ? h('div', {
        ref: 'backdrop',
        staticClass: 'fullscreen q-drawer__backdrop',
        class: this.backdropClass,
        style: this.lastBackdropBg !== void 0
          ? { backgroundColor: this.lastBackdropBg }
          : null,
        on: { click: this.hide },
        directives
      }) : null
    ]

    const content = [
      h('div', {
        staticClass: 'q-drawer__content fit ' + (this.layout.container === true ? 'overflow-auto' : 'scroll'),
        class: this.contentClass,
        style: this.contentStyle
      }, this.isMini === true && this.$scopedSlots.mini !== void 0 ? this.$scopedSlots.mini() : slot(this, 'default'))
    ]

    if (this.elevated === true && this.showing === true) {
      content.push(
        h('div', {
          staticClass: 'q-layout__shadow absolute-full overflow-hidden no-pointer-events'
        })
      )
    }

    return h('div', {
      staticClass: 'q-drawer-container'
    }, child.concat([
      h('aside', {
        ref: 'content',
        staticClass: `q-drawer`,
        class: this.classes,
        style: this.style,
        on: this.onNativeEvents,
        directives: this.mobileView === true && this.noSwipeClose !== true
          ? directives
          : void 0
      }, content)
    ]))
  }
})
