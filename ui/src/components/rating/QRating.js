import { computed, getCurrentInstance, h, onBeforeUpdate, ref } from 'vue'

import QIcon from '../icon/QIcon.js'

import useSize, {
  useSizeProps
} from '../../composables/private.use-size/use-size.js'
import {
  useFormAttrs,
  useFormInject,
  useFormProps
} from '../../composables/use-form/private.use-form.js'

import { createComponent } from '../../utils/private.create/create.js'
import { stopAndPrevent } from '../../utils/event/event.js'
import { between } from '../../utils/format/format.js'
import { hMergeSlot } from '../../utils/private.render/render.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/rating
 */
/**
 * Slot to define the tooltip of icon at '[name]' where name is a 1-based index; Suggestion: QTooltip
 *
 * @api slot tip-[name]
 */
export default createComponent({
  name: 'QRating',

  props: {
    ...useSizeProps,
    ...useFormProps,

    /**
     * @api prop model-value
     * @extends model-value
     * @syncable
     * @example # v-model="rating"
     * @example # :model-value="rating"
     * @example # :model-value="2"
     */
    modelValue: {
      type: Number,
      required: true
    },

    /**
     * Number of icons to display
     *
     * @api prop max
     * @type {Number|String}
     * @default 5
     * @category general
     */
    max: {
      type: [String, Number],
      default: 5
    },

    /**
     * Icon name following Quasar convention; make sure you have the icon library installed unless you are using 'img:' prefix; If an array is provided each rating value will use the corresponding icon in the array (0 based)
     *
     * @api prop icon
     * @type {String|Array}
     * @category content
     * @example 'map'
     * @example 'ion-add'
     * @example 'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'
     */
    icon: [String, Array],
    /**
     * Icon name following Quasar convention to be used when selected (optional); make sure you have the icon library installed unless you are using 'img:' prefix; If an array is provided each rating value will use the corresponding icon in the array (0 based)
     *
     * @api prop icon-half
     * @type {String|Array}
     * @category content
     * @example 'map'
     * @example 'ion-add'
     * @example 'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'
     */
    iconHalf: [String, Array],
    /**
     * Icon name following Quasar convention to be used when selected (optional); make sure you have the icon library installed unless you are using 'img:' prefix; If an array is provided each rating value will use the corresponding icon in the array (0 based)
     *
     * @api prop icon-selected
     * @type {String|Array}
     * @category content
     * @example 'map'
     * @example 'ion-add'
     * @example 'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'
     */
    iconSelected: [String, Array],

    /**
     * Label to be set on aria-label for Icon; If an array is provided each rating value will use the corresponding aria-label in the array (0 based); If string value is provided the rating value will be appended; If not provided the name of the icon will be used
     *
     * @api prop icon-aria-label
     * @type {String|Array}
     * @category accessibility
     * @added-in v1.20.3
     * @example 'Rating'
     * @example ['Bad', 'Normal', 'Good']
     */
    iconAriaLabel: [String, Array],

    /**
     * Color name for component from the Quasar Color Palette; v1.5.0+: If an array is provided each rating value will use the corresponding color in the array (0 based)
     *
     * @api prop color
     * @extends color
     * @example ['accent', 'grey-7']
     */
    color: [String, Array],
    /**
     * Color name from the Quasar Palette for half selected icons
     *
     * @api prop color-half
     * @extends color
     */
    colorHalf: [String, Array],
    /**
     * Color name from the Quasar Palette for selected icons
     *
     * @api prop color-selected
     * @extends color
     */
    colorSelected: [String, Array],

    /**
     * When used, disables default behavior of clicking/tapping on icon which represents current model value to reset model to 0
     *
     * @api prop no-reset
     * @type {Boolean}
     * @category model
     */
    noReset: Boolean,
    /**
     * Does not lower opacity for unselected icons
     *
     * @api prop no-dimming
     * @type {Boolean}
     * @category style
     */
    noDimming: Boolean,

    /**
     * @api prop readonly
     * @extends readonly
     */
    readonly: Boolean,
    /**
     * @api prop disable
     * @extends disable
     */
    disable: Boolean
  },

  emits: ['update:modelValue'],

  setup(props, { slots, emit }) {
    const {
      proxy: { $q }
    } = getCurrentInstance()

    const sizeStyle = useSize(props)
    const formAttrs = useFormAttrs(props)
    const injectFormInput = useFormInject(formAttrs)

    const mouseModel = ref(0)

    let iconRefs = {}

    const editable = computed(() => !props.readonly && !props.disable)

    const classes = computed(
      () =>
        'q-rating row inline items-center' +
        ` q-rating--${editable.value ? '' : 'non-'}editable` +
        (props.noDimming ? ' q-rating--no-dimming' : '') +
        (props.disable ? ' disabled' : '') +
        (props.color !== void 0 && !Array.isArray(props.color)
          ? ` text-${props.color}`
          : '')
    )

    const iconData = computed(() => {
      const iconLen = Array.isArray(props.icon) ? props.icon.length : 0,
        selIconLen = Array.isArray(props.iconSelected)
          ? props.iconSelected.length
          : 0,
        halfIconLen = Array.isArray(props.iconHalf) ? props.iconHalf.length : 0,
        colorLen = Array.isArray(props.color) ? props.color.length : 0,
        selColorLen = Array.isArray(props.colorSelected)
          ? props.colorSelected.length
          : 0,
        halfColorLen = Array.isArray(props.colorHalf)
          ? props.colorHalf.length
          : 0

      return {
        iconLen,
        icon: iconLen > 0 ? props.icon[iconLen - 1] : props.icon,
        selIconLen,
        selIcon:
          selIconLen > 0
            ? props.iconSelected[selIconLen - 1]
            : props.iconSelected,
        halfIconLen,
        halfIcon:
          halfIconLen > 0 ? props.iconHalf[selIconLen - 1] : props.iconHalf,
        colorLen,
        color: colorLen > 0 ? props.color[colorLen - 1] : props.color,
        selColorLen,
        selColor:
          selColorLen > 0
            ? props.colorSelected[selColorLen - 1]
            : props.colorSelected,
        halfColorLen,
        halfColor:
          halfColorLen > 0 ? props.colorHalf[halfColorLen - 1] : props.colorHalf
      }
    })

    const iconLabel = computed(() => {
      if (typeof props.iconAriaLabel === 'string') {
        const label =
          props.iconAriaLabel.length !== 0 ? `${props.iconAriaLabel} ` : ''
        return i => `${label}${i}`
      }

      if (Array.isArray(props.iconAriaLabel)) {
        const iMax = props.iconAriaLabel.length

        if (iMax > 0) {
          return i => props.iconAriaLabel[Math.min(i, iMax) - 1]
        }
      }

      return (i, label) => `${label} ${i}`
    })

    const stars = computed(() => {
      const acc = [],
        icons = iconData.value,
        ceil = Math.ceil(props.modelValue),
        tabindex = editable.value ? 0 : null

      const halfIndex =
        props.iconHalf === void 0 || ceil === props.modelValue ? -1 : ceil

      for (let i = 1; i <= props.max; i++) {
        const active =
            (mouseModel.value === 0 && props.modelValue >= i) ||
            (mouseModel.value > 0 && mouseModel.value >= i),
          half = halfIndex === i && mouseModel.value < i,
          exSelected =
            mouseModel.value > 0 &&
            (half ? ceil : props.modelValue) >= i &&
            mouseModel.value < i,
          color = half
            ? i <= icons.halfColorLen
              ? props.colorHalf[i - 1]
              : icons.halfColor
            : icons.selColor !== void 0 && active
              ? i <= icons.selColorLen
                ? props.colorSelected[i - 1]
                : icons.selColor
              : i <= icons.colorLen
                ? props.color[i - 1]
                : icons.color,
          name =
            (half
              ? i <= icons.halfIconLen
                ? props.iconHalf[i - 1]
                : icons.halfIcon
              : icons.selIcon !== void 0 && (active || exSelected)
                ? i <= icons.selIconLen
                  ? props.iconSelected[i - 1]
                  : icons.selIcon
                : i <= icons.iconLen
                  ? props.icon[i - 1]
                  : icons.icon) || $q.iconSet.rating.icon

        acc.push({
          name:
            (half
              ? i <= icons.halfIconLen
                ? props.iconHalf[i - 1]
                : icons.halfIcon
              : icons.selIcon !== void 0 && (active || exSelected)
                ? i <= icons.selIconLen
                  ? props.iconSelected[i - 1]
                  : icons.selIcon
                : i <= icons.iconLen
                  ? props.icon[i - 1]
                  : icons.icon) || $q.iconSet.rating.icon,

          attrs: {
            tabindex,
            role: 'radio',
            'aria-checked': props.modelValue === i ? 'true' : 'false',
            'aria-label': iconLabel.value(i, name)
          },

          iconClass:
            'q-rating__icon' +
            (active || half ? ' q-rating__icon--active' : '') +
            (exSelected ? ' q-rating__icon--exselected' : '') +
            (mouseModel.value === i ? ' q-rating__icon--hovered' : '') +
            (color !== void 0 ? ` text-${color}` : '')
        })
      }

      return acc
    })

    const attributes = computed(() => {
      const attrs = { role: 'radiogroup' }

      if (props.disable) {
        attrs['aria-disabled'] = 'true'
      }
      if (props.readonly) {
        attrs['aria-readonly'] = 'true'
      }

      return attrs
    })

    function set(value) {
      if (editable.value) {
        const model = between(
            Number.parseInt(value, 10),
            1,
            Number.parseInt(props.max, 10)
          ),
          newVal = !props.noReset && props.modelValue === model ? 0 : model

        if (newVal !== props.modelValue) emit('update:modelValue', newVal)
        mouseModel.value = 0
      }
    }

    function setHoverValue(value) {
      if (editable.value) {
        mouseModel.value = value
      }
    }

    function onKeyup(e, i) {
      switch (e.keyCode) {
        case 13:
        case 32: {
          set(i)
          return stopAndPrevent(e)
        }
        case 37: // LEFT ARROW
        case 40: {
          // DOWN ARROW
          if (iconRefs[`rt${i - 1}`]) {
            iconRefs[`rt${i - 1}`].focus()
          }
          return stopAndPrevent(e)
        }
        case 39: // RIGHT ARROW
        case 38: {
          // UP ARROW
          if (iconRefs[`rt${i + 1}`]) {
            iconRefs[`rt${i + 1}`].focus()
          }
          return stopAndPrevent(e)
        }
      }
    }

    function resetMouseModel() {
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
          h(
            'div',
            {
              key: i,
              ref: el => {
                iconRefs[`rt${i}`] = el
              },
              class: 'q-rating__icon-container flex flex-center',
              ...attrs,
              onClick() {
                set(i)
              },
              onMouseover() {
                setHoverValue(i)
              },
              onMouseout: resetMouseModel,
              onFocus() {
                setHoverValue(i)
              },
              onBlur: resetMouseModel,
              onKeyup(e) {
                onKeyup(e, i)
              }
            },
            hMergeSlot(slots[`tip-${i}`], [
              h(QIcon, { class: iconClass, name })
            ])
          )
        )
      })

      if (props.name !== void 0 && !props.disable) {
        injectFormInput(child, 'push')
      }

      return h(
        'div',
        {
          class: classes.value,
          style: sizeStyle.value,
          ...attributes.value
        },
        child
      )
    }
  }
})
