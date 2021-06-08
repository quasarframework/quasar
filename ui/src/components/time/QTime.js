import { h, defineComponent, ref, computed, watch, withDirectives, Transition, nextTick, getCurrentInstance } from 'vue'

import QBtn from '../btn/QBtn.js'
import TouchPan from '../../directives/TouchPan.js'

import useDark, { useDarkProps } from '../../composables/private/use-dark.js'
import { useFormProps, useFormAttrs, useFormInject } from '../../composables/private/use-form.js'
import useDatetime, { useDatetimeProps, useDatetimeEmits, getDayHash } from '../date/use-datetime.js'

import { hSlot } from '../../utils/private/render.js'
import { formatDate, __splitDate } from '../../utils/date.js'
import { position } from '../../utils/event.js'
import { pad } from '../../utils/format.js'

function getViewByModel (model, withSeconds) {
  if (model.hour !== null) {
    if (model.minute === null) {
      return 'minute'
    }
    else if (withSeconds === true && model.second === null) {
      return 'second'
    }
  }

  return 'hour'
}

function getCurrentTime () {
  const d = new Date()

  return {
    hour: d.getHours(),
    minute: d.getMinutes(),
    second: d.getSeconds(),
    millisecond: d.getMilliseconds()
  }
}

export default defineComponent({
  name: 'QTime',

  props: {
    ...useDarkProps,
    ...useFormProps,
    ...useDatetimeProps,

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

  emits: useDatetimeEmits,

  setup (props, { slots, emit }) {
    const { proxy: { $q } } = getCurrentInstance()

    const isDark = useDark(props, $q)
    const { tabindex, headerClass, getLocale, getCurrentDate } = useDatetime(props, $q)

    const formAttrs = useFormAttrs(props)
    const injectFormInput = useFormInject(formAttrs)

    let draggingClockRect, dragCache

    const clockRef = ref(null)

    const mask = computed(() => getMask())
    const locale = computed(() => getLocale())

    const model = __splitDate(
      props.modelValue,
      getMask(),
      getLocale(),
      props.calendar,
      getDefaultDateModel()
    )

    const view = ref(getViewByModel(model))
    const innerModel = ref(model)
    const isAM = ref(model.hour === null || model.hour < 12)

    const classes = computed(() =>
      `q-time q-time--${ props.landscape === true ? 'landscape' : 'portrait' }`
      + (isDark.value === true ? ' q-time--dark q-dark' : '')
      + (props.disable === true ? ' disabled' : (props.readonly === true ? ' q-time--readonly' : ''))
      + (props.bordered === true ? ' q-time--bordered' : '')
      + (props.square === true ? ' q-time--square no-border-radius' : '')
      + (props.flat === true ? ' q-time--flat no-shadow' : '')
    )

    const stringModel = computed(() => {
      const time = innerModel.value

      return {
        hour: time.hour === null
          ? '--'
          : (
              computedFormat24h.value === true
                ? pad(time.hour)
                : String(
                  isAM.value === true
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
    })

    const defaultDateModel = computed(() => getDefaultDateModel())

    const computedFormat24h = computed(() => (
      props.format24h !== null
        ? props.format24h
        : $q.lang.date.format24h
    ))

    const pointerStyle = computed(() => {
      const
        forHour = view.value === 'hour',
        divider = forHour === true ? 12 : 60,
        amount = innerModel.value[ view.value ],
        degrees = Math.round(amount * (360 / divider)) - 180

      let transform = `rotate(${ degrees }deg) translateX(-50%)`

      if (
        forHour === true
        && computedFormat24h.value === true
        && innerModel.value.hour >= 12
      ) {
        transform += ' scale(.7)'
      }

      return { transform }
    })

    const minLink = computed(() => innerModel.value.hour !== null)
    const secLink = computed(() => minLink.value === true && innerModel.value.minute !== null)

    const hourInSelection = computed(() => (
      props.hourOptions !== void 0
        ? val => props.hourOptions.includes(val)
        : (
            props.options !== void 0
              ? val => props.options(val, null, null)
              : null
          )
    ))

    const minuteInSelection = computed(() => (
      props.minuteOptions !== void 0
        ? val => props.minuteOptions.includes(val)
        : (
            props.options !== void 0
              ? val => props.options(innerModel.value.hour, val, null)
              : null
          )
    ))

    const secondInSelection = computed(() => (
      props.secondOptions !== void 0
        ? val => props.secondOptions.includes(val)
        : (
            props.options !== void 0
              ? val => props.options(innerModel.value.hour, innerModel.value.minute, val)
              : null
          )
    ))

    const validHours = computed(() => {
      if (hourInSelection.value === null) {
        return null
      }

      const am = getValidValues(0, 11, hourInSelection.value)
      const pm = getValidValues(12, 11, hourInSelection.value)
      return { am, pm, values: am.values.concat(pm.values) }
    })

    const validMinutes = computed(() => (
      minuteInSelection.value !== null
        ? getValidValues(0, 59, minuteInSelection.value)
        : null
    ))

    const validSeconds = computed(() => (
      secondInSelection.value !== null
        ? getValidValues(0, 59, secondInSelection.value)
        : null
    ))

    const viewValidOptions = computed(() => {
      switch (view.value) {
        case 'hour':
          return validHours.value
        case 'minute':
          return validMinutes.value
        case 'second':
          return validSeconds.value
      }
    })

    const positions = computed(() => {
      let start, end, offset = 0, step = 1
      const values = viewValidOptions.value !== null
        ? viewValidOptions.value.values
        : void 0

      if (view.value === 'hour') {
        if (computedFormat24h.value === true) {
          start = 0
          end = 23
        }
        else {
          start = 0
          end = 11

          if (isAM.value === false) {
            offset = 12
          }
        }
      }
      else {
        start = 0
        end = 55
        step = 5
      }

      const pos = []

      for (let val = start, index = start; val <= end; val += step, index++) {
        const
          actualVal = val + offset,
          disable = values !== void 0 && values.includes(actualVal) === false,
          label = view.value === 'hour' && val === 0
            ? (computedFormat24h.value === true ? '00' : '12')
            : val

        pos.push({ val: actualVal, index, disable, label })
      }

      return pos
    })

    const clockDirectives = computed(() => {
      return [ [
        TouchPan,
        onPan,
        void 0,
        {
          stop: true,
          prevent: true,
          mouse: true
        }
      ] ]
    })

    watch(() => props.modelValue, v => {
      const model = __splitDate(
        v,
        mask.value,
        locale.value,
        props.calendar,
        defaultDateModel.value
      )

      if (
        model.dateHash !== innerModel.value.dateHash
        || model.timeHash !== innerModel.value.timeHash
      ) {
        innerModel.value = model

        if (model.hour === null) {
          view.value = 'hour'
        }
        else {
          isAM.value = model.hour < 12
        }
      }
    })

    watch([ mask, locale ], () => {
      nextTick(() => {
        updateValue()
      })
    })

    function setNow () {
      updateValue({
        ...getCurrentDate(),
        ...getCurrentTime()
      })
      view.value = 'hour'
    }

    function getValidValues (start, count, testFn) {
      const values = Array.apply(null, { length: count + 1 })
        .map((_, index) => {
          const i = index + start
          return {
            index: i,
            val: testFn(i) === true // force boolean
          }
        })
        .filter(v => v.val === true)
        .map(v => v.index)

      return {
        min: values[ 0 ],
        max: values[ values.length - 1 ],
        values,
        threshold: count + 1
      }
    }

    function getWheelDist (a, b, threshold) {
      const diff = Math.abs(a - b)
      return Math.min(diff, threshold - diff)
    }

    function getNormalizedClockValue (val, { min, max, values, threshold }) {
      if (val === min) {
        return min
      }

      if (val < min || val > max) {
        return getWheelDist(val, min, threshold) <= getWheelDist(val, max, threshold)
          ? min
          : max
      }

      const
        index = values.findIndex(v => val <= v),
        before = values[ index - 1 ],
        after = values[ index ]

      return val - before <= after - val
        ? before
        : after
    }

    function getMask () {
      return props.calendar !== 'persian' && props.mask !== null
        ? props.mask
        : `HH:mm${ props.withSeconds === true ? ':ss' : '' }`
    }

    function getDefaultDateModel () {
      if (typeof props.defaultDate !== 'string') {
        const date = getCurrentDate(true)
        date.dateHash = getDayHash(date)
        return date
      }

      return __splitDate(props.defaultDate, 'YYYY/MM/DD', void 0, props.calendar)
    }

    function shouldAbortInteraction () {
      return vm.isDeactivated === true
        || vm.isUnmounted === true
        // if we have limited options, can we actually set any?
        || (
          viewValidOptions.value !== null
          && (
            viewValidOptions.value.values.length === 0
            || (
              view.value === 'hour' && computedFormat24h.value !== true
              && validHours.value[ isAM.value === true ? 'am' : 'pm' ].values.length === 0
            )
          )
        )
    }

    function getClockRect () {
      const
        clock = clockRef.value,
        { top, left, width } = clock.getBoundingClientRect(),
        dist = width / 2

      return {
        top: top + dist,
        left: left + dist,
        dist: dist * 0.7
      }
    }

    function onPan (event) {
      if (shouldAbortInteraction() === true) {
        return
      }

      if (event.isFirst === true) {
        draggingClockRect = getClockRect()
        dragCache = updateClock(event.evt, draggingClockRect)
        return
      }

      dragCache = updateClock(event.evt, draggingClockRect, dragCache)

      if (event.isFinal === true) {
        draggingClockRect = false
        dragCache = null
        goToNextView()
      }
    }

    function goToNextView () {
      if (view.value === 'hour') {
        view.value = 'minute'
      }
      else if (props.withSeconds && view.value === 'minute') {
        view.value = 'second'
      }
    }

    function updateClock (evt, clockRect, cacheVal) {
      const
        pos = position(evt),
        height = Math.abs(pos.top - clockRect.top),
        distance = Math.sqrt(
          Math.pow(Math.abs(pos.top - clockRect.top), 2)
          + Math.pow(Math.abs(pos.left - clockRect.left), 2)
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

      if (view.value === 'hour') {
        val = angle / 30

        if (validHours.value !== null) {
          const am = computedFormat24h.value !== true
            ? isAM.value === true
            : (
                validHours.value.am.values.length > 0 && validHours.value.pm.values.length > 0
                  ? distance >= clockRect.dist
                  : validHours.value.am.values.length > 0
              )

          val = getNormalizedClockValue(
            val + (am === true ? 0 : 12),
            validHours.value[ am === true ? 'am' : 'pm' ]
          )
        }
        else {
          val = Math.round(val)

          if (computedFormat24h.value === true) {
            if (distance < clockRect.dist) {
              if (val < 12) {
                val += 12
              }
            }
            else if (val === 12) {
              val = 0
            }
          }
          else if (isAM.value === true && val === 12) {
            val = 0
          }
          else if (isAM.value === false && val !== 12) {
            val += 12
          }
        }

        if (computedFormat24h.value === true) {
          isAM.value = val < 12
        }
      }
      else {
        val = Math.round(angle / 6) % 60

        if (view.value === 'minute' && validMinutes.value !== null) {
          val = getNormalizedClockValue(val, validMinutes.value)
        }
        else if (view.value === 'second' && validSeconds.value !== null) {
          val = getNormalizedClockValue(val, validSeconds.value)
        }
      }

      if (cacheVal !== val) {
        setModel[ view.value ](val)
      }

      return val
    }

    const setView = {
      hour () { view.value = 'hour' },
      minute () { view.value = 'minute' },
      second () { view.value = 'second' }
    }

    function setAmOnKey (e) {
      e.keyCode === 13 && setAm()
    }

    function setPmOnKey (e) {
      e.keyCode === 13 && setPm()
    }

    function onClick (evt) {
      if (shouldAbortInteraction() !== true) {
        // onMousedown() has already updated the offset
        // (on desktop only, through mousedown event)
        if ($q.platform.is.desktop !== true) {
          updateClock(evt, getClockRect())
        }

        goToNextView()
      }
    }

    function onMousedown (evt) {
      if (shouldAbortInteraction() !== true) {
        updateClock(evt, getClockRect())
      }
    }

    function onKeyupHour (e) {
      if (e.keyCode === 13) { // ENTER
        view.value = 'hour'
      }
      else if ([ 37, 39 ].includes(e.keyCode)) {
        const payload = e.keyCode === 37 ? -1 : 1

        if (validHours.value !== null) {
          const values = computedFormat24h.value === true
            ? validHours.value.values
            : validHours.value[ isAM.value === true ? 'am' : 'pm' ].values

          if (values.length === 0) { return }

          if (innerModel.value.hour === null) {
            setHour(values[ 0 ])
          }
          else {
            const index = (
              values.length
              + values.indexOf(innerModel.value.hour)
              + payload
            ) % values.length

            setHour(values[ index ])
          }
        }
        else {
          const
            wrap = computedFormat24h.value === true ? 24 : 12,
            offset = computedFormat24h.value !== true && isAM.value === false ? 12 : 0,
            val = innerModel.value.hour === null ? -payload : innerModel.value.hour

          setHour(offset + (24 + val + payload) % wrap)
        }
      }
    }

    function onKeyupMinute (e) {
      if (e.keyCode === 13) { // ENTER
        view.value = 'minute'
      }
      else if ([ 37, 39 ].includes(e.keyCode)) {
        const payload = e.keyCode === 37 ? -1 : 1

        if (validMinutes.value !== null) {
          const values = validMinutes.value.values

          if (values.length === 0) { return }

          if (innerModel.value.minute === null) {
            setMinute(values[ 0 ])
          }
          else {
            const index = (
              values.length
              + values.indexOf(innerModel.value.minute)
              + payload
            ) % values.length

            setMinute(values[ index ])
          }
        }
        else {
          const val = innerModel.value.minute === null ? -payload : innerModel.value.minute
          setMinute((60 + val + payload) % 60)
        }
      }
    }

    function onKeyupSecond (e) {
      if (e.keyCode === 13) { // ENTER
        view.value = 'second'
      }
      else if ([ 37, 39 ].includes(e.keyCode)) {
        const payload = e.keyCode === 37 ? -1 : 1

        if (validSeconds.value !== null) {
          const values = validSeconds.value.values

          if (values.length === 0) { return }

          if (innerModel.value.seconds === null) {
            setSecond(values[ 0 ])
          }
          else {
            const index = (
              values.length
              + values.indexOf(innerModel.value.second)
              + payload
            ) % values.length

            setSecond(values[ index ])
          }
        }
        else {
          const val = innerModel.value.second === null ? -payload : innerModel.value.second
          setSecond((60 + val + payload) % 60)
        }
      }
    }

    function setHour (hour) {
      if (innerModel.value.hour !== hour) {
        innerModel.value.hour = hour
        innerModel.value.minute = null
        innerModel.value.second = null
      }
    }

    function setMinute (minute) {
      if (innerModel.value.minute !== minute) {
        innerModel.value.minute = minute
        innerModel.value.second = null
        props.withSeconds !== true && updateValue({ minute })
      }
    }

    function setSecond (second) {
      innerModel.value.second !== second && updateValue({ second })
    }

    const setModel = {
      hour: setHour,
      minute: setMinute,
      second: setSecond
    }

    function setAm () {
      if (isAM.value === false) {
        isAM.value = true

        if (innerModel.value.hour !== null) {
          innerModel.value.hour -= 12
          verifyAndUpdate()
        }
      }
    }

    function setPm () {
      if (isAM.value === true) {
        isAM.value = false

        if (innerModel.value.hour !== null) {
          innerModel.value.hour += 12
          verifyAndUpdate()
        }
      }
    }

    function verifyAndUpdate () {
      if (hourInSelection.value !== null && hourInSelection.value(innerModel.value.hour) !== true) {
        innerModel.value = __splitDate()
        view.value = 'hour'
        return
      }

      if (minuteInSelection.value !== null && minuteInSelection.value(innerModel.value.minute) !== true) {
        innerModel.value.minute = null
        innerModel.value.second = null
        view.value = 'minute'
        return
      }

      if (props.withSeconds === true && secondInSelection.value !== null && secondInSelection.value(innerModel.value.second) !== true) {
        innerModel.value.second = null
        view.value = 'second'
        return
      }

      if (innerModel.value.hour === null || innerModel.value.minute === null || (props.withSeconds === true && innerModel.value.second === null)) {
        return
      }

      updateValue()
    }

    function updateValue (obj) {
      const date = Object.assign({ ...innerModel.value }, obj)

      const val = props.calendar === 'persian'
        ? pad(date.hour) + ':'
          + pad(date.minute)
          + (props.withSeconds === true ? ':' + pad(date.second) : '')
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
          mask.value,
          locale.value,
          date.year,
          date.timezoneOffset
        )

      date.changed = val !== props.modelValue
      emit('update:modelValue', val, date)
    }

    // expose public methods
    const vm = getCurrentInstance()
    Object.assign(vm.proxy, { setNow })

    function getHeader () {
      const label = [
        h('div', {
          class: 'q-time__link '
            + (view.value === 'hour' ? 'q-time__link--active' : 'cursor-pointer'),
          tabindex: tabindex.value,
          onClick: setView.hour,
          onKeyup: onKeyupHour
        }, stringModel.value.hour),

        h('div', ':'),

        h(
          'div',
          minLink.value === true
            ? {
                class: 'q-time__link '
                + (view.value === 'minute' ? 'q-time__link--active' : 'cursor-pointer'),
                tabindex: tabindex.value,
                onKeyup: onKeyupMinute,
                onClick: setView.minute
              }
            : { class: 'q-time__link' },
          stringModel.value.minute
        )
      ]

      if (props.withSeconds === true) {
        label.push(
          h('div', ':'),

          h(
            'div',
            secLink.value === true
              ? {
                  class: 'q-time__link '
                  + (view.value === 'second' ? 'q-time__link--active' : 'cursor-pointer'),
                  tabindex: tabindex.value,
                  onKeyup: onKeyupSecond,
                  onClick: setView.second
                }
              : { class: 'q-time__link' },
            stringModel.value.second
          )
        )
      }

      const child = [
        h('div', {
          class: 'q-time__header-label row items-center no-wrap',
          dir: 'ltr'
        }, label)
      ]

      computedFormat24h.value === false && child.push(
        h('div', {
          class: 'q-time__header-ampm column items-between no-wrap'
        }, [
          h('div', {
            class: 'q-time__link '
              + (isAM.value === true ? 'q-time__link--active' : 'cursor-pointer'),
            tabindex: tabindex.value,
            onClick: setAm,
            onKeyup: setAmOnKey
          }, 'AM'),

          h('div', {
            class: 'q-time__link '
              + (isAM.value !== true ? 'q-time__link--active' : 'cursor-pointer'),
            tabindex: tabindex.value,
            onClick: setPm,
            onKeyup: setPmOnKey
          }, 'PM')
        ])
      )

      return h('div', {
        class: 'q-time__header flex flex-center no-wrap ' + headerClass.value
      }, child)
    }

    function getClock () {
      const current = innerModel.value[ view.value ]

      return h('div', {
        class: 'q-time__content col relative-position'
      }, [
        h(Transition, {
          name: 'q-transition--scale'
        }, () => h('div', {
          key: 'clock' + view.value,
          class: 'q-time__container-parent absolute-full'
        }, [
          h('div', {
            ref: clockRef,
            class: 'q-time__container-child fit overflow-hidden'
          }, [
            withDirectives(
              h('div', {
                class: 'q-time__clock cursor-pointer non-selectable',
                onClick,
                onMousedown
              }, [
                h('div', { class: 'q-time__clock-circle fit' }, [
                  h('div', {
                    class: 'q-time__clock-pointer'
                      + (innerModel.value[ view.value ] === null ? ' hidden' : (props.color !== void 0 ? ` text-${ props.color }` : '')),
                    style: pointerStyle.value
                  }),

                  positions.value.map(pos => h('div', {
                    class: `q-time__clock-position row flex-center q-time__clock-pos-${ pos.index }`
                      + (pos.val === current
                        ? ' q-time__clock-position--active ' + headerClass.value
                        : (pos.disable === true ? ' q-time__clock-position--disable' : ''))
                  }, [ h('span', pos.label) ]))
                ])
              ]),
              clockDirectives.value
            )
          ])
        ])),

        props.nowBtn === true ? h(QBtn, {
          class: 'q-time__now-button absolute',
          icon: $q.iconSet.datetime.now,
          unelevated: true,
          size: 'sm',
          round: true,
          color: props.color,
          textColor: props.textColor,
          tabindex: tabindex.value,
          onClick: setNow
        }) : null
      ])
    }

    return () => {
      const child = [ getClock() ]

      const def = hSlot(slots.default)
      def !== void 0 && child.push(
        h('div', { class: 'q-time__actions' }, def)
      )

      if (props.name !== void 0 && props.disable !== true) {
        injectFormInput(child, 'push')
      }

      return h('div', {
        class: classes.value,
        tabindex: -1
      }, [
        getHeader(),
        h('div', { class: 'q-time__main col overflow-auto' }, child)
      ])
    }
  }
})
