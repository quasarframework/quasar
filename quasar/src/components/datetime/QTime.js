import Vue from 'vue'

import QBtn from '../btn/QBtn.js'
import TouchPan from '../../directives/TouchPan.js'

import { splitTime } from '../../utils/date.js'
import { position } from '../../utils/event.js'
import { isDeepEqual } from '../../utils/is.js'
import DateTimeMixin from './datetime-mixin.js'

export default Vue.extend({
  name: 'QTime',

  mixins: [ DateTimeMixin ],

  directives: {
    TouchPan
  },

  props: {
    format24h: {
      type: Boolean,
      default: null
    },

    options: Function,
    hourOptions: Array,
    minuteOptions: Array,
    secondOptions: Array,

    withSeconds: Boolean,
    nowBtn: Boolean
  },

  data () {
    const model = this.__getNumberModel(this.value)

    let view = 'Hour'

    if (model.hour !== null) {
      if (model.minute === null) {
        view = 'Minute'
      }
      else if (this.withSeconds && model.second === null) {
        view = 'Second'
      }
    }

    return {
      view,
      isAM: model.hour === null || model.hour < 12,
      innerModel: model
    }
  },

  watch: {
    value (v) {
      const model = this.__getNumberModel(v)

      if (isDeepEqual(model, this.innerModel) === false) {
        this.innerModel = model

        if (model.hour === null) {
          this.view = 'Hour'
        }
        else {
          this.isAM = model.hour < 12
        }
      }
    }
  },

  computed: {
    classes () {
      return {
        'q-time--dark': this.dark,
        'q-time--readonly': this.readonly,
        'disabled': this.disable,
        [`q-time--${this.landscape === true ? 'landscape' : 'portrait'}`]: true
      }
    },

    stringModel () {
      const time = this.innerModel

      return {
        hour: time.hour === null
          ? '--'
          : (
            this.computedFormat24h === true
              ? this.__pad(time.hour)
              : String(
                this.isAM === true
                  ? (time.hour === 0 ? 12 : time.hour)
                  : (time.hour > 12 ? time.hour - 12 : time.hour)
              )
          ),
        minute: time.minute === null
          ? '--'
          : this.__pad(time.minute),
        second: time.second === null
          ? '--'
          : this.__pad(time.second)
      }
    },

    computedFormat24h () {
      return this.format24h !== null
        ? this.format24h
        : this.$q.lang.date.format24h
    },

    pointerStyle () {
      const
        forHour = this.view === 'Hour',
        divider = forHour ? 12 : 60,
        amount = this.innerModel[this.view.toLowerCase()],
        degrees = Math.round(amount * (360 / divider)) - 180

      let transform = `rotate3d(0,0,1,${degrees}deg) translate3d(-50%,0,0)`

      if (forHour && this.computedFormat24h && !(this.innerModel.hour > 0 && this.innerModel.hour < 13)) {
        transform += ' scale3d(.7,.7,.7)'
      }

      return { transform }
    },

    minLink () {
      return this.innerModel.hour !== null
    },

    secLink () {
      return this.minLink && this.innerModel.minute !== null
    },

    hourInSelection () {
      return this.hourOptions !== void 0
        ? val => this.hourOptions.includes(val)
        : (
          this.options !== void 0
            ? val => this.options(val, null, null)
            : void 0
        )
    },

    minuteInSelection () {
      return this.minuteOptions !== void 0
        ? val => this.minuteOptions.includes(val)
        : (
          this.options !== void 0
            ? val => this.options(this.innerModel.hour, val, null)
            : void 0
        )
    },

    secondInSelection () {
      return this.secondOptions !== void 0
        ? val => this.secondOptions.includes(val)
        : (
          this.options !== void 0
            ? val => this.options(this.innerModel.hour, this.innerModel.minute, val)
            : void 0
        )
    },

    positions () {
      let start, end, offset = 0, step = 1, inSel

      if (this.view === 'Hour') {
        inSel = this.hourInSelection

        if (this.computedFormat24h === true) {
          start = 0
          end = 23
        }
        else {
          start = 0
          end = 11

          if (this.isAM === false) {
            offset = 12
          }
        }
      }
      else {
        start = 0
        end = 55
        step = 5

        if (this.view === 'Minute') {
          inSel = this.minuteInSelection
        }
        else {
          inSel = this.secondInSelection
        }
      }

      const pos = []

      for (let val = start, index = start; val <= end; val += step, index++) {
        const
          actualVal = val + offset,
          disable = inSel !== void 0 && inSel(actualVal) === false,
          label = this.view === 'Hour' && val === 0
            ? (this.format24h === true ? '00' : '12')
            : val

        pos.push({ val: actualVal, index, disable, label })
      }

      return pos
    }
  },

  methods: {
    __click (evt) {
      this.__drag({ isFirst: true, evt })
      this.__drag({ isFinal: true, evt })
    },

    __drag (event) {
      if (event.isFirst) {
        const
          clock = this.$refs.clock,
          { top, left, width } = clock.getBoundingClientRect(),
          dist = width / 2

        this.dragging = {
          top: top + dist,
          left: left + dist,
          dist: dist * 0.7
        }
        this.dragCache = null
        this.__updateClock(event.evt)
      }
      else if (event.isFinal) {
        this.__updateClock(event.evt)
        this.dragging = false

        if (this.view === 'Hour') {
          this.view = 'Minute'
        }
        else if (this.withSeconds && this.view === 'Minute') {
          this.view = 'Second'
        }
      }
      else {
        this.__updateClock(event.evt)
      }
    },

    __updateClock (evt) {
      let
        val,
        pos = position(evt),
        height = Math.abs(pos.top - this.dragging.top),
        distance = Math.sqrt(
          Math.pow(Math.abs(pos.top - this.dragging.top), 2) +
          Math.pow(Math.abs(pos.left - this.dragging.left), 2)
        ),
        angle = Math.asin(height / distance) * (180 / Math.PI)

      if (pos.top < this.dragging.top) {
        angle = this.dragging.left < pos.left ? 90 - angle : 270 + angle
      }
      else {
        angle = this.dragging.left < pos.left ? angle + 90 : 270 - angle
      }

      if (this.view === 'Hour') {
        val = Math.round(angle / 30)

        if (this.computedFormat24h === true) {
          if (val === 0) {
            val = distance < this.dragging.dist ? 0 : 12
          }
          else if (distance < this.dragging.dist) {
            val += 12
          }
        }
        else {
          if (this.isAM === true) {
            if (val === 12) {
              val = 0
            }
          }
          else {
            val += 12
          }
        }

        if (val === 24) {
          val = 0
        }
      }
      else {
        val = Math.round(angle / 6)

        if (val === 60) {
          val = 0
        }
      }

      if (this.dragCache === val) {
        return
      }

      const opt = this[`${this.view.toLowerCase()}InSelection`]

      if (opt !== void 0 && opt(val) !== true) {
        return
      }

      this.dragCache = val
      this[`__set${this.view}`](val)
    },

    __onKeyupHour (e) {
      if (e.keyCode === 13) { // ENTER
        this.view = 'Hour'
      }
      else if (e.keyCode === 37) { // ARROW LEFT
        this.__setHour((24 + this.innerModel.hour - 1) % (this.computedFormat24h === true ? 24 : 12))
      }
      else if (e.keyCode === 39) { // ARROW RIGHT
        this.__setHour((24 + this.innerModel.hour + 1) % (this.computedFormat24h === true ? 24 : 12))
      }
    },

    __onKeyupMinute (e) {
      if (e.keyCode === 13) { // ENTER
        this.view = 'Minute'
      }
      else if (e.keyCode === 37) { // ARROW LEFT
        this.__setMinute((60 + this.innerModel.minute - 1) % 60)
      }
      else if (e.keyCode === 39) { // ARROW RIGHT
        this.__setMinute((60 + this.innerModel.minute + 1) % 60)
      }
    },

    __onKeyupSecond (e) {
      if (e.keyCode === 13) { // ENTER
        this.view = 'Second'
      }
      else if (e.keyCode === 37) { // ARROW LEFT
        this.__setSecond((60 + this.innerModel.second - 1) % 60)
      }
      else if (e.keyCode === 39) { // ARROW RIGHT
        this.__setSecond((60 + this.innerModel.second + 1) % 60)
      }
    },

    __getHeader (h) {
      const label = [
        h('div', {
          staticClass: 'q-time__link',
          class: this.view === 'Hour' ? 'q-time__link--active' : 'cursor-pointer',
          attrs: { tabindex: this.computedTabindex },
          on: {
            click: () => { this.view = 'Hour' },
            keyup: this.__onKeyupHour
          }
        }, [ this.stringModel.hour ]),
        h('div', [ ':' ]),
        h(
          'div',
          this.minLink === true
            ? {
              staticClass: 'q-time__link',
              class: this.view === 'Minute' ? 'q-time__link--active' : 'cursor-pointer',
              attrs: { tabindex: this.computedTabindex },
              on: {
                click: () => { this.view = 'Minute' },
                keyup: this.__onKeyupMinute
              }
            }
            : { staticClass: 'q-time__link' },
          [ this.stringModel.minute ]
        )
      ]

      if (this.withSeconds === true) {
        label.push(
          h('div', [ ':' ]),
          h(
            'div',
            this.secLink === true
              ? {
                staticClass: 'q-time__link',
                class: this.view === 'Second' ? 'q-time__link--active' : 'cursor-pointer',
                attrs: { tabindex: this.computedTabindex },
                on: {
                  click: () => { this.view = 'Second' },
                  keyup: this.__onKeyupSecond
                }
              }
              : { staticClass: 'q-time__link' },
            [ this.stringModel.second ]
          )
        )
      }

      return h('div', {
        staticClass: 'q-time__header flex flex-center no-wrap',
        class: this.headerClass
      }, [
        h('div', {
          staticClass: 'q-time__header-label row items-center no-wrap',
          attrs: { dir: 'ltr' }
        }, label),

        this.computedFormat24h === false ? h('div', {
          staticClass: 'q-time__header-ampm column items-between no-wrap'
        }, [
          h('div', {
            staticClass: 'q-time__link',
            class: this.isAM === true ? 'q-time__link--active' : 'cursor-pointer',
            attrs: { tabindex: this.computedTabindex },
            on: {
              click: this.__setAm,
              keyup: e => { e.keyCode === 13 && this.__setAm() }
            }
          }, [ 'AM' ]),

          h('div', {
            staticClass: 'q-time__link',
            class: this.isAM !== true ? 'q-time__link--active' : 'cursor-pointer',
            attrs: { tabindex: this.computedTabindex },
            on: {
              click: this.__setPm,
              keyup: e => { e.keyCode === 13 && this.__setPm() }
            }
          }, [ 'PM' ])
        ]) : null
      ])
    },

    __getClock (h) {
      const
        view = this.view.toLowerCase(),
        current = this.innerModel[view],
        f24 = this.view === 'Hour' && this.computedFormat24h === true
          ? ' fmt24'
          : ''

      return h('div', {
        staticClass: 'q-time__content col relative-position'
      }, [
        h('transition', {
          props: { name: 'q-transition--scale' }
        }, [
          h('div', {
            key: 'clock' + this.view,
            staticClass: 'q-time__container-parent absolute-full'
          }, [
            h('div', {
              ref: 'clock',
              staticClass: 'q-time__container-child fit overflow-hidden'
            }, [
              h('div', {
                staticClass: 'q-time__clock cursor-pointer non-selectable',
                on: {
                  click: this.__click
                },
                directives: [{
                  name: 'touch-pan',
                  value: this.__drag,
                  modifiers: {
                    stop: true,
                    prevent: true,
                    mouse: true,
                    mouseStop: true,
                    mousePrevent: true
                  }
                }]
              }, [
                h('div', { staticClass: 'q-time__clock-circle fit' }, [
                  this.innerModel[view] !== null
                    ? h('div', {
                      staticClass: 'q-time__clock-pointer',
                      style: this.pointerStyle,
                      class: this.color !== void 0 ? `text-${this.color}` : null
                    })
                    : null,

                  this.positions.map(pos => h('div', {
                    staticClass: `q-time__clock-position row flex-center${f24} q-time__clock-pos-${pos.index}`,
                    class: pos.val === current
                      ? this.headerClass.concat(' q-time__clock-position--active')
                      : (pos.disable ? 'q-time__clock-position--disable' : null)
                  }, [ h('span', [ pos.label ]) ]))
                ])
              ])
            ])
          ])
        ]),

        this.nowBtn === true ? h(QBtn, {
          staticClass: 'q-time__now-button absolute',
          props: {
            icon: this.$q.iconSet.datetime.now,
            unelevated: true,
            size: 'sm',
            round: true,
            color: this.color,
            textColor: this.textColor,
            tabindex: this.computedTabindex
          },
          on: {
            click: this.__setNow
          }
        }) : null
      ])
    },

    __getNumberModel (v) {
      if (v === void 0 || v === null || v === '' || typeof v !== 'string') {
        return {
          hour: null,
          minute: null,
          second: null
        }
      }

      return splitTime(v)
    },

    __setHour (hour) {
      if (this.innerModel.hour !== hour) {
        this.innerModel.hour = hour
        this.innerModel.minute = null
        this.innerModel.second = null
      }
    },

    __setMinute (minute) {
      if (this.innerModel.minute !== minute) {
        this.innerModel.minute = minute
        this.innerModel.second = null
        this.withSeconds !== true && this.__updateValue({ minute })
      }
    },

    __setSecond (second) {
      this.innerModel.second !== second && this.__updateValue({ second })
    },

    __setAm () {
      if (this.isAM) { return }

      this.isAM = true

      if (this.innerModel.hour === null) { return }
      this.innerModel.hour -= 12
      this.__verifyAndUpdate()
    },

    __setPm () {
      if (!this.isAM) { return }

      this.isAM = false

      if (this.innerModel.hour === null) { return }
      this.innerModel.hour += 12
      this.__verifyAndUpdate()
    },

    __setNow () {
      const now = new Date()
      this.__updateValue({
        hour: now.getHours(),
        minute: now.getMinutes(),
        second: now.getSeconds()
      })
      this.view = 'Hour'
    },

    __verifyAndUpdate () {
      if (this.hourInSelection !== void 0 && this.hourInSelection(this.innerModel.hour) !== true) {
        this.innerModel = this.__getNumberModel(void 0)
        this.isAM = this.innerModel.hour === null || this.innerModel.hour < 12
        this.view = 'Hour'
        return
      }

      if (this.minuteInSelection !== void 0 && this.minuteInSelection(this.innerModel.minute) !== true) {
        this.innerModel.minute = null
        this.innerModel.second = null
        this.view = 'Minute'
        return
      }

      if (this.withSeconds === true && this.secondInSelection !== void 0 && this.secondInSelection(this.innerModel.second) !== true) {
        this.innerModel.second = null
        this.view = 'Second'
        return
      }

      if (this.innerModel.hour === null || this.innerModel.minute === null || (this.withSeconds === true && this.innerModel.second === null)) {
        return
      }

      this.__updateValue({})
    },

    __updateValue (obj) {
      const
        time = {
          ...this.innerModel,
          ...obj
        },
        val = this.__pad(time.hour % 24) + ':' +
          this.__pad(time.minute % 60) +
          (this.withSeconds ? ':' + this.__pad(time.second % 60) : '')

      if (val !== this.value) {
        this.$emit('input', val)
      }
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-time',
      class: this.classes,
      on: this.$listeners,
      attrs: { tabindex: -1 }
    }, [
      this.__getHeader(h),
      this.__getClock(h)
    ])
  },

  beforeDestroy () {
    this.__verifyAndUpdate()
  }
})
