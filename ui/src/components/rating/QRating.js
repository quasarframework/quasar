import { h, ref, computed, onBeforeUpdate, getCurrentInstance } from 'vue'

import QIcon from '../icon/QIcon.js'

import useSize, { useSizeProps } from '../../composables/private.use-size/use-size.js'
import { useFormProps, useFormAttrs, useFormInject } from '../../composables/use-form/private.use-form.js'

import { createComponent } from '../../utils/private.create/create.js'
import { stopAndPrevent } from '../../utils/event/event.js'
import { between } from '../../utils/format/format.js'
import { hMergeSlot } from '../../utils/private.render/render.js'

export default createComponent({
  name: 'QRating',

  props: {
    ...useSizeProps,
    ...useFormProps,

    modelValue: {
      type: Number,
      required: true
    },

    max: {
      type: [ String, Number ],
      default: 5
    },

    icon: [ String, Array ],
    iconHalf: [ String, Array ],
    iconSelected: [ String, Array ],

    iconAriaLabel: [ String, Array ],

    color: [ String, Array ],
    colorHalf: [ String, Array ],
    colorSelected: [ String, Array ],

    noReset: Boolean,
    noDimming: Boolean,

    readonly: Boolean,
    disable: Boolean
  },

  emits: [ 'update:modelValue' ],

  setup (props, { slots, emit }) {
    const { proxy: { $q } } = getCurrentInstance()

    const sizeStyle = useSize(props)
    const formAttrs = useFormAttrs(props)
    const injectFormInput = useFormInject(formAttrs)

    const mouseModel = ref(0)

    let iconRefs = {}

    const editable = computed(() =>
      props.readonly !== true && props.disable !== true
    )

    const classes = computed(() =>
      'q-rating row inline items-center'
      + ` q-rating--${ editable.value === true ? '' : 'non-' }editable`
      + (props.noDimming === true ? ' q-rating--no-dimming' : '')
      + (props.disable === true ? ' disabled' : '')
      + (
        props.color !== void 0 && Array.isArray(props.color) === false
          ? ` text-${ props.color }`
          : ''
      )
    )

    const iconData = computed(() => {
      const
        iconLen = Array.isArray(props.icon) === true ? props.icon.length : 0,
        selIconLen = Array.isArray(props.iconSelected) === true ? props.iconSelected.length : 0,
        halfIconLen = Array.isArray(props.iconHalf) === true ? props.iconHalf.length : 0,
        colorLen = Array.isArray(props.color) === true ? props.color.length : 0,
        selColorLen = Array.isArray(props.colorSelected) === true ? props.colorSelected.length : 0,
        halfColorLen = Array.isArray(props.colorHalf) === true ? props.colorHalf.length : 0

      return {
        iconLen,
        icon: iconLen > 0 ? props.icon[ iconLen - 1 ] : props.icon,
        selIconLen,
        selIcon: selIconLen > 0 ? props.iconSelected[ selIconLen - 1 ] : props.iconSelected,
        halfIconLen,
        halfIcon: halfIconLen > 0 ? props.iconHalf[ selIconLen - 1 ] : props.iconHalf,
        colorLen,
        color: colorLen > 0 ? props.color[ colorLen - 1 ] : props.color,
        selColorLen,
        selColor: selColorLen > 0 ? props.colorSelected[ selColorLen - 1 ] : props.colorSelected,
        halfColorLen,
        halfColor: halfColorLen > 0 ? props.colorHalf[ halfColorLen - 1 ] : props.colorHalf
      }
    })

    const iconLabel = computed(() => {
      if (typeof props.iconAriaLabel === 'string') {
        const label = props.iconAriaLabel.length !== 0 ? `${ props.iconAriaLabel } ` : ''
        return i => `${ label }${ i }`
      }

      if (Array.isArray(props.iconAriaLabel) === true) {
        const iMax = props.iconAriaLabel.length

        if (iMax > 0) {
          return i => props.iconAriaLabel[ Math.min(i, iMax) - 1 ]
        }
      }

      return (i, label) => `${ label } ${ i }`
    })

    const stars = computed(() => {
      const
        acc = [],
        icons = iconData.value,
        ceil = Math.ceil(props.modelValue),
        tabindex = editable.value === true ? 0 : null

      const halfIndex = props.iconHalf === void 0 || ceil === props.modelValue
        ? -1
        : ceil

      for (let i = 1; i <= props.max; i++) {
        const
          active = (mouseModel.value === 0 && props.modelValue >= i) || (mouseModel.value > 0 && mouseModel.value >= i),
          half = halfIndex === i && mouseModel.value < i,
          exSelected = mouseModel.value > 0 && (half === true ? ceil : props.modelValue) >= i && mouseModel.value < i,
          color = half === true
            ? (i <= icons.halfColorLen ? props.colorHalf[ i - 1 ] : icons.halfColor)
            : (
                icons.selColor !== void 0 && active === true
                  ? (i <= icons.selColorLen ? props.colorSelected[ i - 1 ] : icons.selColor)
                  : (i <= icons.colorLen ? props.color[ i - 1 ] : icons.color)
              ),
          name = (
            half === true
              ? (i <= icons.halfIconLen ? props.iconHalf[ i - 1 ] : icons.halfIcon)
              : (
                  icons.selIcon !== void 0 && (active === true || exSelected === true)
                    ? (i <= icons.selIconLen ? props.iconSelected[ i - 1 ] : icons.selIcon)
                    : (i <= icons.iconLen ? props.icon[ i - 1 ] : icons.icon)
                )
          ) || $q.iconSet.rating.icon

        acc.push({
          name: (
            half === true
              ? (i <= icons.halfIconLen ? props.iconHalf[ i - 1 ] : icons.halfIcon)
              : (
                  icons.selIcon !== void 0 && (active === true || exSelected === true)
                    ? (i <= icons.selIconLen ? props.iconSelected[ i - 1 ] : icons.selIcon)
                    : (i <= icons.iconLen ? props.icon[ i - 1 ] : icons.icon)
                )
          ) || $q.iconSet.rating.icon,

          attrs: {
            tabindex,
            role: 'radio',
            'aria-checked': props.modelValue === i ? 'true' : 'false',
            'aria-label': iconLabel.value(i, name)
          },

          iconClass: 'q-rating__icon'
            + (active === true || half === true ? ' q-rating__icon--active' : '')
            + (exSelected === true ? ' q-rating__icon--exselected' : '')
            + (mouseModel.value === i ? ' q-rating__icon--hovered' : '')
            + (color !== void 0 ? ` text-${ color }` : '')
        })
      }

      return acc
    })

    const attributes = computed(() => {
      const attrs = { role: 'radiogroup' }

      if (props.disable === true) {
        attrs[ 'aria-disabled' ] = 'true'
      }
      if (props.readonly === true) {
        attrs[ 'aria-readonly' ] = 'true'
      }

      return attrs
    })

    function set (value) {
      if (editable.value === true) {
        const
          model = between(parseInt(value, 10), 1, parseInt(props.max, 10)),
          newVal = props.noReset !== true && props.modelValue === model ? 0 : model

        newVal !== props.modelValue && emit('update:modelValue', newVal)
        mouseModel.value = 0
      }
    }

    function setHoverValue (value) {
      if (editable.value === true) {
        mouseModel.value = value
      }
    }

    function onKeyup (e, i) {
      switch (e.keyCode) {
        case 13:
        case 32:
          set(i)
          return stopAndPrevent(e)
        case 37: // LEFT ARROW
        case 40: // DOWN ARROW
          if (iconRefs[ `rt${ i - 1 }` ]) {
            iconRefs[ `rt${ i - 1 }` ].focus()
          }
          return stopAndPrevent(e)
        case 39: // RIGHT ARROW
        case 38: // UP ARROW
          if (iconRefs[ `rt${ i + 1 }` ]) {
            iconRefs[ `rt${ i + 1 }` ].focus()
          }
          return stopAndPrevent(e)
      }
    }

    function resetMouseModel () {
      mouseModel.value = 0
    }

    onBeforeUpdate(() => {
      iconRefs = {}
    })

    return () => {
      const child = []

      stars.value.forEach(({ iconClass, name, attrs }, index) => {
        const i = index + 1

        child.push(
          h('div', {
            key: i,
            ref: el => { iconRefs[ `rt${ i }` ] = el },
            class: 'q-rating__icon-container flex flex-center',
            ...attrs,
            onClick () { set(i) },
            onMouseover () { setHoverValue(i) },
            onMouseout: resetMouseModel,
            onFocus () { setHoverValue(i) },
            onBlur: resetMouseModel,
            onKeyup (e) { onKeyup(e, i) }
          }, hMergeSlot(
            slots[ `tip-${ i }` ],
            [ h(QIcon, { class: iconClass, name }) ]
          ))
        )
      })

      if (props.name !== void 0 && props.disable !== true) {
        injectFormInput(child, 'push')
      }

      return h('div', {
        class: classes.value,
        style: sizeStyle.value,
        ...attributes.value
      }, child)
    }
  }
})
