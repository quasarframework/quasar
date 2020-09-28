import Vue from 'vue'

import QBtn from '../btn/QBtn.js'
import TouchPan from '../../directives/TouchPan.js'

import { slot } from '../../utils/slot.js'
import { formatDate, __splitDate } from '../../utils/date.js'
import { position } from '../../utils/event.js'
import { pad } from '../../utils/format.js'
import cache from '../../utils/cache.js'
import DateTimeMixin from '../../mixins/datetime.js'

export default Vue.extend({
  name: 'QTime',

  mixins: [ DateTimeMixin ],

  directives: {
    TouchPan
  },

  props: {
    mask: {
      default: null
    },

    format24h: {
      type: Boolean,
      default: null
    },

    defaultDate: {
      type: String,
      validator: v => /^-?[\d]+\/[0-1]\d\/[0-3]\d$/.test(v)
    },

    options: Function,
    hourOptions: Array,
    minuteOptions: Array,
    secondOptions: Array,

    withSeconds: Boolean,
    nowBtn: Boolean
  },

  data () {
    const model = __splitDate(
      this.value,
      this.__getMask(),
      this.__getLocale(),
      this.calendar,
      this.__getDefaultDateModel()
    )

    let view = 'Hour'

    if (model.hour !== null) {
      if (model.minute === null) {
        view = 'Minute'
      }
      else if (this.withSeconds === true && model.second === null) {
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
      const model = __splitDate(
        v,
        this.computedMask,
        this.computedLocale,
        this.calendar,
        this.defaultDateModel
      )

      if (
        model.dateHash !== this.innerModel.dateHash ||
        model.timeHash !== this.innerModel.timeHash
      ) {
        this.innerModel = model

        if (model.hour === null) {
          this.view = 'Hour'
        }
        else {
          this.isAM = model.hour < 12
        }
      }
    },

    computedMask () {
      this.$nextTick(() => {
        this.__updateValue()
      })
    },

    computedLocale () {
      this.$nextTick(() => {
        this.__updateValue()
      })
    }
  },

  computed: {
    classes () {
      return `q-time q-time--${this.landscape === true ? 'landscape' : 'portrait'}` +
        (this.isDark === true ? ' q-time--dark q-dark' : '') +
        (this.disable === true ? ' disabled' : (this.readonly === true ? ' q-time--readonly' : '')) +
        (this.bordered === true ? ` q-time--bordered` : '') +
        (this.square === true ? ` q-time--square no-border-radius` : '') +
        (this.flat === true ? ` q-time--flat no-shadow` : '')
    },

    stringModel () {
      const time = this.innerModel

      return {
        hour: time.hour === null
          ? '--'
          : (
            this.computedFormat24h === true
              ? pad(time.hour)
              : String(
                this.isAM === true
                  ? (time.hour === 0 ? 12 : time.hour)
                  : (time.hour > 12 ? time.hour - 12 : time.hour)
              )
          ),
        minute: time.minute === null
          ? '--'
          : pad(time.minute),
        second: time.second === null
          ? '--'
          : pad(time.second)
      }
    },

    defaultDateModel () {
      return this.__getDefaultDateModel()
    },

    computedFormat24h () {
      return this.format24h !== null
        ? this.format24h
        : this.$q.lang.date.format24h
    },

    pointerStyle () {
      const
        forHour = this.view === 'Hour',
        divider = forHour === true ? 12 : 60,
        amount = this.innerModel[this.view.toLowerCase()],
        degrees = Math.round(amount * (360 / divider)) - 180

      let transform = `rotate(${degrees}deg) translateX(-50%)`

      if (
        forHour === true &&
        this.computedFormat24h === true &&
        this.innerModel.hour >= 12
      ) {
        transform += ' scale(.7)'
      }

      return { transform }
    },

    minLink () {
      return this.innerModel.hour !== null
    },

    secLink () {
      return this.minLink === true && this.innerModel.minute !== null
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

    hourSnappingGrid () {
      return this.__getSnapGrid(this.hourInSelection, 24)
    },

    minuteSnappingGrid () {
      return this.__getSnapGrid(this.minuteInSelection, 60)
    },

    secondSnappingGrid () {
      return this.__getSnapGrid(this.secondInSelection, 60)
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
            ? (this.computedFormat24h === true ? '00' : '12')
            : val

        pos.push({ val: actualVal, index, disable, label })
      }

      return pos
    }
  },

  methods: {
    setNow () {
      this.__updateValue({
        ...this.__getCurrentDate(),
        ...this.__getCurrentTime()
      })
      this.view = 'Hour'
    },

    __getSnapGrid (inSel, count) {
      if (inSel === void 0) {
        return
      }

      const snappingGrid = Array.apply(null, { length: count }).map((_, index) => inSel(index))

      let consecutiveGaps = (count - 1) - snappingGrid.lastIndexOf(true)
      if (consecutiveGaps === -1) {
        return
      }

      for (let i = 0; i < count; i++) {
        if (snappingGrid[i] === true) {
          if (consecutiveGaps > 1) {
            const sideCount = Math.floor(consecutiveGaps / 2)

            const previousVal = ((i - consecutiveGaps - 1) + count) % count
            const previousValStart = ((i - consecutiveGaps) + count) % count
            for (let j = 0, h = previousValStart; j < sideCount; j++, (h = (previousValStart + j + count) % count)) {
              snappingGrid[h] = previousVal
            }

            const currentVal = i
            const currentValStart = ((i - sideCount) + count) % count
            for (let j = 0, h = currentValStart; j < sideCount; j++, (h = (currentValStart + j + count) % count)) {
              snappingGrid[h] = currentVal
            }

            consecutiveGaps = 0
          }
          else if (consecutiveGaps === 1) {
            const previousPosition = ((i - 1) + count) % count
            snappingGrid[previousPosition] = previousPosition
            consecutiveGaps = 0
          }

          snappingGrid[i] = i
        }
        else if (snappingGrid[i] === false) {
          consecutiveGaps++
        }
      }

      return snappingGrid
    },

    __getMask () {
      return this.calendar !== 'persian' && this.mask !== null
        ? this.mask
        : `HH:mm${this.withSeconds === true ? ':ss' : ''}`
    },

    __getDefaultDateModel () {
      if (typeof this.defaultDate !== 'string') {
        const date = this.__getCurrentDate()
        date.dateHash = date.year + '/' + pad(date.month) + '/' + pad(date.day)
        return date
      }

      return __splitDate(this.defaultDate, 'YYYY/MM/DD', void 0, this.calendar)
    },

    __click (evt) {
      if (this._isBeingDestroyed === true || this._isDestroyed === true) {
        return
      }

      // __activate() has already updated the offset
      // (on desktop only, through mousedown event)
      if (this.$q.platform.is.desktop !== true) {
        this.__updateClock(evt, this.__getClockRect())
      }

      this.__goToNextView()
    },

    __activate (evt) {
      if (this._isBeingDestroyed !== true && this._isDestroyed !== true) {
        this.__updateClock(evt, this.__getClockRect())
      }
    },

    __getClockRect () {
      const
        clock = this.$refs.clock,
        { top, left, width } = clock.getBoundingClientRect(),
        dist = width / 2

      return {
        top: top + dist,
        left: left + dist,
        dist: dist * 0.7
      }
    },

    __goToNextView () {
      if (this.view === 'Hour') {
        this.view = 'Minute'
      }
      else if (this.withSeconds && this.view === 'Minute') {
        this.view = 'Second'
      }
    },

    __drag (event) {
      // cases when on a popup getting closed
      // on previously emitted value
      if (this._isBeingDestroyed === true || this._isDestroyed === true) {
        return
      }

      if (event.isFirst === true) {
        this.draggingClockRect = this.__getClockRect()
        this.dragCache = this.__updateClock(event.evt, this.draggingClockRect)
        return
      }

      this.dragCache = this.__updateClock(event.evt, this.draggingClockRect, this.dragCache)

      if (event.isFinal === true) {
        this.draggingClockRect = false
        this.dragCache = null
        this.__goToNextView()
      }
    },

    __updateClock (evt, clockRect, cacheVal) {
      const
        pos = position(evt),
        height = Math.abs(pos.top - clockRect.top),
        distance = Math.sqrt(
          Math.pow(Math.abs(pos.top - clockRect.top), 2) +
          Math.pow(Math.abs(pos.left - clockRect.left), 2)
        )
      let
        val,
        angle = Math.asin(height / distance) * (180 / Math.PI)

      if (pos.top < clockRect.top) {
        angle = clockRect.left < pos.left ? 90 - angle : 270 + angle
      }
      else {
        angle = clockRect.left < pos.left ? angle + 90 : 270 - angle
      }

      if (this.view === 'Hour') {
        val = Math.round(angle / 30)

        if (this.computedFormat24h === true) {
          if (distance < clockRect.dist) {
            if (val < 12) {
              val += 12
            }
          }
          else if (val === 12) {
            val = 0
          }
          this.isAM = val < 12
        }
        else if (this.isAM === true && val === 12) {
          val = 0
        }
        else if (this.isAM === false && val !== 12) {
          val += 12
        }

        if (this.hourSnappingGrid !== void 0) {
          val = this.hourSnappingGrid[val]
        }
      }
      else {
        val = Math.round(angle / 6) % 60

        if (this.view === 'Minute' && this.minuteSnappingGrid !== void 0) {
          val = this.minuteSnappingGrid[val]
        }
        else if (this.view === 'Second' && this.secondSnappingGrid !== void 0) {
          val = this.secondSnappingGrid[val]
        }
      }

      if (
        cacheVal === val ||
        val === false // snapping said "no!"
      ) {
        return val
      }

      this[`__set${this.view}`](val)
      return val
    },

    __onKeyupHour (e) {
      if (e.keyCode === 13) { // ENTER
        this.view = 'Hour'
      }
      else {
        const
          wrap = this.computedFormat24h === true ? 24 : 12,
          offset = this.computedFormat24h !== true && this.isAM === false ? 12 : 0

        if (e.keyCode === 37) { // ARROW LEFT
          this.__setHour(offset + (24 + this.innerModel.hour - 1) % wrap)
        }
        else if (e.keyCode === 39) { // ARROW RIGHT
          this.__setHour(offset + (24 + this.innerModel.hour + 1) % wrap)
        }
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
          on: cache(this, 'vH', {
            click: () => { this.view = 'Hour' },
            keyup: this.__onKeyupHour
          })
        }, [ this.stringModel.hour ]),

        h('div', [ ':' ]),

        h(
          'div',
          this.minLink === true
            ? {
              staticClass: 'q-time__link',
              class: this.view === 'Minute' ? 'q-time__link--active' : 'cursor-pointer',
              attrs: { tabindex: this.computedTabindex },
              on: cache(this, 'vM', {
                click: () => { this.view = 'Minute' },
                keyup: this.__onKeyupMinute
              })
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
                on: cache(this, 'vS', {
                  click: () => { this.view = 'Second' },
                  keyup: this.__onKeyupSecond
                })
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
            on: cache(this, 'AM', {
              click: this.__setAm,
              keyup: e => { e.keyCode === 13 && this.__setAm() }
            })
          }, [ 'AM' ]),

          h('div', {
            staticClass: 'q-time__link',
            class: this.isAM !== true ? 'q-time__link--active' : 'cursor-pointer',
            attrs: { tabindex: this.computedTabindex },
            on: cache(this, 'PM', {
              click: this.__setPm,
              keyup: e => { e.keyCode === 13 && this.__setPm() }
            })
          }, [ 'PM' ])
        ]) : null
      ])
    },

    __getClock (h) {
      const
        view = this.view.toLowerCase(),
        current = this.innerModel[view]

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
                on: cache(this, 'click', {
                  click: this.__click,
                  mousedown: this.__activate
                }),
                directives: cache(this, 'touch', [{
                  name: 'touch-pan',
                  value: this.__drag,
                  modifiers: {
                    stop: true,
                    prevent: true,
                    mouse: true
                  }
                }])
              }, [
                h('div', { staticClass: 'q-time__clock-circle fit' }, [
                  h('div', {
                    staticClass: 'q-time__clock-pointer',
                    style: this.pointerStyle,
                    class: this.innerModel[view] === null ? 'hidden' : (this.color !== void 0 ? `text-${this.color}` : '')
                  }),

                  this.positions.map(pos => h('div', {
                    staticClass: `q-time__clock-position row flex-center q-time__clock-pos-${pos.index}`,
                    class: pos.val === current
                      ? this.headerClass.concat(' q-time__clock-position--active')
                      : (pos.disable === true ? 'q-time__clock-position--disable' : null)
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
          on: cache(this, 'now', {
            click: this.setNow
          })
        }) : null
      ])
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

    __verifyAndUpdate () {
      if (this.hourInSelection !== void 0 && this.hourInSelection(this.innerModel.hour) !== true) {
        this.innerModel = __splitDate()
        this.isAM = true
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

      this.__updateValue()
    },

    __updateValue (obj) {
      const date = Object.assign({ ...this.innerModel }, obj)

      const val = this.calendar === 'persian'
        ? pad(date.hour) + ':' +
          pad(date.minute) +
          (this.withSeconds === true ? ':' + pad(date.second) : '')
        : formatDate(
          new Date(
            date.year,
            date.month === null ? null : date.month - 1,
            date.day,
            date.hour,
            date.minute,
            date.second,
            date.millisecond
          ),
          this.computedMask,
          this.computedLocale,
          date.year,
          date.timezoneOffset
        )

      date.changed = val !== this.value
      this.$emit('input', val, date)
    }
  },

  render (h) {
    const child = [
      this.__getClock(h)
    ]

    const def = slot(this, 'default')
    def !== void 0 && child.push(
      h('div', { staticClass: 'q-time__actions' }, def)
    )

    if (this.name !== void 0 && this.disable !== true) {
      this.__injectFormInput(child, 'push')
    }

    return h('div', {
      class: this.classes,
      on: { ...this.qListeners },
      attrs: { tabindex: -1 }
    }, [
      this.__getHeader(h),
      h('div', { staticClass: 'q-time__main col overflow-auto' }, child)
    ])
  }
})
