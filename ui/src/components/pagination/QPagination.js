import { h, ref, watch, computed, getCurrentInstance } from 'vue'

import QBtn from '../btn/QBtn.js'
import QInput from '../input/QInput.js'

import useDark, { useDarkProps } from '../../composables/private/use-dark.js'
import { btnDesignOptions, btnPadding, getBtnDesign } from '../btn/use-btn.js'

import { createComponent } from '../../utils/private/create.js'
import { between } from '../../utils/format.js'
import { isKeyCode } from '../../utils/private/key-composition.js'

function getBool (val, otherwise) {
  return [ true, false ].includes(val)
    ? val
    : otherwise
}

export default createComponent({
  name: 'QPagination',

  props: {
    ...useDarkProps,

    modelValue: {
      type: Number,
      required: true
    },
    min: {
      type: [ Number, String ],
      default: 1
    },
    max: {
      type: [ Number, String ],
      required: true
    },
    maxPages: {
      type: [ Number, String ],
      default: 0,
      validator: v => (
        (typeof v === 'string' ? parseInt(v, 10) : v) >= 0
      )
    },

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

    color: {
      type: String,
      default: 'primary'
    },
    textColor: String,

    activeDesign: {
      type: String,
      default: '',
      values: v => v === '' || btnDesignOptions.includes(v)
    },
    activeColor: String,
    activeTextColor: String,

    gutter: String,
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

    const minProp = computed(() => parseInt(props.min, 10))
    const maxProp = computed(() => parseInt(props.max, 10))
    const maxPagesProp = computed(() => parseInt(props.maxPages, 10))

    const inputPlaceholder = computed(() => model.value + ' / ' + maxProp.value)
    const boundaryLinksProp = computed(() => getBool(props.boundaryLinks, props.input))
    const boundaryNumbersProp = computed(() => getBool(props.boundaryNumbers, !props.input))
    const directionLinksProp = computed(() => getBool(props.directionLinks, props.input))
    const ellipsesProp = computed(() => getBool(props.ellipses, !props.input))

    const newPage = ref(null)
    const model = computed({
      get: () => props.modelValue,
      set: val => {
        val = parseInt(val, 10)
        if (props.disable || isNaN(val)) {
          return
        }
        const value = between(val, minProp.value, maxProp.value)
        if (props.modelValue !== value) {
          emit('update:modelValue', value)
        }
      }
    })

    watch(() => `${ minProp.value }|${ maxProp.value }`, () => {
      model.value = props.modelValue
    })

    const classes = computed(() =>
      'q-pagination row no-wrap items-center'
      + (props.disable === true ? ' disabled' : '')
    )

    const gutterProp = computed(() => (
      props.gutter in btnPadding
        ? `${ btnPadding[ props.gutter ] }px`
        : props.gutter || null
    ))
    const gutterStyle = computed(() => (
      gutterProp.value !== null
        ? `--q-pagination-gutter-parent:-${ gutterProp.value };--q-pagination-gutter-child:${ gutterProp.value }`
        : null
    ))

    const icons = computed(() => {
      const ico = [
        props.iconFirst || $q.iconSet.pagination.first,
        props.iconPrev || $q.iconSet.pagination.prev,
        props.iconNext || $q.iconSet.pagination.next,
        props.iconLast || $q.iconSet.pagination.last
      ]
      return $q.lang.rtl === true ? ico.reverse() : ico
    })

    const attrs = computed(() => ({
      'aria-disabled': props.disable === true ? 'true' : 'false',
      role: 'navigation'
    }))

    const btnDesignProp = computed(() => getBtnDesign(props, 'flat'))
    const btnProps = computed(() => ({
      [ btnDesignProp.value ]: true,

      round: props.round,
      rounded: props.rounded,

      padding: props.padding,

      color: props.color,
      textColor: props.textColor,

      size: props.size,
      ripple: props.ripple !== null
        ? props.ripple
        : true
    }))

    const btnActiveDesignProp = computed(() => {
      // we also reset non-active design
      const acc = { [ btnDesignProp.value ]: false }
      if (props.activeDesign !== '') {
        acc[ props.activeDesign ] = true
      }
      return acc
    })
    const activeBtnProps = computed(() => ({
      ...btnActiveDesignProp.value,
      color: props.activeColor || props.color,
      textColor: props.activeTextColor || props.textColor
    }))

    const btnConfig = computed(() => {
      let maxPages = Math.max(
        maxPagesProp.value,
        1 + (ellipsesProp.value ? 2 : 0) + (boundaryNumbersProp.value ? 2 : 0)
      )

      const acc = {
        pgFrom: minProp.value,
        pgTo: maxProp.value,
        ellipsesStart: false,
        ellipsesEnd: false,
        boundaryStart: false,
        boundaryEnd: false,
        marginalStyle: {
          minWidth: `${ Math.max(2, String(maxProp.value).length) }em`
        }
      }

      if (maxPagesProp.value && maxPages < (maxProp.value - minProp.value + 1)) {
        maxPages = 1 + Math.floor(maxPages / 2) * 2
        acc.pgFrom = Math.max(minProp.value, Math.min(maxProp.value - maxPages + 1, props.modelValue - Math.floor(maxPages / 2)))
        acc.pgTo = Math.min(maxProp.value, acc.pgFrom + maxPages - 1)

        if (boundaryNumbersProp.value) {
          acc.boundaryStart = true
          acc.pgFrom++
        }

        if (ellipsesProp.value && acc.pgFrom > (minProp.value + (boundaryNumbersProp.value ? 1 : 0))) {
          acc.ellipsesStart = true
          acc.pgFrom++
        }

        if (boundaryNumbersProp.value) {
          acc.boundaryEnd = true
          acc.pgTo--
        }

        if (ellipsesProp.value && acc.pgTo < (maxProp.value - (boundaryNumbersProp.value ? 1 : 0))) {
          acc.ellipsesEnd = true
          acc.pgTo--
        }
      }

      return acc
    })

    function set (value) {
      model.value = value
    }

    function setByOffset (offset) {
      model.value = model.value + offset
    }

    const inputEvents = computed(() => {
      function updateModel () {
        model.value = newPage.value
        newPage.value = null
      }

      return {
        'onUpdate:modelValue': val => { newPage.value = val },
        onKeyup: e => { isKeyCode(e, 13) === true && updateModel() },
        onBlur: updateModel
      }
    })

    function getBtn (cfg, page, active) {
      const data = {
        'aria-label': page,
        'aria-current': 'false',
        ...btnProps.value,
        ...cfg
      }

      if (active === true) {
        Object.assign(data, {
          'aria-current': 'true',
          ...activeBtnProps.value
        })
      }

      if (page !== void 0) {
        if (props.toFn !== void 0) {
          data.to = props.toFn(page)
        }
        else {
          data.onClick = () => { set(page) }
        }
      }

      return h(QBtn, data)
    }

    // expose public methods
    Object.assign(proxy, { set, setByOffset })

    return () => {
      const contentStart = []
      const contentEnd = []
      let contentMiddle

      if (boundaryLinksProp.value === true) {
        contentStart.push(
          getBtn({
            key: 'bls',
            disable: props.disable || props.modelValue <= minProp.value,
            icon: icons.value[ 0 ]
          }, minProp.value)
        )

        contentEnd.unshift(
          getBtn({
            key: 'ble',
            disable: props.disable || props.modelValue >= maxProp.value,
            icon: icons.value[ 3 ]
          }, maxProp.value)
        )
      }

      if (directionLinksProp.value === true) {
        contentStart.push(
          getBtn({
            key: 'bdp',
            disable: props.disable || props.modelValue <= minProp.value,
            icon: icons.value[ 1 ]
          }, props.modelValue - 1)
        )

        contentEnd.unshift(
          getBtn({
            key: 'bdn',
            disable: props.disable || props.modelValue >= maxProp.value,
            icon: icons.value[ 2 ]
          }, props.modelValue + 1)
        )
      }

      if (props.input !== true) { // has buttons instead of inputbox
        contentMiddle = []
        const { pgFrom, pgTo, marginalStyle: style } = btnConfig.value

        if (btnConfig.value.boundaryStart === true) {
          const active = minProp.value === props.modelValue
          contentStart.push(
            getBtn({
              key: 'bns',
              style,
              disable: props.disable,
              label: minProp.value
            }, minProp.value, active)
          )
        }

        if (btnConfig.value.boundaryEnd === true) {
          const active = maxProp.value === props.modelValue
          contentEnd.unshift(
            getBtn({
              key: 'bne',
              style,
              disable: props.disable,
              label: maxProp.value
            }, maxProp.value, active)
          )
        }

        if (btnConfig.value.ellipsesStart === true) {
          contentStart.push(
            getBtn({
              key: 'bes',
              style,
              disable: props.disable,
              label: '…',
              ripple: false
            }, pgFrom - 1)
          )
        }

        if (btnConfig.value.ellipsesEnd === true) {
          contentEnd.unshift(
            getBtn({
              key: 'bee',
              style,
              disable: props.disable,
              label: '…',
              ripple: false
            }, pgTo + 1)
          )
        }

        for (let i = pgFrom; i <= pgTo; i++) {
          contentMiddle.push(
            getBtn({
              key: `bpg${ i }`,
              style,
              disable: props.disable,
              label: i
            }, i, i === props.modelValue)
          )
        }
      }

      return h('div', {
        class: classes.value,
        ...attrs.value
      }, [
        h('div', {
          class: 'q-pagination__content row no-wrap items-center',
          style: gutterStyle.value
        }, [
          ...contentStart,

          props.input === true
            ? h(QInput, {
              class: 'inline',
              style: { width: `${ inputPlaceholder.value.length / 1.5 }em` },
              type: 'number',
              dense: true,
              value: newPage.value,
              disable: props.disable,
              dark: isDark.value,
              borderless: true,
              inputClass: props.inputClass,
              inputStyle: props.inputStyle,
              placeholder: inputPlaceholder.value,
              min: minProp.value,
              max: maxProp.value,
              ...inputEvents.value
            })
            : h('div', {
              class: 'q-pagination__middle row justify-center'
            }, contentMiddle),

          ...contentEnd
        ])
      ])
    }
  }
})
