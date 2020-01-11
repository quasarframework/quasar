import Vue from 'vue'

import QIcon from '../icon/QIcon.js'
import QSpinner from '../spinner/QSpinner.js'

import BtnMixin from '../../mixins/btn.js'

import { mergeSlot } from '../../utils/slot.js'
import { stop, prevent, stopAndPrevent, listenOpts } from '../../utils/event.js'
import { getTouchTarget } from '../../utils/touch.js'
import { isKeyCode } from '../../utils/key-composition.js'

const { passiveCapture } = listenOpts

let
  touchTarget = void 0,
  keyboardTarget = void 0,
  mouseTarget = void 0

export default Vue.extend({
  name: 'QBtn',

  mixins: [ BtnMixin ],

  props: {
    percentage: Number,
    darkPercentage: Boolean
  },

  computed: {
    hasLabel () {
      return this.label !== void 0 && this.label !== null && this.label !== ''
    },

    computedRipple () {
      return this.ripple === false
        ? false
        : Object.assign(
          { keyCodes: [] },
          this.ripple === true ? {} : this.ripple
        )
    },

    percentageStyle () {
      const val = Math.max(0, Math.min(100, this.percentage))
      if (val > 0) {
        return { transition: 'transform 0.6s', transform: `translateX(${val - 100}%)` }
      }
    }
  },

  methods: {
    click (e) {
      if (e !== void 0) {
        if (e.defaultPrevented === true) {
          return
        }

        const el = document.activeElement
        // focus button if it came from ENTER on form
        // prevent the new submit (already done)
        if (
          this.type === 'submit' &&
          (
            (this.$q.platform.is.ie === true && (e.clientX < 0 || e.clientY < 0)) ||
            (
              el !== document.body &&
              this.$el.contains(el) === false &&
              // required for iOS and desktop Safari
              el.contains(this.$el) === false
            )
          )
        ) {
          this.$el.focus()

          const onClickCleanup = () => {
            document.removeEventListener('keydown', stopAndPrevent, true)
            document.removeEventListener('keyup', onClickCleanup, passiveCapture)
            this.$el !== void 0 && this.$el.removeEventListener('blur', onClickCleanup, passiveCapture)
          }

          document.addEventListener('keydown', stopAndPrevent, true)
          document.addEventListener('keyup', onClickCleanup, passiveCapture)
          this.$el.addEventListener('blur', onClickCleanup, passiveCapture)
        }

        this.hasRouterLink === true && stopAndPrevent(e)
      }

      const go = () => {
        const res = this.$router[this.replace === true ? 'replace' : 'push'](this.to)

        // vue-router now throwing error if navigating
        // to the same route that the user is currently at
        // https://github.com/vuejs/vue-router/issues/2872
        if (res !== void 0 && typeof res.catch === 'function') {
          res.catch(() => {})
        }
      }

      this.$emit('click', e, go)
      this.hasRouterLink === true && e.navigate !== false && go()
    },

    __onKeydown (e) {
      if (isKeyCode(e, [ 13, 32 ]) === true) {
        stopAndPrevent(e)

        if (keyboardTarget !== this.$el) {
          keyboardTarget !== void 0 && this.__cleanup()

          // focus external button if the focus helper was focused before
          this.$el.focus()

          keyboardTarget = this.$el
          this.$el.classList.add('q-btn--active')
          document.addEventListener('keyup', this.__onPressEnd, true)
          this.$el.addEventListener('blur', this.__onPressEnd, passiveCapture)
        }
      }

      this.$emit('keydown', e)
    },

    __onTouchstart (e) {
      if (touchTarget !== this.$el) {
        touchTarget !== void 0 && this.__cleanup()
        touchTarget = this.$el
        const target = this.touchTargetEl = getTouchTarget(e.target)
        target.addEventListener('touchcancel', this.__onPressEnd, passiveCapture)
        target.addEventListener('touchend', this.__onPressEnd, passiveCapture)
      }

      this.$emit('touchstart', e)
    },

    __onMousedown (e) {
      if (mouseTarget !== this.$el) {
        mouseTarget !== void 0 && this.__cleanup()
        mouseTarget = this.$el
        this.$el.classList.add('q-btn--active')
        document.addEventListener('mouseup', this.__onPressEnd, passiveCapture)
      }

      this.$emit('mousedown', e)
    },

    __onPressEnd (e) {
      // needed for IE (because it emits blur when focusing button from focus helper)
      if (e !== void 0 && e.type === 'blur' && document.activeElement === this.$el) {
        return
      }

      if (e !== void 0 && e.type === 'keyup') {
        if (keyboardTarget === this.$el && isKeyCode(e, [ 13, 32 ]) === true) {
          // for click trigger
          const evt = new MouseEvent('click', e)
          evt.qKeyEvent = true
          e.defaultPrevented === true && prevent(evt)
          e.cancelBubble === true && stop(evt)
          this.$el.dispatchEvent(evt)

          stopAndPrevent(e)

          // for ripple
          e.qKeyEvent = true
        }

        this.$emit('keyup', e)
      }

      this.__cleanup()
    },

    __cleanup (destroying) {
      if (
        destroying !== true &&
        (touchTarget === this.$el || mouseTarget === this.$el) &&
        this.$refs.blurTarget !== void 0 &&
        this.$refs.blurTarget !== document.activeElement
      ) {
        this.$refs.blurTarget.focus()
      }

      if (touchTarget === this.$el) {
        const target = this.touchTargetEl
        target.removeEventListener('touchcancel', this.__onPressEnd, passiveCapture)
        target.removeEventListener('touchend', this.__onPressEnd, passiveCapture)
        touchTarget = this.touchTargetEl = void 0
      }

      if (mouseTarget === this.$el) {
        document.removeEventListener('mouseup', this.__onPressEnd, passiveCapture)
        mouseTarget = void 0
      }

      if (keyboardTarget === this.$el) {
        document.removeEventListener('keyup', this.__onPressEnd, true)
        this.$el !== void 0 && this.$el.removeEventListener('blur', this.__onPressEnd, passiveCapture)
        keyboardTarget = void 0
      }

      this.$el !== void 0 && this.$el.classList.remove('q-btn--active')
    }
  },

  beforeDestroy () {
    this.__cleanup(true)
  },

  render (h) {
    let inner = []
    const data = {
      staticClass: 'q-btn q-btn-item non-selectable no-outline',
      class: this.classes,
      style: this.style,
      attrs: this.attrs
    }

    if (this.isActionable === true) {
      data.on = {
        ...this.$listeners,
        click: this.click,
        keydown: this.__onKeydown,
        mousedown: this.__onMousedown
      }

      if (this.$q.platform.has.touch === true) {
        data.on.touchstart = this.__onTouchstart
      }
    }

    if (this.disable !== true && this.ripple !== false) {
      data.directives = [{
        name: 'ripple',
        value: this.computedRipple,
        modifiers: { center: this.isRound }
      }]
    }

    this.icon !== void 0 && inner.push(
      h(QIcon, {
        props: { name: this.icon, left: this.stack === false && this.hasLabel === true }
      })
    )

    this.hasLabel === true && inner.push(
      h('div', [ this.label ])
    )

    inner = mergeSlot(inner, this, 'default')

    if (this.iconRight !== void 0 && this.isRound === false) {
      inner.push(
        h(QIcon, {
          props: { name: this.iconRight, right: this.stack === false && this.hasLabel === true }
        })
      )
    }

    const child = [
      h('div', {
        staticClass: 'q-focus-helper',
        ref: 'blurTarget',
        attrs: { tabindex: -1 }
      })
    ]

    this.loading === true && this.percentage !== void 0 && child.push(
      h('div', {
        staticClass: 'q-btn__progress absolute-full overflow-hidden'
      }, [
        h('div', {
          staticClass: 'q-btn__progress-indicator fit',
          class: this.darkPercentage === true ? 'q-btn__progress--dark' : '',
          style: this.percentageStyle
        })
      ])
    )

    child.push(
      h('div', {
        staticClass: 'q-btn__wrapper col row q-anchor--skip'
      }, [
        h('div', {
          staticClass: 'q-btn__content text-center col items-center q-anchor--skip',
          class: this.innerClasses
        }, inner)
      ])
    )

    this.loading !== null && child.push(
      h('transition', {
        props: { name: 'q-transition--fade' }
      }, this.loading === true ? [
        h('div', {
          key: 'loading',
          staticClass: 'absolute-full flex flex-center'
        }, this.$scopedSlots.loading !== void 0 ? this.$scopedSlots.loading() : [ h(QSpinner) ])
      ] : void 0)
    )

    return h(this.isLink === true ? 'a' : 'button', data, child)
  }
})
