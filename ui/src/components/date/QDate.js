import {
  Transition,
  computed,
  getCurrentInstance,
  h,
  nextTick,
  ref,
  watch
} from 'vue'

import QBtn from '../btn/QBtn.js'

import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'
import useRenderCache from '../../composables/use-render-cache/use-render-cache.js'
import useHydration from '../../composables/use-hydration/use-hydration.js'
import {
  useFormAttrs,
  useFormInject,
  useFormProps
} from '../../composables/use-form/private.use-form.js'
import useDatetime, {
  getDayHash,
  useDatetimeEmits,
  useDatetimeProps
} from './use-datetime.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'
import { __splitDate, formatDate, getDateDiff } from '../../utils/date/date.js'
import { pad } from '../../utils/format/format.js'
import {
  jalaaliMonthLength,
  toGregorian
} from '../../utils/date/private.persian.js'
import { isObject } from '../../utils/is/is.js'

const yearsInterval = 20
const views = ['Calendar', 'Years', 'Months']
const viewIsValid = v => views.includes(v)
const yearMonthRE = /^-?[\d]+\/[0-1]\d$/
const yearMonthValidator = v => yearMonthRE.test(v)
const lineStr = ' \u2014 '

function getMonthHash(date) {
  return date.year + '/' + pad(date.month)
}

function getShortDate(date) {
  return { year: date.year, month: date.month, day: date.day }
}

export default createComponent({
  name: 'QDate',

  props: {
    ...useDatetimeProps,
    ...useFormProps,
    ...useDarkProps,

    modelValue: {
      required: true,
      validator: val =>
        typeof val === 'string' ||
        Array.isArray(val) ||
        Object(val) === val ||
        val === null
    },

    multiple: Boolean,
    range: Boolean,

    title: String,
    subtitle: String,

    mask: {
      ...useDatetimeProps.mask,
      // this mask is forced
      // when using persian calendar
      default: 'YYYY/MM/DD'
    },

    defaultYearMonth: {
      type: String,
      validator: yearMonthValidator
    },

    yearsInMonthView: Boolean,

    events: [Array, Function],
    eventColor: [String, Function],

    emitImmediately: Boolean,

    options: [Array, Function],

    navigationMinYearMonth: {
      type: String,
      validator: yearMonthValidator
    },

    navigationMaxYearMonth: {
      type: String,
      validator: yearMonthValidator
    },

    noUnset: Boolean,

    firstDayOfWeek: [String, Number],
    todayBtn: Boolean,
    minimal: Boolean,
    defaultView: {
      type: String,
      default: 'Calendar',
      validator: viewIsValid
    }
  },

  emits: [...useDatetimeEmits, 'rangeStart', 'rangeEnd', 'navigation'],

  setup(props, { slots, emit }) {
    const { proxy } = getCurrentInstance()
    const { $q } = proxy

    const isDark = useDark(props, $q)
    const { getCache } = useRenderCache()
    const { isHydrated } = useHydration()
    const { tabindex, headerClass, getLocale, getCurrentDate } = useDatetime(
      props,
      $q
    )

    let lastEmitValue

    const formAttrs = useFormAttrs(props)
    const injectFormInput = useFormInject(formAttrs)

    const blurTargetRef = ref(null)
    const innerMask = ref(getMask())
    const innerLocale = ref(getLocale())

    const mask = computed(() => getMask())
    const locale = computed(() => getLocale())

    const today = computed(() => getCurrentDate())

    // model of current calendar view:
    const viewModel = ref(getViewModel(innerMask.value, innerLocale.value))

    const view = ref(props.defaultView)

    const direction = computed(() => ($q.lang.rtl ? 'right' : 'left'))
    const monthDirection = ref(direction.value)
    const yearDirection = ref(direction.value)

    const localYear = viewModel.value.year
    const startYear = ref(
      localYear -
        (localYear % yearsInterval) -
        (localYear < 0 ? yearsInterval : 0)
    )
    const editRange = ref(null)

    const classes = computed(() => {
      const type = props.landscape ? 'landscape' : 'portrait'
      return (
        `q-date q-date--${type} q-date--${type}-${props.minimal ? 'minimal' : 'standard'}` +
        (isDark.value ? ' q-date--dark q-dark' : '') +
        (props.bordered ? ' q-date--bordered' : '') +
        (props.square ? ' q-date--square no-border-radius' : '') +
        (props.flat ? ' q-date--flat no-shadow' : '') +
        (props.disable
          ? ' disabled'
          : props.readonly
            ? ' q-date--readonly'
            : '')
      )
    })

    const computedColor = computed(() => props.color || 'primary')

    const computedTextColor = computed(() => props.textColor || 'white')

    const isImmediate = computed(
      () => props.emitImmediately && !props.multiple && !props.range
    )

    const normalizedModel = computed(() =>
      Array.isArray(props.modelValue)
        ? props.modelValue
        : props.modelValue !== null && props.modelValue !== void 0
          ? [props.modelValue]
          : []
    )

    const daysModel = computed(() =>
      normalizedModel.value
        .filter(date => typeof date === 'string')
        .map(date => decodeString(date, innerMask.value, innerLocale.value))
        .filter(
          date =>
            date.dateHash !== null &&
            date.day !== null &&
            date.month !== null &&
            date.year !== null
        )
    )

    const rangeModel = computed(() => {
      const fn = date => decodeString(date, innerMask.value, innerLocale.value)
      return normalizedModel.value
        .filter(
          date => isObject(date) && date.from !== void 0 && date.to !== void 0
        )
        .map(range => ({ from: fn(range.from), to: fn(range.to) }))
        .filter(
          range =>
            range.from.dateHash !== null &&
            range.to.dateHash !== null &&
            range.from.dateHash < range.to.dateHash
        )
    })

    const getNativeDateFn = computed(() =>
      props.calendar !== 'persian'
        ? model => new Date(model.year, model.month - 1, model.day)
        : model => {
            const gDate = toGregorian(model.year, model.month, model.day)
            return new Date(gDate.gy, gDate.gm - 1, gDate.gd)
          }
    )

    const encodeObjectFn = computed(() =>
      props.calendar === 'persian'
        ? getDayHash
        : (date, dateMask, dateLocale) =>
            formatDate(
              new Date(
                date.year,
                date.month - 1,
                date.day,
                date.hour,
                date.minute,
                date.second,
                date.millisecond
              ),
              dateMask === void 0 ? innerMask.value : dateMask,
              dateLocale === void 0 ? innerLocale.value : dateLocale,
              date.year,
              date.timezoneOffset
            )
    )

    const daysInModel = computed(
      () =>
        daysModel.value.length +
        rangeModel.value.reduce(
          (acc, range) =>
            acc +
            1 +
            getDateDiff(
              getNativeDateFn.value(range.to),
              getNativeDateFn.value(range.from)
            ),
          0
        )
    )

    const headerTitle = computed(() => {
      if (
        props.title !== void 0 &&
        props.title !== null &&
        props.title.length !== 0
      ) {
        return props.title
      }

      if (editRange.value !== null) {
        const model = editRange.value.init
        const date = getNativeDateFn.value(model)

        return (
          innerLocale.value.daysShort[date.getDay()] +
          ', ' +
          innerLocale.value.monthsShort[model.month - 1] +
          ' ' +
          model.day +
          lineStr +
          '?'
        )
      }

      if (daysInModel.value === 0) return lineStr

      if (daysInModel.value > 1) {
        return `${daysInModel.value} ${innerLocale.value.pluralDay}`
      }

      const model = daysModel.value[0]
      const date = getNativeDateFn.value(model)

      if (Number.isNaN(date.valueOf())) return lineStr

      if (innerLocale.value.headerTitle !== void 0) {
        return innerLocale.value.headerTitle(date, model)
      }

      return (
        innerLocale.value.daysShort[date.getDay()] +
        ', ' +
        innerLocale.value.monthsShort[model.month - 1] +
        ' ' +
        model.day
      )
    })

    const minSelectedModel = computed(() => {
      const model = [
        ...daysModel.value,
        ...rangeModel.value.map(range => range.from)
      ].sort((a, b) => a.year - b.year || a.month - b.month)

      return model[0]
    })

    const maxSelectedModel = computed(() => {
      const model = [
        ...daysModel.value,
        ...rangeModel.value.map(range => range.to)
      ].sort((a, b) => b.year - a.year || b.month - a.month)

      return model[0]
    })

    const headerSubtitle = computed(() => {
      if (
        props.subtitle !== void 0 &&
        props.subtitle !== null &&
        props.subtitle.length !== 0
      ) {
        return props.subtitle
      }

      if (daysInModel.value === 0) {
        return lineStr
      }

      if (daysInModel.value > 1) {
        const from = minSelectedModel.value
        const to = maxSelectedModel.value
        const month = innerLocale.value.monthsShort

        return (
          month[from.month - 1] +
          (from.year !== to.year
            ? ' ' + from.year + lineStr + month[to.month - 1] + ' '
            : from.month !== to.month
              ? lineStr + month[to.month - 1]
              : '') +
          ' ' +
          to.year
        )
      }

      return daysModel.value[0].year
    })

    const dateArrow = computed(() => {
      const val = [
        $q.iconSet.datetime.arrowLeft,
        $q.iconSet.datetime.arrowRight
      ]
      return $q.lang.rtl ? val.reverse() : val
    })

    const computedFirstDayOfWeek = computed(() =>
      props.firstDayOfWeek !== void 0
        ? Number(props.firstDayOfWeek)
        : innerLocale.value.firstDayOfWeek
    )

    const daysOfWeek = computed(() => {
      const days = innerLocale.value.daysShort,
        first = computedFirstDayOfWeek.value

      return first > 0
        ? [...days.slice(first, 7), ...days.slice(0, first)]
        : days
    })

    const daysInMonth = computed(() => {
      const date = viewModel.value
      return props.calendar !== 'persian'
        ? new Date(date.year, date.month, 0).getDate()
        : jalaaliMonthLength(date.year, date.month)
    })

    const evtColor = computed(() =>
      typeof props.eventColor === 'function'
        ? props.eventColor
        : () => props.eventColor
    )

    const minNav = computed(() => {
      if (props.navigationMinYearMonth === void 0) {
        return null
      }

      const data = props.navigationMinYearMonth.split('/')
      return {
        year: Number.parseInt(data[0], 10),
        month: Number.parseInt(data[1], 10)
      }
    })

    const maxNav = computed(() => {
      if (props.navigationMaxYearMonth === void 0) {
        return null
      }

      const data = props.navigationMaxYearMonth.split('/')
      return {
        year: Number.parseInt(data[0], 10),
        month: Number.parseInt(data[1], 10)
      }
    })

    const navBoundaries = computed(() => {
      const data = {
        month: { prev: true, next: true },
        year: { prev: true, next: true }
      }

      if (minNav.value !== null && minNav.value.year >= viewModel.value.year) {
        data.year.prev = false
        if (
          minNav.value.year === viewModel.value.year &&
          minNav.value.month >= viewModel.value.month
        ) {
          data.month.prev = false
        }
      }

      if (maxNav.value !== null && maxNav.value.year <= viewModel.value.year) {
        data.year.next = false
        if (
          maxNav.value.year === viewModel.value.year &&
          maxNav.value.month <= viewModel.value.month
        ) {
          data.month.next = false
        }
      }

      return data
    })

    const daysMap = computed(() => {
      const map = {}

      daysModel.value.forEach(entry => {
        const hash = getMonthHash(entry)

        if (map[hash] === void 0) {
          map[hash] = []
        }

        map[hash].push(entry.day)
      })

      return map
    })

    const rangeMap = computed(() => {
      const map = {}

      rangeModel.value.forEach(entry => {
        const hashFrom = getMonthHash(entry.from)
        const hashTo = getMonthHash(entry.to)

        if (map[hashFrom] === void 0) {
          map[hashFrom] = []
        }

        map[hashFrom].push({
          from: entry.from.day,
          to: hashFrom === hashTo ? entry.to.day : void 0,
          range: entry
        })

        if (hashFrom < hashTo) {
          let hash
          const { year, month } = entry.from
          const cur =
            month < 12
              ? { year, month: month + 1 }
              : { year: year + 1, month: 1 }

          while ((hash = getMonthHash(cur)) <= hashTo) {
            if (map[hash] === void 0) {
              map[hash] = []
            }

            map[hash].push({
              from: void 0,
              to: hash === hashTo ? entry.to.day : void 0,
              range: entry
            })

            cur.month++
            if (cur.month > 12) {
              cur.year++
              cur.month = 1
            }
          }
        }
      })

      return map
    })

    const rangeView = computed(() => {
      if (editRange.value === null) return

      const { init, initHash, final, finalHash } = editRange.value

      const [from, to] = initHash <= finalHash ? [init, final] : [final, init]

      const fromHash = getMonthHash(from)
      const toHash = getMonthHash(to)

      if (fromHash !== viewMonthHash.value && toHash !== viewMonthHash.value) {
        return
      }

      const localView = {}

      if (fromHash === viewMonthHash.value) {
        localView.from = from.day
        localView.includeFrom = true
      } else {
        localView.from = 1
      }

      if (toHash === viewMonthHash.value) {
        localView.to = to.day
        localView.includeTo = true
      } else {
        localView.to = daysInMonth.value
      }

      return localView
    })

    const viewMonthHash = computed(() => getMonthHash(viewModel.value))

    const selectionDaysMap = computed(() => {
      const map = {}

      if (props.options === void 0) {
        for (let i = 1; i <= daysInMonth.value; i++) {
          map[i] = true
        }

        return map
      }

      const fn =
        typeof props.options === 'function'
          ? props.options
          : date => props.options.includes(date)

      for (let i = 1; i <= daysInMonth.value; i++) {
        const dayHash = viewMonthHash.value + '/' + pad(i)
        map[i] = fn(dayHash)
      }

      return map
    })

    const eventDaysMap = computed(() => {
      const map = {}

      if (props.events === void 0) {
        for (let i = 1; i <= daysInMonth.value; i++) {
          map[i] = false
        }
      } else {
        const fn =
          typeof props.events === 'function'
            ? props.events
            : date => props.events.includes(date)

        for (let i = 1; i <= daysInMonth.value; i++) {
          const dayHash = viewMonthHash.value + '/' + pad(i)
          map[i] = fn(dayHash) && evtColor.value(dayHash)
        }
      }

      return map
    })

    const viewDays = computed(() => {
      let date, endDay
      const { year, month } = viewModel.value

      if (props.calendar !== 'persian') {
        date = new Date(year, month - 1, 1)
        endDay = new Date(year, month - 1, 0).getDate()
      } else {
        const gDate = toGregorian(year, month, 1)
        date = new Date(gDate.gy, gDate.gm - 1, gDate.gd)
        let prevJM = month - 1
        let prevJY = year
        if (prevJM === 0) {
          prevJM = 12
          prevJY--
        }
        endDay = jalaaliMonthLength(prevJY, prevJM)
      }

      return {
        days: date.getDay() - computedFirstDayOfWeek.value - 1,
        endDay
      }
    })

    const days = computed(() => {
      const res = []
      const { days: localDays, endDay } = viewDays.value

      const len = localDays < 0 ? localDays + 7 : localDays
      if (len < 6) {
        for (let i = endDay - len; i <= endDay; i++) {
          res.push({ i, fill: true })
        }
      }

      const index = res.length

      for (let i = 1; i <= daysInMonth.value; i++) {
        const day = { i, event: eventDaysMap.value[i], classes: [] }

        if (selectionDaysMap.value[i]) {
          day.in = true
          day.flat = true
        }

        res.push(day)
      }

      // if current view has days in model
      if (daysMap.value[viewMonthHash.value] !== void 0) {
        daysMap.value[viewMonthHash.value].forEach(day => {
          const i = index + day - 1
          Object.assign(res[i], {
            selected: true,
            unelevated: true,
            flat: false,
            color: computedColor.value,
            textColor: computedTextColor.value
          })
        })
      }

      // if current view has ranges in model
      if (rangeMap.value[viewMonthHash.value] !== void 0) {
        rangeMap.value[viewMonthHash.value].forEach(entry => {
          if (entry.from !== void 0) {
            const from = index + entry.from - 1
            const to = index + (entry.to || daysInMonth.value) - 1

            for (let day = from; day <= to; day++) {
              Object.assign(res[day], {
                range: entry.range,
                unelevated: true,
                color: computedColor.value,
                textColor: computedTextColor.value
              })
            }

            Object.assign(res[from], {
              rangeFrom: true,
              flat: false
            })

            if (entry.to !== void 0) {
              Object.assign(res[to], {
                rangeTo: true,
                flat: false
              })
            }
          } else if (entry.to !== void 0) {
            const to = index + entry.to - 1

            for (let day = index; day <= to; day++) {
              Object.assign(res[day], {
                range: entry.range,
                unelevated: true,
                color: computedColor.value,
                textColor: computedTextColor.value
              })
            }

            Object.assign(res[to], {
              flat: false,
              rangeTo: true
            })
          } else {
            const to = index + daysInMonth.value - 1
            for (let day = index; day <= to; day++) {
              Object.assign(res[day], {
                range: entry.range,
                unelevated: true,
                color: computedColor.value,
                textColor: computedTextColor.value
              })
            }
          }
        })
      }

      if (rangeView.value !== void 0) {
        const from = index + rangeView.value.from - 1
        const to = index + rangeView.value.to - 1

        for (let day = from; day <= to; day++) {
          res[day].color = computedColor.value
          res[day].editRange = true
        }

        if (rangeView.value.includeFrom) {
          res[from].editRangeFrom = true
        }
        if (rangeView.value.includeTo) {
          res[to].editRangeTo = true
        }
      }

      if (
        isHydrated.value &&
        viewModel.value.year === today.value.year &&
        viewModel.value.month === today.value.month
      ) {
        res[index + today.value.day - 1].today = true
      }

      const left = res.length % 7
      if (left > 0) {
        const afterDays = 7 - left
        for (let i = 1; i <= afterDays; i++) {
          res.push({ i, fill: true })
        }
      }

      res.forEach(day => {
        let cls = 'q-date__calendar-item '

        if (day.fill) {
          cls += 'q-date__calendar-item--fill'
        } else {
          cls += `q-date__calendar-item--${day.in ? 'in' : 'out'}`

          if (day.range !== void 0) {
            cls += ` q-date__range${day.rangeTo ? '-to' : day.rangeFrom ? '-from' : ''}`
          }

          if (day.editRange) {
            cls += ` q-date__edit-range${day.editRangeFrom ? '-from' : ''}${day.editRangeTo ? '-to' : ''}`
          }

          if (day.range !== void 0 || day.editRange) {
            cls += ` text-${day.color}`
          }
        }

        day.classes = cls
      })

      return res
    })

    const attributes = computed(() =>
      props.disable ? { 'aria-disabled': 'true' } : {}
    )

    watch(
      () => props.modelValue,
      v => {
        if (lastEmitValue === JSON.stringify(v)) {
          lastEmitValue = 0
        } else {
          const model = getViewModel(innerMask.value, innerLocale.value)
          updateViewModel(model.year, model.month, model)
        }
      }
    )

    watch(view, () => {
      if (
        blurTargetRef.value !== null &&
        proxy.$el.contains(document.activeElement)
      ) {
        blurTargetRef.value.focus({ preventScroll: true })
      }
    })

    watch(
      () => viewModel.value.year + '|' + viewModel.value.month,
      () => {
        emit('navigation', {
          year: viewModel.value.year,
          month: viewModel.value.month
        })
      }
    )

    watch(mask, val => {
      updateValue(val, innerLocale.value, 'mask')
      innerMask.value = val
    })

    watch(locale, val => {
      updateValue(innerMask.value, val, 'locale')
      innerLocale.value = val
    })

    function setLastValue(v) {
      lastEmitValue = JSON.stringify(v)
    }

    function setToday() {
      const { year, month, day } = today.value

      const date = {
        // contains more props than needed (hour, minute, second, millisecond)
        // but those aren't used in the processing of this "date" variable
        ...viewModel.value,

        // overwriting with today's date
        year,
        month,
        day
      }

      const monthMap = daysMap.value[getMonthHash(date)]

      if (monthMap === void 0 || !monthMap.includes(date.day)) {
        addToModel(date)
      }

      setCalendarTo(date.year, date.month)
    }

    function setView(viewMode) {
      if (viewIsValid(viewMode)) view.value = viewMode
    }

    function offsetCalendar(type, descending) {
      if (['month', 'year'].includes(type)) {
        const fn = type === 'month' ? goToMonth : goToYear
        fn(descending ? -1 : 1)
      }
    }

    function setCalendarTo(year, month) {
      view.value = 'Calendar'
      updateViewModel(year, month)
    }

    function setEditingRange(from, to) {
      if (!props.range || !from) {
        editRange.value = null
        return
      }

      const init = { ...viewModel.value, ...from }
      const final = to !== void 0 ? { ...viewModel.value, ...to } : init

      editRange.value = {
        init,
        initHash: getDayHash(init),
        final,
        finalHash: getDayHash(final)
      }

      setCalendarTo(init.year, init.month)
    }

    function getMask() {
      return props.calendar === 'persian' ? 'YYYY/MM/DD' : props.mask
    }

    function decodeString(date, dateMask, dateLocale) {
      return __splitDate(date, dateMask, dateLocale, props.calendar, {
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
      })
    }

    function getViewModel(dateMask, dateLocale) {
      const model = Array.isArray(props.modelValue)
        ? props.modelValue
        : props.modelValue
          ? [props.modelValue]
          : []

      if (model.length === 0) {
        return getDefaultViewModel()
      }

      const target = model.at(-1)
      const decoded = decodeString(
        target.from !== void 0 ? target.from : target,
        dateMask,
        dateLocale
      )

      return decoded.dateHash === null ? getDefaultViewModel() : decoded
    }

    function getDefaultViewModel() {
      let year, month

      if (props.defaultYearMonth !== void 0) {
        const d = props.defaultYearMonth.split('/')
        year = Number.parseInt(d[0], 10)
        month = Number.parseInt(d[1], 10)
      } else {
        // may come from data() where computed
        // props are not yet available
        const d = today.value !== void 0 ? today.value : getCurrentDate()

        year = d.year
        month = d.month
      }

      return {
        year,
        month,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        dateHash: year + '/' + pad(month) + '/01'
      }
    }

    function goToMonth(offset) {
      let year = viewModel.value.year
      let month = Number(viewModel.value.month) + offset

      if (month === 13) {
        month = 1
        year++
      } else if (month === 0) {
        month = 12
        year--
      }

      updateViewModel(year, month)
      if (isImmediate.value) emitImmediately('month')
    }

    function goToYear(offset) {
      const year = Number(viewModel.value.year) + offset
      updateViewModel(year, viewModel.value.month)
      if (isImmediate.value) emitImmediately('year')
    }

    function setYear(year) {
      updateViewModel(year, viewModel.value.month)
      view.value = props.defaultView === 'Years' ? 'Months' : 'Calendar'
      if (isImmediate.value) emitImmediately('year')
    }

    function setMonth(month) {
      updateViewModel(viewModel.value.year, month)
      view.value = 'Calendar'
      if (isImmediate.value) emitImmediately('month')
    }

    function toggleDate(date, monthHash) {
      const month = daysMap.value[monthHash]
      const fn =
        month?.includes(date.day) === true ? removeFromModel : addToModel

      fn(date)
    }

    function updateViewModel(year, month, time) {
      if (minNav.value !== null && year <= minNav.value.year) {
        if (month < minNav.value.month || year < minNav.value.year) {
          month = minNav.value.month
        }
        year = minNav.value.year
      }

      if (maxNav.value !== null && year >= maxNav.value.year) {
        if (month > maxNav.value.month || year > maxNav.value.year) {
          month = maxNav.value.month
        }
        year = maxNav.value.year
      }

      if (time !== void 0) {
        const { hour, minute, second, millisecond, timezoneOffset, timeHash } =
          time
        Object.assign(viewModel.value, {
          hour,
          minute,
          second,
          millisecond,
          timezoneOffset,
          timeHash
        })
      }

      const newHash = year + '/' + pad(month) + '/01'

      if (newHash !== viewModel.value.dateHash) {
        monthDirection.value =
          viewModel.value.dateHash < newHash === ($q.lang.rtl !== true)
            ? 'left'
            : 'right'
        if (year !== viewModel.value.year) {
          yearDirection.value = monthDirection.value
        }

        nextTick(() => {
          startYear.value =
            year - (year % yearsInterval) - (year < 0 ? yearsInterval : 0)
          Object.assign(viewModel.value, {
            year,
            month,
            day: 1,
            dateHash: newHash
          })
        })
      }
    }

    function emitValue(val, action, date) {
      const value =
        val !== null && val.length === 1 && !props.multiple ? val[0] : val

      const { reason, details } = getEmitParams(action, date)

      setLastValue(value)
      emit('update:modelValue', value, reason, details)
    }

    function emitImmediately(reason) {
      const date =
        daysModel.value[0] !== void 0 && daysModel.value[0].dateHash !== null
          ? { ...daysModel.value[0] }
          : { ...viewModel.value } // inherit day, hours, minutes, milliseconds...

      // nextTick required because of animation delay in viewModel
      nextTick(() => {
        date.year = viewModel.value.year
        date.month = viewModel.value.month

        const maxDay =
          props.calendar !== 'persian'
            ? new Date(date.year, date.month, 0).getDate()
            : jalaaliMonthLength(date.year, date.month)

        date.day = Math.min(Math.max(1, date.day), maxDay)

        const value = encodeEntry(date)
        const { details } = getEmitParams('', date)

        setLastValue(value)
        emit('update:modelValue', value, reason, details)
      })
    }

    function getEmitParams(action, date) {
      return date.from !== void 0
        ? {
            reason: `${action}-range`,
            details: {
              ...getShortDate(date.target),
              from: getShortDate(date.from),
              to: getShortDate(date.to)
            }
          }
        : {
            reason: `${action}-day`,
            details: getShortDate(date)
          }
    }

    function encodeEntry(date, dateMask, dateLocale) {
      return date.from !== void 0
        ? {
            from: encodeObjectFn.value(date.from, dateMask, dateLocale),
            to: encodeObjectFn.value(date.to, dateMask, dateLocale)
          }
        : encodeObjectFn.value(date, dateMask, dateLocale)
    }

    function addToModel(date) {
      let value

      if (props.multiple) {
        if (date.from !== void 0) {
          // we also need to filter out intersections

          const fromHash = getDayHash(date.from)
          const toHash = getDayHash(date.to)

          const localDays = daysModel.value.filter(
            day => day.dateHash < fromHash || day.dateHash > toHash
          )

          const ranges = rangeModel.value.filter(
            ({ from, to }) => to.dateHash < fromHash || from.dateHash > toHash
          )

          value = [...localDays, ...ranges, date].map(entry =>
            encodeEntry(entry)
          )
        } else {
          value = [...normalizedModel.value, encodeEntry(date)]
        }
      } else {
        value = encodeEntry(date)
      }

      emitValue(value, 'add', date)
    }

    function removeFromModel(date) {
      if (props.noUnset) return

      let model = null

      if (props.multiple && Array.isArray(props.modelValue)) {
        const val = encodeEntry(date)

        model =
          date.from !== void 0
            ? props.modelValue.filter(item =>
                item.from !== void 0
                  ? item.from !== val.from && item.to !== val.to
                  : true
              )
            : props.modelValue.filter(item => item !== val)

        if (model.length === 0) {
          model = null
        }
      }

      emitValue(model, 'remove', date)
    }

    function updateValue(dateMask, dateLocale, reason) {
      const model = [...daysModel.value, ...rangeModel.value]
        .map(entry => encodeEntry(entry, dateMask, dateLocale))
        .filter(entry =>
          entry.from !== void 0
            ? entry.from.dateHash !== null && entry.to.dateHash !== null
            : entry.dateHash !== null
        )

      const value = (props.multiple ? model : model[0]) || null

      setLastValue(value)
      emit('update:modelValue', value, reason)
    }

    function getHeader() {
      if (props.minimal) return

      return h(
        'div',
        {
          class: 'q-date__header ' + headerClass.value
        },
        [
          h(
            'div',
            {
              class: 'relative-position'
            },
            [
              h(
                Transition,
                {
                  name: 'q-transition--fade'
                },
                () =>
                  h(
                    'div',
                    {
                      key: 'h-yr-' + headerSubtitle.value,
                      class:
                        'q-date__header-subtitle q-date__header-link ' +
                        (view.value === 'Years'
                          ? 'q-date__header-link--active'
                          : 'cursor-pointer'),
                      tabindex: tabindex.value,
                      ...getCache('vY', {
                        onClick() {
                          view.value = 'Years'
                        },
                        onKeyup(e) {
                          if (e.keyCode === 13) {
                            view.value = 'Years'
                          }
                        }
                      })
                    },
                    [headerSubtitle.value]
                  )
              )
            ]
          ),

          h(
            'div',
            {
              class: 'q-date__header-title relative-position flex no-wrap'
            },
            [
              h(
                'div',
                {
                  class: 'relative-position col'
                },
                [
                  h(
                    Transition,
                    {
                      name: 'q-transition--fade'
                    },
                    () =>
                      h(
                        'div',
                        {
                          key: 'h-sub' + headerTitle.value,
                          class:
                            'q-date__header-title-label q-date__header-link ' +
                            (view.value === 'Calendar'
                              ? 'q-date__header-link--active'
                              : 'cursor-pointer'),
                          tabindex: tabindex.value,
                          ...getCache('vC', {
                            onClick() {
                              view.value = 'Calendar'
                            },
                            onKeyup(e) {
                              if (e.keyCode === 13) {
                                view.value = 'Calendar'
                              }
                            }
                          })
                        },
                        [headerTitle.value]
                      )
                  )
                ]
              ),

              props.todayBtn
                ? h(QBtn, {
                    class: 'q-date__header-today self-start',
                    icon: $q.iconSet.datetime.today,
                    'aria-label': $q.lang.date.today,
                    flat: true,
                    size: 'sm',
                    round: true,
                    tabindex: tabindex.value,
                    onClick: setToday
                  })
                : null
            ]
          )
        ]
      )
    }

    function getNavigation({ label, type, key, dir, goTo, boundaries, cls }) {
      return [
        h(
          'div',
          {
            class: 'row items-center q-date__arrow'
          },
          [
            h(QBtn, {
              round: true,
              dense: true,
              size: 'sm',
              flat: true,
              icon: dateArrow.value[0],
              'aria-label':
                type === 'Years'
                  ? $q.lang.date.prevYear
                  : $q.lang.date.prevMonth,
              tabindex: tabindex.value,
              disable: !boundaries.prev,
              ...getCache('go-#' + type, {
                onClick() {
                  goTo(-1)
                }
              })
            })
          ]
        ),

        h(
          'div',
          {
            class: 'relative-position overflow-hidden flex flex-center' + cls
          },
          [
            h(
              Transition,
              {
                name: 'q-transition--jump-' + dir
              },
              () =>
                h('div', { key }, [
                  h(QBtn, {
                    flat: true,
                    dense: true,
                    noCaps: true,
                    label,
                    tabindex: tabindex.value,
                    ...getCache('view#' + type, {
                      onClick: () => {
                        view.value = type
                      }
                    })
                  })
                ])
            )
          ]
        ),

        h(
          'div',
          {
            class: 'row items-center q-date__arrow'
          },
          [
            h(QBtn, {
              round: true,
              dense: true,
              size: 'sm',
              flat: true,
              icon: dateArrow.value[1],
              'aria-label':
                type === 'Years'
                  ? $q.lang.date.nextYear
                  : $q.lang.date.nextMonth,
              tabindex: tabindex.value,
              disable: !boundaries.next,
              ...getCache('go+#' + type, {
                onClick() {
                  goTo(1)
                }
              })
            })
          ]
        )
      ]
    }

    const renderViews = {
      Calendar: () => [
        h(
          'div',
          {
            key: 'calendar-view',
            class: 'q-date__view q-date__calendar'
          },
          [
            h(
              'div',
              {
                class: 'q-date__navigation row items-center no-wrap'
              },
              [
                ...getNavigation({
                  label: innerLocale.value.months[viewModel.value.month - 1],
                  type: 'Months',
                  key: viewModel.value.month,
                  dir: monthDirection.value,
                  goTo: goToMonth,
                  boundaries: navBoundaries.value.month,
                  cls: ' col'
                }),
                ...getNavigation({
                  label: viewModel.value.year,
                  type: 'Years',
                  key: viewModel.value.year,
                  dir: yearDirection.value,
                  goTo: goToYear,
                  boundaries: navBoundaries.value.year,
                  cls: ''
                })
              ]
            ),

            h(
              'div',
              {
                class: 'q-date__calendar-weekdays row items-center no-wrap'
              },
              daysOfWeek.value.map(day =>
                h('div', { class: 'q-date__calendar-item' }, [h('div', day)])
              )
            ),

            h(
              'div',
              {
                class:
                  'q-date__calendar-days-container relative-position overflow-hidden'
              },
              [
                h(
                  Transition,
                  {
                    name: 'q-transition--slide-' + monthDirection.value
                  },
                  () =>
                    h(
                      'div',
                      {
                        key: viewMonthHash.value,
                        class: 'q-date__calendar-days fit'
                      },
                      days.value.map(day =>
                        h('div', { class: day.classes }, [
                          day.in
                            ? h(
                                QBtn,
                                {
                                  class: day.today ? 'q-date__today' : '',
                                  dense: true,
                                  flat: day.flat,
                                  unelevated: day.unelevated,
                                  color: day.color,
                                  textColor: day.textColor,
                                  label: day.i,
                                  tabindex: tabindex.value,
                                  ...getCache('day#' + day.i, {
                                    onClick: () => {
                                      onDayClick(day.i)
                                    },
                                    onMouseover: () => {
                                      onDayMouseover(day.i)
                                    }
                                  })
                                },
                                day.event
                                  ? () =>
                                      h('div', {
                                        class: 'q-date__event bg-' + day.event
                                      })
                                  : null
                              )
                            : h('div', String(day.i))
                        ])
                      )
                    )
                )
              ]
            )
          ]
        )
      ],

      Months() {
        const currentYear =
          isHydrated.value && viewModel.value.year === today.value.year
        const isDisabled = month =>
          (minNav.value !== null &&
            viewModel.value.year === minNav.value.year &&
            minNav.value.month > month) ||
          (maxNav.value !== null &&
            viewModel.value.year === maxNav.value.year &&
            maxNav.value.month < month)

        const content = innerLocale.value.monthsShort.map((month, i) => {
          const active = viewModel.value.month === i + 1

          return h(
            'div',
            {
              class: 'q-date__months-item flex flex-center'
            },
            [
              h(QBtn, {
                class:
                  currentYear && today.value.month === i + 1
                    ? 'q-date__today'
                    : null,
                flat: !active,
                label: month,
                unelevated: active,
                color: active ? computedColor.value : null,
                textColor: active ? computedTextColor.value : null,
                tabindex: tabindex.value,
                disable: isDisabled(i + 1),
                ...getCache('month#' + i, {
                  onClick: () => {
                    setMonth(i + 1)
                  }
                })
              })
            ]
          )
        })

        if (props.yearsInMonthView) {
          content.unshift(
            h('div', { class: 'row no-wrap full-width' }, [
              getNavigation({
                label: viewModel.value.year,
                type: 'Years',
                key: viewModel.value.year,
                dir: yearDirection.value,
                goTo: goToYear,
                boundaries: navBoundaries.value.year,
                cls: ' col'
              })
            ])
          )
        }

        return h(
          'div',
          {
            key: 'months-view',
            class: 'q-date__view q-date__months flex flex-center'
          },
          content
        )
      },

      Years() {
        const start = startYear.value,
          stop = start + yearsInterval,
          years = []

        const isDisabled = year =>
          (minNav.value !== null && minNav.value.year > year) ||
          (maxNav.value !== null && maxNav.value.year < year)

        for (let i = start; i <= stop; i++) {
          const active = viewModel.value.year === i

          years.push(
            h(
              'div',
              {
                class: 'q-date__years-item flex flex-center'
              },
              [
                h(QBtn, {
                  key: 'yr' + i,
                  class:
                    isHydrated.value && today.value.year === i
                      ? 'q-date__today'
                      : null,
                  flat: !active,
                  label: i,
                  dense: true,
                  unelevated: active,
                  color: active ? computedColor.value : null,
                  textColor: active ? computedTextColor.value : null,
                  tabindex: tabindex.value,
                  disable: isDisabled(i),
                  ...getCache('yr#' + i, {
                    onClick: () => {
                      setYear(i)
                    }
                  })
                })
              ]
            )
          )
        }

        return h(
          'div',
          {
            class: 'q-date__view q-date__years flex flex-center'
          },
          [
            h(
              'div',
              {
                class: 'col-auto'
              },
              [
                h(QBtn, {
                  round: true,
                  dense: true,
                  flat: true,
                  icon: dateArrow.value[0],
                  'aria-label': $q.lang.date.prevRangeYears(yearsInterval),
                  tabindex: tabindex.value,
                  disable: isDisabled(start),
                  ...getCache('y-', {
                    onClick: () => {
                      startYear.value -= yearsInterval
                    }
                  })
                })
              ]
            ),

            h(
              'div',
              {
                class: 'q-date__years-content col self-stretch row items-center'
              },
              years
            ),

            h(
              'div',
              {
                class: 'col-auto'
              },
              [
                h(QBtn, {
                  round: true,
                  dense: true,
                  flat: true,
                  icon: dateArrow.value[1],
                  'aria-label': $q.lang.date.nextRangeYears(yearsInterval),
                  tabindex: tabindex.value,
                  disable: isDisabled(stop),
                  ...getCache('y+', {
                    onClick: () => {
                      startYear.value += yearsInterval
                    }
                  })
                })
              ]
            )
          ]
        )
      }
    }

    function onDayClick(dayIndex) {
      const day = { ...viewModel.value, day: dayIndex }

      if (!props.range) {
        toggleDate(day, viewMonthHash.value)
        return
      }

      if (editRange.value === null) {
        const dayProps = days.value.find(
          item => !item.fill && item.i === dayIndex
        )

        if (!props.noUnset && dayProps.range !== void 0) {
          removeFromModel({
            target: day,
            from: dayProps.range.from,
            to: dayProps.range.to
          })
          return
        }

        if (dayProps.selected) {
          removeFromModel(day)
          return
        }

        const initHash = getDayHash(day)

        editRange.value = {
          init: day,
          initHash,
          final: day,
          finalHash: initHash
        }

        emit('rangeStart', getShortDate(day))
      } else {
        const initHash = editRange.value.initHash,
          finalHash = getDayHash(day),
          payload =
            initHash <= finalHash
              ? { from: editRange.value.init, to: day }
              : { from: day, to: editRange.value.init }

        editRange.value = null
        addToModel(initHash === finalHash ? day : { target: day, ...payload })

        emit('rangeEnd', {
          from: getShortDate(payload.from),
          to: getShortDate(payload.to)
        })
      }
    }

    function onDayMouseover(dayIndex) {
      if (editRange.value !== null) {
        const final = { ...viewModel.value, day: dayIndex }

        Object.assign(editRange.value, {
          final,
          finalHash: getDayHash(final)
        })
      }
    }

    // expose public methods
    Object.assign(proxy, {
      setToday,
      setView,
      offsetCalendar,
      setCalendarTo,
      setEditingRange
    })

    return () => {
      const content = [
        h(
          'div',
          {
            class: 'q-date__content col relative-position'
          },
          [
            h(
              Transition,
              {
                name: 'q-transition--fade'
              },
              renderViews[view.value]
            )
          ]
        )
      ]

      const def = hSlot(slots.default)
      if (def !== void 0) {
        content.push(h('div', { class: 'q-date__actions' }, def))
      }

      if (props.name !== void 0 && !props.disable) {
        injectFormInput(content, 'push')
      }

      return h(
        'div',
        {
          class: classes.value,
          ...attributes.value
        },
        [
          getHeader(),

          h(
            'div',
            {
              ref: blurTargetRef,
              class: 'q-date__main col column',
              tabindex: -1
            },
            content
          )
        ]
      )
    }
  }
})
