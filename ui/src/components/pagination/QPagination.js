import { h, ref, watch, computed, getCurrentInstance } from 'vue'

import QBtn from '../btn/QBtn.js'
import QInput from '../input/QInput.js'

import useDark, { useDarkProps } from '../../composables/private/use-dark.js'

import { createComponent } from '../../utils/private/create.js'
import { between } from '../../utils/format.js'
import { isKeyCode } from '../../utils/private/key-composition.js'

export default createComponent({
  name: 'QPagination',

  props: {
    ...useDarkProps,

    modelValue: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      required: true
    },

    color: {
      type: String,
      default: 'primary'
    },
    textColor: String,

    activeColor: String,
    activeTextColor: String,

    inputStyle: [ Array, String, Object ],
    inputClass: [ Array, String, Object ],

    size: String,

    disable: Boolean,

    input: Boolean,

    iconPrev: String,
    iconNext: String,
    iconFirst: String,
    iconLast: String,

    toFn: Function,

    boundaryLinks: {
      type: Boolean,
      default: null
    },
    boundaryNumbers: {
      type: Boolean,
      default: null
    },
    directionLinks: {
      type: Boolean,
      default: null
    },
    ellipses: {
      type: Boolean,
      default: null
    },
    maxPages: {
      type: Number,
      default: 0,
      validator: v => v >= 0
    },

    ripple: {
      type: [ Boolean, Object ],
      default: null
    },

    round: Boolean,
    rounded: Boolean,

    flat: Boolean,
    outline: Boolean,
    unelevated: Boolean,
    push: Boolean,
    glossy: Boolean,

    dense: Boolean,
    padding: {
      type: String,
      default: '3px 2px'
    }
  },

  emits: [ 'update:modelValue' ],

  setup (props, { emit }) {
    const { proxy } = getCurrentInstance()
    const { $q } = proxy

    const isDark = useDark(props, $q)

    const newPage = ref(null)
    const model = computed({
      get: () => props.modelValue,
      set: val => {
        val = parseInt(val, 10)
        if (props.disable || isNaN(val)) {
          return
        }
        const value = between(val, props.min, props.max)
        if (props.modelValue !== value) {
          emit('update:modelValue', value)
        }
      }
    })

    watch(() => props.min + props.max, () => {
      model.value = props.modelValue
    })

    function getBool (val, otherwise) {
      return [ true, false ].includes(val)
        ? val
        : otherwise
    }

    const classes = computed(() =>
      'q-pagination row no-wrap items-center'
      + (props.disable === true ? ' disabled' : '')
    )
    const inputPlaceholder = computed(() => model.value + ' / ' + props.max)
    const __boundaryLinks = computed(() => getBool(props.boundaryLinks, props.input))
    const __boundaryNumbers = computed(() => getBool(props.boundaryNumbers, !props.input))
    const __directionLinks = computed(() => getBool(props.directionLinks, props.input))
    const __ellipses = computed(() => getBool(props.ellipses, !props.input))
    const icons = computed(() => {
      const ico = [
        props.iconFirst || $q.iconSet.pagination.first,
        props.iconPrev || $q.iconSet.pagination.prev,
        props.iconNext || $q.iconSet.pagination.next,
        props.iconLast || $q.iconSet.pagination.last
      ]
      return $q.lang.rtl === true ? ico.reverse() : ico
    })

    const attrs = computed(() => (
      props.disable === true
        ? { 'aria-disabled': 'true' }
        : {}
    ))

    const btnProps = computed(() => ({
      round: props.round,
      rounded: props.rounded,

      outline: props.outline,
      unelevated: props.unelevated,
      push: props.push,
      glossy: props.glossy,

      dense: props.dense,
      padding: props.padding,

      color: props.color,
      flat: true,
      size: props.size,
      ripple: props.ripple !== null
        ? props.ripple
        : true
    }))

    const activeBtnProps = computed(() => ({
      flat: props.flat,
      color: props.activeColor || props.color,
      textColor: props.activeTextColor || props.textColor
    }))

    function set (value) {
      model.value = value
    }

    function setByOffset (offset) {
      model.value = model.value + offset
    }

    function updateModel () {
      model.value = newPage.value
      newPage.value = null
    }

    function getBtn (cfg, page) {
      const data = { ...btnProps.value, ...cfg }

      if (page !== void 0) {
        if (props.toFn !== void 0) {
          data.to = props.toFn(page)
        }
        else {
          data.onClick = () => set(page)
        }
      }

      return h(QBtn, data)
    }

    // expose public methods
    Object.assign(proxy, { set, setByOffset })

    return () => {
      const
        contentStart = [],
        contentEnd = [],
        contentMiddle = []

      if (__boundaryLinks.value) {
        contentStart.push(getBtn({
          key: 'bls',
          disable: props.disable || props.modelValue <= props.min,
          icon: icons.value[ 0 ]
        }, props.min))
        contentEnd.unshift(getBtn({
          key: 'ble',
          disable: props.disable || props.modelValue >= props.max,
          icon: icons.value[ 3 ]
        }, props.max))
      }

      if (__directionLinks.value) {
        contentStart.push(getBtn({
          key: 'bdp',
          disable: props.disable || props.modelValue <= props.min,
          icon: icons.value[ 1 ]
        }, props.modelValue - 1))
        contentEnd.unshift(getBtn({
          key: 'bdn',
          disable: props.disable || props.modelValue >= props.max,
          icon: icons.value[ 2 ]
        }, props.modelValue + 1))
      }

      if (props.input === true) {
        contentMiddle.push(h(QInput, {
          class: 'inline',
          style: {
            width: `${ inputPlaceholder.value.length / 1.5 }em`
          },
          type: 'number',
          dense: true,
          value: newPage.value,
          disable: props.disable,
          dark: isDark.value,
          borderless: true,
          inputClass: props.inputClass,
          inputStyle: props.inputStyle,
          placeholder: inputPlaceholder.value,
          min: props.min,
          max: props.max,
          'onUpdate:modelValue' (value) { newPage.value = value },
          onKeyup (e) { isKeyCode(e, 13) === true && updateModel() },
          onBlur: updateModel
        }))
      }
      else { // is type select
        let
          maxPages = Math.max(
            props.maxPages,
            1 + (__ellipses.value ? 2 : 0) + (__boundaryNumbers.value ? 2 : 0)
          ),
          pgFrom = props.min,
          pgTo = props.max,
          ellipsesStart = false,
          ellipsesEnd = false,
          boundaryStart = false,
          boundaryEnd = false

        if (props.maxPages && maxPages < (props.max - props.min + 1)) {
          maxPages = 1 + Math.floor(maxPages / 2) * 2
          pgFrom = Math.max(props.min, Math.min(props.max - maxPages + 1, props.modelValue - Math.floor(maxPages / 2)))
          pgTo = Math.min(props.max, pgFrom + maxPages - 1)
          if (__boundaryNumbers.value) {
            boundaryStart = true
            pgFrom += 1
          }
          if (__ellipses.value && pgFrom > (props.min + (__boundaryNumbers.value ? 1 : 0))) {
            ellipsesStart = true
            pgFrom += 1
          }
          if (__boundaryNumbers.value) {
            boundaryEnd = true
            pgTo -= 1
          }
          if (__ellipses.value && pgTo < (props.max - (__boundaryNumbers.value ? 1 : 0))) {
            ellipsesEnd = true
            pgTo -= 1
          }
        }
        const style = {
          minWidth: `${ Math.max(2, String(props.max).length) }em`
        }
        if (boundaryStart) {
          const active = props.min === props.modelValue
          contentStart.push(getBtn({
            key: 'bns',
            style,
            disable: props.disable,
            flat: !active,
            textColor: active ? props.textColor : void 0,
            label: props.min
          }, props.min))
        }
        if (boundaryEnd) {
          const active = props.max === props.modelValue
          contentEnd.unshift(getBtn({
            key: 'bne',
            style,
            disable: props.disable,
            flat: !active,
            textColor: active ? props.textColor : void 0,
            label: props.max
          }, props.max))
        }
        if (ellipsesStart) {
          contentStart.push(getBtn({
            key: 'bes',
            style,
            disable: props.disable,
            label: '…',
            ripple: false
          }, pgFrom - 1))
        }
        if (ellipsesEnd) {
          contentEnd.unshift(getBtn({
            key: 'bee',
            style,
            disable: props.disable,
            label: '…',
            ripple: false
          }, pgTo + 1))
        }
        for (let i = pgFrom; i <= pgTo; i++) {
          const btn = {
            key: `bpg${ i }`,
            style,
            disable: props.disable,
            label: i
          }
          if (i === props.modelValue) {
            Object.assign(btn, activeBtnProps.value)
          }
          contentMiddle.push(getBtn(btn, i))
        }
      }

      return h('div', {
        class: classes.value,
        ...attrs.value
      }, [
        contentStart,

        h('div', {
          class: 'row justify-center'
        }, [
          contentMiddle
        ]),

        contentEnd
      ])
    }
  }
})
