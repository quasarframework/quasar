import {
  Transition,
  computed,
  getCurrentInstance,
  h,
  nextTick,
  ref,
  watch,
  withDirectives
} from 'vue'

import QBtn from '../btn/QBtn.js'
import TouchPan from '../../directives/touch-pan/TouchPan.js'

import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'
import {
  useFormAttrs,
  useFormInject,
  useFormProps
} from '../../composables/use-form/private.use-form.js'
import useDatetime, {
  getDayHash,
  useDatetimeEmits,
  useDatetimeProps
} from '../date/use-datetime.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'
import { __splitDate, formatDate } from '../../utils/date/date.js'
import { position, stopAndPrevent } from '../../utils/event/event.js'
import { pad } from '../../utils/format/format.js'
import { vmIsDestroyed } from '../../utils/private.vm/vm.js'

const defaultDateRE = /^-?[\d]+\/[0-1]\d\/[0-3]\d$/

function getViewByModel(model, withSeconds) {
  if (model.hour !== null) {
    if (model.minute === null) {
      return 'minute'
    } else if (withSeconds && model.second === null) {
      return 'second'
    }
  }

  return 'hour'
}

function getCurrentTime() {
  const d = new Date()

  return {
    hour: d.getHours(),
    minute: d.getMinutes(),
    second: d.getSeconds(),
    millisecond: d.getMilliseconds()
  }
}

function preventSpace(e) {
  if (e.keyCode === 32) stopAndPrevent(e)
}

function getLinkKeydown(step, edge, digit) {
  return e => {
    const { keyCode } = e

    if (keyCode === 32) {
      // activation happens on keyup; only prevent page scroll here
      stopAndPrevent(e)
    } else if (keyCode >= 37 && keyCode <= 40) {
      stopAndPrevent(e)
      step(keyCode === 38 /* Up */ || keyCode === 39 /* Right */ ? 1 : -1)
    } else if (keyCode === 35 /* End */ || keyCode === 36 /* Home */) {
      stopAndPrevent(e)
      edge(keyCode === 35)
    } else if (keyCode >= 48 && keyCode <= 57) {
      stopAndPrevent(e)
      digit(keyCode - 48)
    } else if (keyCode >= 96 && keyCode <= 105) {
      // numpad digits
      stopAndPrevent(e)
      digit(keyCode - 96)
    }
  }
}

function getWheelDist(a, b, threshold) {
  const diff = Math.abs(a - b)
  return Math.min(diff, threshold - diff)
}

function getValidValues(start, count, testFn) {
  const values = Array.from(
    { length: count + 1 },
    (_, index) => index + start
  ).filter(i => testFn(i))

  return {
    min: values[0],
    max: values.at(-1),
    values,
    threshold: count + 1
  }
}

export default /*#__PURE__*/ createComponent({
  name: 'QTime',

  props: {
    ...useDarkProps,
    ...useFormProps,
    ...useDatetimeProps,

    modelValue: {
      required: true,
      default: null,
      validator: val => typeof val === 'string' || val === null
    },

    mask: {
      ...useDatetimeProps.mask,
      default: null
    },

    format24h: {
      type: Boolean,
      default: null
    },

    defaultDate: {
      type: String,
      validator: v => defaultDateRE.test(v)
    },

    options: Function,
    hourOptions: Array,
    minuteOptions: Array,
    secondOptions: Array,

    withSeconds: Boolean,
    nowBtn: Boolean
  },

  emits: useDatetimeEmits,

  setup(props, { slots, emit }) {
    const vm = getCurrentInstance()
    const { $q } = vm.proxy

    const isDark = useDark(props, $q)
    const { tabindex, headerClass, getLocale, getCurrentDate } = useDatetime(
      props,
      $q
    )

    const formAttrs = useFormAttrs(props)
    const injectFormInput = useFormInject(formAttrs)

    let draggingClockRect, dragCache

    const clockRef = ref(null)

    const mask = computed(() => getMask())
    const locale = computed(() => getLocale())

    const defaultDateModel = computed(() => getDefaultDateModel())

    const model = __splitDate(
      props.modelValue,
      mask.value, // initial mask
      locale.value, // initial locale
      props.calendar,
      defaultDateModel.value
    )

    const view = ref(getViewByModel(model))
    const innerModel = ref(model)
    const isAM = ref(model.hour === null || model.hour < 12)
    const computedFormat24h = computed(() =>
      props.format24h !== null ? props.format24h : $q.lang.date.format24h
    )

    const classes = computed(
      () =>
        `q-time q-time--${props.landscape ? 'landscape' : 'portrait'}` +
        (isDark.value ? ' q-time--dark q-dark' : '') +
        (props.disable
          ? ' disabled'
          : props.readonly
            ? ' q-time--readonly'
            : '') +
        (props.bordered ? ' q-time--bordered' : '') +
        (props.square ? ' q-time--square no-border-radius' : '') +
        (props.flat ? ' q-time--flat no-shadow' : '')
    )

    const stringModel = computed(() => {
      const time = innerModel.value

      return {
        hour:
          time.hour === null
            ? '--'
            : computedFormat24h.value
              ? pad(time.hour)
              : String(
                  isAM.value
                    ? time.hour === 0
                      ? 12
                      : time.hour
                    : time.hour > 12
                      ? time.hour - 12
                      : time.hour
                ),
        minute: time.minute === null ? '--' : pad(time.minute),
        second: time.second === null ? '--' : pad(time.second)
      }
    })

    const pointerStyle = computed(() => {
      const forHour = view.value === 'hour',
        divider = forHour ? 12 : 60,
        amount = innerModel.value[view.value],
        degrees = Math.round(amount * (360 / divider)) - 180

      let transform = `rotate(${degrees}deg) translateX(-50%)`

      if (forHour && computedFormat24h.value && innerModel.value.hour >= 12) {
        transform += ' scale(.7)'
      }

      return { transform }
    })

    const minLink = computed(() => innerModel.value.hour !== null)
    const secLink = computed(
      () => minLink.value && innerModel.value.minute !== null
    )

    const hourInSelection = computed(() =>
      props.hourOptions !== void 0
        ? val => props.hourOptions.includes(val)
        : props.options !== void 0
          ? val => props.options(val, null, null)
          : null
    )

    const minuteInSelection = computed(() =>
      props.minuteOptions !== void 0
        ? val => props.minuteOptions.includes(val)
        : props.options !== void 0
          ? val => props.options(innerModel.value.hour, val, null)
          : null
    )

    const secondInSelection = computed(() =>
      props.secondOptions !== void 0
        ? val => props.secondOptions.includes(val)
        : props.options !== void 0
          ? val =>
              props.options(innerModel.value.hour, innerModel.value.minute, val)
          : null
    )

    const validHours = computed(() => {
      if (hourInSelection.value === null) return null

      const am = getValidValues(0, 11, hourInSelection.value)
      const pm = getValidValues(12, 11, hourInSelection.value)
      return { am, pm, values: [...am.values, ...pm.values] }
    })

    const validMinutes = computed(() =>
      minuteInSelection.value !== null
        ? getValidValues(0, 59, minuteInSelection.value)
        : null
    )

    const validSeconds = computed(() =>
      secondInSelection.value !== null
        ? getValidValues(0, 59, secondInSelection.value)
        : null
    )

    const viewValidOptions = computed(() => {
      switch (view.value) {
        case 'hour': {
          return validHours.value
        }
        case 'minute': {
          return validMinutes.value
        }
        case 'second': {
          return validSeconds.value
        }
      }
    })

    const positions = computed(() => {
      let end,
        offset = 0,
        step = 1
      const values =
        viewValidOptions.value !== null ? viewValidOptions.value.values : void 0

      if (view.value === 'hour') {
        if (computedFormat24h.value) {
          end = 23
        } else {
          end = 11
          if (!isAM.value) offset = 12
        }
      } else {
        end = 55
        step = 5
      }

      const pos = []

      for (let val = 0, index = 0; val <= end; val += step, index++) {
        const actualVal = val + offset,
          disable = values?.includes(actualVal) === false,
          label =
            view.value === 'hour' && val === 0
              ? computedFormat24h.value
                ? '00'
                : '12'
              : val

        pos.push({ val: actualVal, index, disable, label })
      }

      return pos
    })

    const clockDirectives = computed(() => [
      [
        TouchPan,
        onPan,
        void 0,
        {
          stop: true,
          prevent: true,
          mouse: true
        }
      ]
    ])

    watch(
      () => props.modelValue,
      v => {
        const val = __splitDate(
          v,
          mask.value,
          locale.value,
          props.calendar,
          defaultDateModel.value
        )

        if (
          val.dateHash !== innerModel.value.dateHash ||
          val.timeHash !== innerModel.value.timeHash
        ) {
          innerModel.value = val

          if (val.hour === null) {
            view.value = 'hour'
          } else {
            isAM.value = val.hour < 12
          }
        }
      }
    )

    watch([mask, locale], () => {
      nextTick(() => {
        updateValue()
      })
    })

    function setNow() {
      const date = {
        ...getCurrentDate(),
        ...getCurrentTime()
      }

      updateValue(date)
      Object.assign(innerModel.value, date) // reset any pending changes to innerModel

      view.value = 'hour'
    }

    function getNormalizedClockValue(val, { min, max, values, threshold }) {
      if (val === min) {
        return min
      }

      if (val < min || val > max) {
        return getWheelDist(val, min, threshold) <=
          getWheelDist(val, max, threshold)
          ? min
          : max
      }

      const index = values.findIndex(v => val <= v),
        before = values[index - 1],
        after = values[index]

      return val - before <= after - val ? before : after
    }

    function getMask() {
      return props.calendar !== 'persian' && props.mask !== null
        ? props.mask
        : `HH:mm${props.withSeconds ? ':ss' : ''}`
    }

    function getDefaultDateModel() {
      if (typeof props.defaultDate !== 'string') {
        const date = getCurrentDate(true)
        date.dateHash = getDayHash(date)
        return date
      }

      return __splitDate(
        props.defaultDate,
        'YYYY/MM/DD',
        void 0,
        props.calendar
      )
    }

    function shouldAbortInteraction() {
      return (
        vmIsDestroyed(vm) ||
        // if we have limited options, can we actually set any?
        (viewValidOptions.value !== null &&
          (viewValidOptions.value.values.length === 0 ||
            (view.value === 'hour' &&
              !computedFormat24h.value &&
              validHours.value[isAM.value ? 'am' : 'pm'].values.length === 0)))
      )
    }

    function getClockRect() {
      const clock = clockRef.value,
        { top, left, width } = clock.getBoundingClientRect(),
        dist = width / 2

      return {
        top: top + dist,
        left: left + dist,
        dist: dist * 0.7
      }
    }

    function onPan(event) {
      if (shouldAbortInteraction()) return

      if (event.isFirst) {
        draggingClockRect = getClockRect()
        dragCache = updateClock(event.evt, draggingClockRect)
        return
      }

      dragCache = updateClock(event.evt, draggingClockRect, dragCache)

      if (event.isFinal) {
        draggingClockRect = false
        dragCache = null
        goToNextView()
      }
    }

    function goToNextView() {
      if (view.value === 'hour') {
        view.value = 'minute'
      } else if (props.withSeconds && view.value === 'minute') {
        view.value = 'second'
      }
    }

    function updateClock(evt, clockRect, cacheVal) {
      const pos = position(evt),
        height = Math.abs(pos.top - clockRect.top),
        distance = Math.hypot(
          pos.top - clockRect.top,
          pos.left - clockRect.left
        )

      let val,
        angle = Math.asin(height / distance) * (180 / Math.PI)

      if (pos.top < clockRect.top) {
        angle = clockRect.left < pos.left ? 90 - angle : 270 + angle
      } else {
        angle = clockRect.left < pos.left ? angle + 90 : 270 - angle
      }

      if (view.value === 'hour') {
        val = angle / 30

        if (validHours.value !== null) {
          const am = !computedFormat24h.value
            ? isAM.value
            : validHours.value.am.values.length !== 0 &&
                validHours.value.pm.values.length !== 0
              ? distance >= clockRect.dist
              : validHours.value.am.values.length !== 0

          val = getNormalizedClockValue(
            val + (am ? 0 : 12),
            validHours.value[am ? 'am' : 'pm']
          )
        } else {
          val = Math.round(val)

          if (computedFormat24h.value) {
            if (distance < clockRect.dist) {
              if (val < 12) {
                val += 12
              }
            } else if (val === 12) {
              val = 0
            }
          } else if (isAM.value && val === 12) {
            val = 0
          } else if (!isAM.value && val !== 12) {
            val += 12
          }
        }

        if (computedFormat24h.value) {
          isAM.value = val < 12
        }
      } else {
        val = Math.round(angle / 6) % 60

        if (view.value === 'minute' && validMinutes.value !== null) {
          val = getNormalizedClockValue(val, validMinutes.value)
        } else if (view.value === 'second' && validSeconds.value !== null) {
          val = getNormalizedClockValue(val, validSeconds.value)
        }
      }

      if (cacheVal !== val) {
        setModel[view.value](val)
      }

      return val
    }

    const setView = {
      hour() {
        view.value = 'hour'
      },
      minute() {
        view.value = 'minute'
      },
      second() {
        view.value = 'second'
      }
    }

    function setAmOnKey(e) {
      if ([13, 32].includes(e.keyCode)) {
        setAm()
        stopAndPrevent(e)
      }
    }

    function setPmOnKey(e) {
      if ([13, 32].includes(e.keyCode)) {
        setPm()
        stopAndPrevent(e)
      }
    }

    function onClick(evt) {
      if (!shouldAbortInteraction()) {
        // onMousedown() has already updated the offset
        // (on desktop only, through mousedown event)
        if (!$q.platform.is.desktop) {
          updateClock(evt, getClockRect())
        }

        goToNextView()
      }
    }

    function onMousedown(evt) {
      if (!shouldAbortInteraction()) {
        updateClock(evt, getClockRect())
      }
    }

    function stepHour(payload) {
      if (validHours.value !== null) {
        const values = computedFormat24h.value
          ? validHours.value.values
          : validHours.value[isAM.value ? 'am' : 'pm'].values

        if (values.length === 0) return

        if (innerModel.value.hour === null) {
          setHour(values[0])
        } else {
          const index =
            (values.length + values.indexOf(innerModel.value.hour) + payload) %
            values.length

          setHour(values[index])
        }
      } else {
        const wrap = computedFormat24h.value ? 24 : 12,
          offset = !computedFormat24h.value && !isAM.value ? 12 : 0,
          val =
            innerModel.value.hour === null ? -payload : innerModel.value.hour

        setHour(offset + ((24 + val + payload) % wrap))
      }
    }

    function stepMinute(payload) {
      if (validMinutes.value !== null) {
        const values = validMinutes.value.values

        if (values.length === 0) return

        if (innerModel.value.minute === null) {
          setMinute(values[0])
        } else {
          const index =
            (values.length +
              values.indexOf(innerModel.value.minute) +
              payload) %
            values.length

          setMinute(values[index])
        }
      } else {
        const val =
          innerModel.value.minute === null ? -payload : innerModel.value.minute
        setMinute((60 + val + payload) % 60)
      }
    }

    function stepSecond(payload) {
      if (validSeconds.value !== null) {
        const values = validSeconds.value.values

        if (values.length === 0) return

        if (innerModel.value.second === null) {
          setSecond(values[0])
        } else {
          const index =
            (values.length +
              values.indexOf(innerModel.value.second) +
              payload) %
            values.length

          setSecond(values[index])
        }
      } else {
        const val =
          innerModel.value.second === null ? -payload : innerModel.value.second
        setSecond((60 + val + payload) % 60)
      }
    }

    function edgeHour(toEnd) {
      if (validHours.value !== null) {
        const values = computedFormat24h.value
          ? validHours.value.values
          : validHours.value[isAM.value ? 'am' : 'pm'].values

        if (values.length !== 0) {
          setHour(toEnd ? values.at(-1) : values[0])
        }
      } else if (computedFormat24h.value) {
        setHour(toEnd ? 23 : 0)
      } else {
        // displayed range is 1-12; displayed 12 is hour 0 (AM) / 12 (PM)
        setHour(toEnd ? (isAM.value ? 0 : 12) : isAM.value ? 1 : 13)
      }
    }

    function edgeMinute(toEnd) {
      if (validMinutes.value !== null) {
        const values = validMinutes.value.values

        if (values.length !== 0) {
          setMinute(toEnd ? values.at(-1) : values[0])
        }
      } else {
        setMinute(toEnd ? 59 : 0)
      }
    }

    function edgeSecond(toEnd) {
      if (validSeconds.value !== null) {
        const values = validSeconds.value.values

        if (values.length !== 0) {
          setSecond(toEnd ? values.at(-1) : values[0])
        }
      } else {
        setSecond(toEnd ? 59 : 0)
      }
    }

    // pending multi-digit keyboard entry for the focused unit
    let digitBuffer = { unit: null, value: 0, time: 0 }

    function enterDigit(unit, digit, min, max, apply) {
      const time = Date.now()
      const acc =
        digitBuffer.unit === unit && time - digitBuffer.time < 1500
          ? digitBuffer.value * 10 + digit
          : digit

      // an out-of-range accumulation restarts the entry from the fresh digit
      const val = acc >= min && acc <= max ? acc : digit

      digitBuffer = { unit, value: val, time }

      if (val >= min && val <= max) {
        apply(val)
      }
    }

    function digitHour(digit) {
      enterDigit(
        'hour',
        digit,
        computedFormat24h.value ? 0 : 1,
        computedFormat24h.value ? 23 : 12,
        val => {
          const hour = computedFormat24h.value
            ? val
            : val === 12
              ? isAM.value
                ? 0
                : 12
              : isAM.value
                ? val
                : val + 12

          if (hourInSelection.value === null || hourInSelection.value(hour)) {
            setHour(hour)
          }
        }
      )
    }

    function digitMinute(digit) {
      enterDigit('minute', digit, 0, 59, val => {
        if (minuteInSelection.value === null || minuteInSelection.value(val)) {
          setMinute(val)
        }
      })
    }

    function digitSecond(digit) {
      enterDigit('second', digit, 0, 59, val => {
        if (secondInSelection.value === null || secondInSelection.value(val)) {
          setSecond(val)
        }
      })
    }

    const onKeydownHour = getLinkKeydown(stepHour, edgeHour, digitHour)
    const onKeydownMinute = getLinkKeydown(stepMinute, edgeMinute, digitMinute)
    const onKeydownSecond = getLinkKeydown(stepSecond, edgeSecond, digitSecond)

    function onKeyupHour(e) {
      if ([13, 32].includes(e.keyCode)) {
        view.value = 'hour'
        stopAndPrevent(e)
      }
    }

    function onKeyupMinute(e) {
      if ([13, 32].includes(e.keyCode)) {
        view.value = 'minute'
        stopAndPrevent(e)
      }
    }

    function onKeyupSecond(e) {
      if ([13, 32].includes(e.keyCode)) {
        view.value = 'second'
        stopAndPrevent(e)
      }
    }

    function setHour(hour) {
      if (innerModel.value.hour !== hour) {
        innerModel.value.hour = hour
        verifyAndUpdate()
      }
    }

    function setMinute(minute) {
      if (innerModel.value.minute !== minute) {
        innerModel.value.minute = minute
        verifyAndUpdate()
      }
    }

    function setSecond(second) {
      if (innerModel.value.second !== second) {
        innerModel.value.second = second
        verifyAndUpdate()
      }
    }

    const setModel = {
      hour: setHour,
      minute: setMinute,
      second: setSecond
    }

    function setAm() {
      if (!isAM.value) {
        isAM.value = true

        if (innerModel.value.hour !== null) {
          innerModel.value.hour -= 12
          verifyAndUpdate()
        }
      }
    }

    function setPm() {
      if (isAM.value) {
        isAM.value = false

        if (innerModel.value.hour !== null) {
          innerModel.value.hour += 12
          verifyAndUpdate()
        }
      }
    }

    function goToViewWhenHasModel(newView) {
      const val = props.modelValue
      if (
        view.value !== newView &&
        val !== void 0 &&
        val !== null &&
        val !== '' &&
        typeof val !== 'string'
      ) {
        view.value = newView
      }
    }

    function verifyAndUpdate() {
      if (
        hourInSelection.value !== null &&
        !hourInSelection.value(innerModel.value.hour)
      ) {
        innerModel.value = __splitDate()
        goToViewWhenHasModel('hour')
        return
      }

      if (
        minuteInSelection.value !== null &&
        !minuteInSelection.value(innerModel.value.minute)
      ) {
        innerModel.value.minute = null
        innerModel.value.second = null
        goToViewWhenHasModel('minute')
        return
      }

      if (
        props.withSeconds &&
        secondInSelection.value !== null &&
        !secondInSelection.value(innerModel.value.second)
      ) {
        innerModel.value.second = null
        goToViewWhenHasModel('second')
        return
      }

      if (
        innerModel.value.hour === null ||
        innerModel.value.minute === null ||
        (props.withSeconds && innerModel.value.second === null)
      ) {
        return
      }

      updateValue()
    }

    function updateValue(obj) {
      const date = { ...innerModel.value, ...obj }

      const val =
        props.calendar === 'persian'
          ? pad(date.hour) +
            ':' +
            pad(date.minute) +
            (props.withSeconds ? ':' + pad(date.second) : '')
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

    function getHeader() {
      const label = [
        h(
          'div',
          {
            class:
              'q-time__link ' +
              (view.value === 'hour'
                ? 'q-time__link--active'
                : 'cursor-pointer'),
            tabindex: tabindex.value,
            role: 'spinbutton',
            'aria-label': locale.value.hour,
            'aria-valuemin': computedFormat24h.value ? 0 : 1,
            'aria-valuemax': computedFormat24h.value ? 23 : 12,
            'aria-valuenow':
              innerModel.value.hour !== null
                ? Number(stringModel.value.hour)
                : void 0,
            onClick: setView.hour,
            onKeydown: onKeydownHour,
            onKeyup: onKeyupHour
          },
          stringModel.value.hour
        ),

        h('div', ':'),

        h(
          'div',
          minLink.value
            ? {
                class:
                  'q-time__link ' +
                  (view.value === 'minute'
                    ? 'q-time__link--active'
                    : 'cursor-pointer'),
                tabindex: tabindex.value,
                role: 'spinbutton',
                'aria-label': locale.value.minute,
                'aria-valuemin': 0,
                'aria-valuemax': 59,
                'aria-valuenow': innerModel.value.minute ?? void 0,
                onKeydown: onKeydownMinute,
                onKeyup: onKeyupMinute,
                onClick: setView.minute
              }
            : { class: 'q-time__link' },
          stringModel.value.minute
        )
      ]

      if (props.withSeconds) {
        label.push(
          h('div', ':'),

          h(
            'div',
            secLink.value
              ? {
                  class:
                    'q-time__link ' +
                    (view.value === 'second'
                      ? 'q-time__link--active'
                      : 'cursor-pointer'),
                  tabindex: tabindex.value,
                  role: 'spinbutton',
                  'aria-label': locale.value.second,
                  'aria-valuemin': 0,
                  'aria-valuemax': 59,
                  'aria-valuenow': innerModel.value.second ?? void 0,
                  onKeydown: onKeydownSecond,
                  onKeyup: onKeyupSecond,
                  onClick: setView.second
                }
              : { class: 'q-time__link' },
            stringModel.value.second
          )
        )
      }

      const child = [
        h(
          'div',
          {
            class: 'q-time__header-label row items-center no-wrap',
            dir: 'ltr'
          },
          label
        )
      ]

      if (!computedFormat24h.value) {
        child.push(
          h(
            'div',
            {
              class: 'q-time__header-ampm column items-between no-wrap'
            },
            [
              h(
                'div',
                {
                  class:
                    'q-time__link ' +
                    (isAM.value ? 'q-time__link--active' : 'cursor-pointer'),
                  tabindex: tabindex.value,
                  role: 'button',
                  'aria-pressed': isAM.value ? 'true' : 'false',
                  onClick: setAm,
                  onKeydown: preventSpace,
                  onKeyup: setAmOnKey
                },
                'AM'
              ),

              h(
                'div',
                {
                  class:
                    'q-time__link ' +
                    (isAM.value ? 'cursor-pointer' : 'q-time__link--active'),
                  tabindex: tabindex.value,
                  role: 'button',
                  'aria-pressed': isAM.value ? 'false' : 'true',
                  onClick: setPm,
                  onKeydown: preventSpace,
                  onKeyup: setPmOnKey
                },
                'PM'
              )
            ]
          )
        )
      }

      return h(
        'div',
        {
          class: 'q-time__header flex flex-center no-wrap ' + headerClass.value
        },
        child
      )
    }

    function getClock() {
      const current = innerModel.value[view.value]

      return h(
        'div',
        {
          class: 'q-time__content col relative-position'
        },
        [
          h(
            Transition,
            {
              name: 'q-transition--scale'
            },
            () =>
              h(
                'div',
                {
                  key: 'clock' + view.value,
                  class: 'q-time__container-parent absolute-full',
                  // pointer-only visualization; the header spinbuttons
                  // are the accessible path to the same values
                  'aria-hidden': 'true'
                },
                [
                  h(
                    'div',
                    {
                      ref: clockRef,
                      class: 'q-time__container-child fit overflow-hidden'
                    },
                    [
                      withDirectives(
                        h(
                          'div',
                          {
                            class:
                              'q-time__clock cursor-pointer non-selectable',
                            onClick,
                            onMousedown
                          },
                          [
                            h('div', { class: 'q-time__clock-circle fit' }, [
                              h('div', {
                                class:
                                  'q-time__clock-pointer' +
                                  (innerModel.value[view.value] === null
                                    ? ' hidden'
                                    : props.color !== void 0
                                      ? ` text-${props.color}`
                                      : ''),
                                style: pointerStyle.value
                              }),

                              positions.value.map(pos =>
                                h(
                                  'div',
                                  {
                                    class:
                                      `q-time__clock-position row flex-center q-time__clock-pos-${pos.index}` +
                                      (pos.val === current
                                        ? ' q-time__clock-position--active ' +
                                          headerClass.value
                                        : pos.disable
                                          ? ' q-time__clock-position--disable'
                                          : '')
                                  },
                                  [h('span', pos.label)]
                                )
                              )
                            ])
                          ]
                        ),
                        clockDirectives.value
                      )
                    ]
                  )
                ]
              )
          ),

          props.nowBtn
            ? h(QBtn, {
                class: 'q-time__now-button absolute',
                icon: $q.iconSet.datetime.now,
                unelevated: true,
                size: 'sm',
                round: true,
                color: props.color,
                textColor: props.textColor,
                tabindex: tabindex.value,
                'aria-label': locale.value.now,
                onClick: setNow
              })
            : null
        ]
      )
    }

    // expose public method
    vm.proxy.setNow = setNow

    return () => {
      const child = [getClock()]

      const def = hSlot(slots.default)
      if (def !== void 0) {
        child.push(h('div', { class: 'q-time__actions' }, def))
      }

      if (props.name !== void 0 && !props.disable) {
        injectFormInput(child, 'push')
      }

      return h(
        'div',
        {
          class: classes.value,
          tabindex: -1
        },
        [
          getHeader(),
          h('div', { class: 'q-time__main col overflow-auto' }, child)
        ]
      )
    }
  }
})
