import { computed, h } from 'vue'

import QBtn from '../btn/QBtn.js'
import QBtnGroup from '../btn-group/QBtnGroup.js'

import { createComponent } from '../../utils/private.create/create.js'
import {
  useFormInject,
  useFormProps
} from '../../composables/use-form/private.use-form.js'

import { hMergeSlot } from '../../utils/private.render/render.js'
import { getBtnDesignAttr } from '../btn/use-btn.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/button-toggle
 */
/**
 * Suggestions: QTooltip, QBadge
 *
 * @api slot default
 */

/**
 * Any other dynamic slots to be used with 'slot' property of the 'options' prop
 *
 * @api slot ...
 */
export default createComponent({
  name: 'QBtnToggle',

  props: {
    ...useFormProps,

    /**
     * Model of the component; Either use this property (along with a listener for 'update:modelValue' event) OR use v-model directive
     *
     * @api prop model-value
     * @extends model-value
     * @syncable
     * @example # v-model="selected"
     */
    modelValue: {
      required: true
    },

    /**
     * Array of Objects defining each option
     *
     * @api prop options
     * @type {Array}
     * @category model
     * @required
     * @example [{ label: 'One', value: 'one' }, { label: 'Two', value: 'two' }]
     */
    options: {
      type: Array,
      required: true,
      validator: v =>
        v.every(
          opt =>
            ('label' in opt || 'icon' in opt || 'slot' in opt) && 'value' in opt
        )
    },

    // To avoid seeing the active raise shadow through
    // the transparent button, give it a color (even white)
    /**
     * @api prop color
     * @extends color
     */
    color: String,
    /**
     * @api prop text-color
     * @extends text-color
     */
    textColor: String,
    /**
     * @api prop toggle-color
     * @extends color
     * @default 'primary'
     */
    toggleColor: {
      type: String,
      default: 'primary'
    },
    /**
     * @api prop toggle-text-color
     * @extends text-color
     */
    toggleTextColor: String,

    /**
     * Use 'outline' design
     *
     * @api prop outline
     * @type {Boolean}
     * @category style
     */
    outline: Boolean,
    /**
     * Use 'flat' design
     *
     * @api prop flat
     * @type {Boolean}
     * @category style
     */
    flat: Boolean,
    /**
     * Remove shadow
     *
     * @api prop unelevated
     * @type {Boolean}
     * @category style
     */
    unelevated: Boolean,
    /**
     * Applies a more prominent border-radius for a squared shape button
     *
     * @api prop rounded
     * @type {Boolean}
     * @category style
     */
    rounded: Boolean,
    /**
     * Use 'push' design
     *
     * @api prop push
     * @type {Boolean}
     * @category style
     */
    push: Boolean,
    /**
     * Applies a glossy effect
     *
     * @api prop glossy
     * @type {Boolean}
     * @category style
     */
    glossy: Boolean,

    /**
     * Button size name or a CSS unit including unit name
     *
     * @api prop size
     * @type {String}
     * @category style
     * @example 'xs'
     * @example 'sm'
     * @example 'md'
     */
    size: String,
    /**
     * Apply custom padding (vertical [horizontal]); Size in CSS units, including unit name or standard size name (none|xs|sm|md|lg|xl); Also removes the min width and height when set
     *
     * @api prop padding
     * @type {String}
     * @category style
     * @example '16px'
     * @example '10px 5px'
     * @example '2rem'
     */
    padding: String,

    /**
     * Avoid turning label text into caps (which happens by default)
     *
     * @api prop no-caps
     * @type {Boolean}
     * @category content
     */
    noCaps: Boolean,
    /**
     * Avoid label text wrapping
     *
     * @api prop no-wrap
     * @type {Boolean}
     * @category content
     */
    noWrap: Boolean,
    /**
     * @api prop dense
     * @extends dense
     */
    dense: Boolean,
    /**
     * @api prop readonly
     * @extends readonly
     */
    readonly: Boolean,
    /**
     * @api prop disable
     * @extends disable
     */
    disable: Boolean,

    /**
     * Stack icon and label vertically instead of on same line (like it is by default)
     *
     * @api prop stack
     * @type {Boolean}
     * @category content
     */
    stack: Boolean,
    /**
     * When used on flexbox parent, button will stretch to parent's height
     *
     * @api prop stretch
     * @type {Boolean}
     * @category content
     */
    stretch: Boolean,

    /**
     * Spread horizontally to all available space
     *
     * @api prop spread
     * @type {Boolean}
     * @category content
     */
    spread: Boolean,

    /**
     * Clears model on click of the already selected button
     *
     * @api prop clearable
     * @type {Boolean}
     * @category model
     */
    clearable: Boolean,

    /**
     * @api prop ripple
     * @extends ripple
     */
    ripple: {
      type: [Boolean, Object],
      default: true
    }
  },

  emits: ['update:modelValue', 'clear', 'click'],

  setup(props, { slots, emit }) {
    const hasActiveValue = computed(
      () => props.options.find(opt => opt.value === props.modelValue) !== void 0
    )

    const formAttrs = computed(() => ({
      type: 'hidden',
      name: props.name,
      value: props.modelValue
    }))

    const injectFormInput = useFormInject(formAttrs)

    const btnDesignAttr = computed(() => getBtnDesignAttr(props))

    const btnOptionDesign = computed(() => ({
      rounded: props.rounded,
      dense: props.dense,
      ...btnDesignAttr.value
    }))

    const btnOptions = computed(() =>
      props.options.map((item, i) => {
        const { attrs, value, slot, ...opt } = item

        return {
          slot,
          props: {
            key: i,

            'aria-pressed': value === props.modelValue ? 'true' : 'false',
            ...attrs,
            ...opt,
            ...btnOptionDesign.value,

            disable: props.disable || opt.disable === true,

            // Options that come from the button specific options first, then from general props
            color:
              value === props.modelValue
                ? mergeOpt(opt, 'toggleColor')
                : mergeOpt(opt, 'color'),
            textColor:
              value === props.modelValue
                ? mergeOpt(opt, 'toggleTextColor')
                : mergeOpt(opt, 'textColor'),
            noCaps: mergeOpt(opt, 'noCaps') === true,
            noWrap: mergeOpt(opt, 'noWrap') === true,

            size: mergeOpt(opt, 'size'),
            padding: mergeOpt(opt, 'padding'),
            ripple: mergeOpt(opt, 'ripple'),
            stack: mergeOpt(opt, 'stack') === true,
            stretch: mergeOpt(opt, 'stretch') === true,

            onClick(e) {
              set(value, item, e)
            }
          }
        }
      })
    )

    function set(value, opt, e) {
      if (!props.readonly) {
        if (props.modelValue === value) {
          if (props.clearable) {
            emit('update:modelValue', null, null)
            emit('clear')
          }
        } else {
          emit('update:modelValue', value, opt)
        }

        emit('click', e)
      }
    }

    function mergeOpt(opt, key) {
      return opt[key] === void 0 ? props[key] : opt[key]
    }

    function getContent() {
      const child = btnOptions.value.map(opt =>
        h(QBtn, opt.props, opt.slot !== void 0 ? slots[opt.slot] : void 0)
      )

      if (props.name !== void 0 && !props.disable && hasActiveValue.value) {
        injectFormInput(child, 'push')
      }

      return hMergeSlot(slots.default, child)
    }

    return () =>
      h(
        QBtnGroup,
        {
          class: 'q-btn-toggle',
          ...btnDesignAttr.value,
          rounded: props.rounded,
          stretch: props.stretch,
          glossy: props.glossy,
          spread: props.spread
        },
        getContent
      )
  }
})
