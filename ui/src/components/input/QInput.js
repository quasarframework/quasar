import {
  computed,
  getCurrentInstance,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from 'vue'

import useField, {
  fieldValueIsFilled,
  useFieldEmits,
  useFieldProps,
  useFieldState
} from '../../composables/private.use-field/use-field.js'
import useMask, { useMaskProps } from './use-mask.js'
import {
  useFormInputNameAttr,
  useFormProps
} from '../../composables/use-form/private.use-form.js'
import useFileFormDomProps from '../../composables/private.use-file/use-file-dom-props.js'
import useKeyComposition from '../../composables/private.use-key-composition/use-key-composition.js'

import { createComponent } from '../../utils/private.create/create.js'
import { stop } from '../../utils/event/event.js'
import { addFocusFn } from '../../utils/private.focus/focus-manager.js'
import { injectProp } from '../../utils/private.inject-obj-prop/inject-obj-prop.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/input
 */
/**
 * Field main content
 *
 * @api slot default
 */

/**
 * Prepend inner field; Suggestions: QIcon, QBtn
 *
 * @api slot prepend
 */

/**
 * Append to inner field; Suggestions: QIcon, QBtn
 *
 * @api slot append
 */

/**
 * Prepend outer field; Suggestions: QIcon, QBtn
 *
 * @api slot before
 */

/**
 * Append outer field; Suggestions: QIcon, QBtn
 *
 * @api slot after
 */

/**
 * Slot for label; Used only if 'label-slot' prop is set or the 'label' prop is set; When it is used the text in the 'label' prop is ignored
 *
 * @api slot label
 */

/**
 * Slot for errors; Enabled only if 'bottom-slots' prop is used; Suggestion: <div>
 *
 * @api slot error
 */

/**
 * Slot for hint text; Enabled only if 'bottom-slots' prop is used; Suggestion: <div>
 *
 * @api slot hint
 */

/**
 * Slot for counter text; Enabled only if 'bottom-slots' prop is used; Suggestion: <div>
 *
 * @api slot counter
 */

/**
 * Override default spinner when component is in loading mode; Use in conjunction with 'loading' prop
 *
 * @api slot loading
 */
export default createComponent({
  name: 'QInput',

  inheritAttrs: false,

  props: {
    ...useFieldProps,
    ...useMaskProps,
    ...useFormProps,

    // override of useFieldProps > modelValue
    /**
     * Model of the component; Either use this property (along with a listener for 'update:modelValue' event) OR use v-model directive
     *
     * @api prop model-value
     * @extends model-value
     * @syncable
     * @example # v-model="myText"
     */
    modelValue: __QUASAR_SSR_SERVER__
      ? {} // SSR does not know about FileList
      : [String, Number, FileList],

    /**
     * Text to be displayed as shadow at the end of the text in the control; Does NOT applies to type=file
     *
     * @api prop shadow-text
     * @type {String}
     * @category content
     * @example 'rest of the fill value'
     */
    shadowText: String,

    /**
     * Input type
     *
     * @api prop type
     * @type {String}
     * @default 'text'
     * @category general
     */
    type: {
      type: String,
      default: 'text'
    },

    /**
     * Debounce amount (in milliseconds) when updating model
     *
     * @api prop debounce
     * @type {String|Number}
     * @category model
     */
    debounce: [String, Number],

    /**
     * Make field autogrow along with its content (uses a textarea)
     *
     * @api prop autogrow
     * @type {Boolean}
     * @category content
     */
    autogrow: Boolean, // makes a textarea

    /**
     * Class definitions to be attributed to the underlying input tag
     *
     * @api prop input-class
     * @type {String|Array|Object}
     * @ts-type VueClassProp
     * @category style
     * @example 'my-special-class'
     * @example { 'my-special-class': true }
     */
    inputClass: [Array, String, Object],
    /**
     * Style definitions to be attributed to the underlying input tag
     *
     * @api prop input-style
     * @type {String|Array|Object}
     * @ts-type VueStyleProp
     * @category style
     * @example 'background-color: #ff0000'
     * @example { backgroundColor: '#ff0000' }
     */
    inputStyle: [Array, String, Object]
  },

  emits: [
    ...useFieldEmits,
    /**
     * @api event paste
     */
    'paste',
    /**
     * @api event change
     */
    'change',
    /**
     * @api event keydown
     */
    'keydown',
    /**
     * @api event click
     */
    'click',
    /**
     * @api event animationend
     */
    'animationend'
  ],

  setup(props, { emit, attrs }) {
    const { proxy } = getCurrentInstance()
    const { $q } = proxy

    const temp = {}
    let emitCachedValue = Number.NaN,
      typedNumber = false,
      stopValueWatcher = false,
      emitTimer = null,
      emitValueFn

    const inputRef = ref(null)
    const nameProp = useFormInputNameAttr(props)

    const {
      innerValue,
      hasMask,
      moveCursorForPaste,
      updateMaskValue,
      onMaskedKeydown,
      onMaskedClick
    } = useMask(props, emit, emitValue, inputRef)

    const formDomProps = useFileFormDomProps(props, /* type guard */ true)
    const hasValue = computed(() => fieldValueIsFilled(innerValue.value))

    const onComposition = useKeyComposition(onInput)

    const state = useFieldState({ changeEvent: true })

    const isTextarea = computed(
      () => props.type === 'textarea' || props.autogrow
    )

    const isTypeText = computed(
      () =>
        isTextarea.value ||
        ['text', 'search', 'url', 'tel', 'password'].includes(props.type)
    )

    const onEvents = computed(() => {
      const evt = {
        ...state.splitAttrs.listeners.value,
        onInput,
        onPaste,
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        onChange,
        onBlur: onFinishEditing,
        onFocus: stop
      }

      evt.onCompositionstart =
        evt.onCompositionupdate =
        evt.onCompositionend =
          onComposition

      if (hasMask.value) {
        evt.onKeydown = onMaskedKeydown
        // reset selection anchor on pointer selection
        evt.onClick = onMaskedClick
      }

      if (props.autogrow) {
        evt.onAnimationend = onAnimationend
      }

      return evt
    })

    const inputAttrs = computed(() => {
      const acc = {
        tabindex: 0,
        'data-autofocus': props.autofocus || void 0,
        rows: props.type === 'textarea' ? 6 : void 0,
        'aria-label': props.label,
        name: nameProp.value,
        ...state.splitAttrs.attributes.value,
        id: state.targetUid.value,
        maxlength: props.maxlength,
        disabled: props.disable,
        readonly: props.readonly
      }

      if (!isTextarea.value) {
        acc.type = props.type
      }

      if (props.autogrow) {
        acc.rows = 1
      }

      return acc
    })

    // some browsers lose the native input value
    // so we need to reattach it dynamically
    // (like type="password" <-> type="text"; see #12078)
    watch(
      () => props.type,
      () => {
        if (inputRef.value) {
          inputRef.value.value = props.modelValue
        }
      }
    )

    watch(
      () => props.modelValue,
      v => {
        if (hasMask.value) {
          if (stopValueWatcher) {
            stopValueWatcher = false
            if (String(v) === emitCachedValue) return
          }

          updateMaskValue(v)
        } else if (innerValue.value !== v) {
          innerValue.value = v

          if (props.type === 'number' && Object.hasOwn(temp, 'value')) {
            if (typedNumber) {
              typedNumber = false
            } else {
              delete temp.value
            }
          }
        }

        // textarea only
        if (props.autogrow) nextTick(adjustHeight)
      }
    )

    watch(
      () => props.autogrow,
      val => {
        // textarea only
        if (val) {
          nextTick(adjustHeight)
        }
        // if it has a number of rows set respect it
        else if (inputRef.value !== null && attrs.rows > 0) {
          inputRef.value.style.height = 'auto'
        }
      }
    )

    watch(
      () => props.dense,
      () => {
        if (props.autogrow) nextTick(adjustHeight)
      }
    )

    /**
     * Focus underlying input tag
     *
     * @api method focus
     */
    function focus() {
      addFocusFn(() => {
        const el = document.activeElement
        if (
          inputRef.value !== null &&
          inputRef.value !== el &&
          (el === null || el.id !== state.targetUid.value)
        ) {
          inputRef.value.focus({ preventScroll: true })
        }
      })
    }

    /**
     * Select input text
     *
     * @api method select
     */
    function select() {
      inputRef.value?.select()
    }

    function onPaste(e) {
      if (hasMask.value && props.reverseFillMask !== true) {
        const inp = e.target
        moveCursorForPaste(inp, inp.selectionStart, inp.selectionEnd)
      }

      emit('paste', e)
    }

    function onInput(e) {
      if (!e || !e.target) return

      if (props.type === 'file') {
        emit('update:modelValue', e.target.files)
        return
      }

      const val = e.target.value

      if (e.target.qComposing) {
        temp.value = val
        return
      }

      if (hasMask.value) {
        updateMaskValue(val, false, e.inputType)
      } else {
        emitValue(val)

        if (isTypeText.value && e.target === document.activeElement) {
          const { selectionStart, selectionEnd } = e.target

          if (selectionStart !== void 0 && selectionEnd !== void 0) {
            nextTick(() => {
              if (
                e.target === document.activeElement &&
                val.indexOf(e.target.value) === 0
              ) {
                e.target.setSelectionRange(selectionStart, selectionEnd)
              }
            })
          }
        }
      }

      // we need to trigger it immediately too,
      // to avoid "flickering"
      if (props.autogrow) adjustHeight()
    }

    function onAnimationend(e) {
      emit('animationend', e)
      adjustHeight()
    }

    function emitValue(val, stopWatcher) {
      emitValueFn = () => {
        emitTimer = null

        if (props.type !== 'number' && Object.hasOwn(temp, 'value')) {
          delete temp.value
        }

        if (props.modelValue !== val && emitCachedValue !== val) {
          emitCachedValue = val

          if (stopWatcher === true) stopValueWatcher = true
          emit('update:modelValue', val)

          nextTick(() => {
            if (emitCachedValue === val) emitCachedValue = Number.NaN
          })
        }

        emitValueFn = void 0
      }

      if (props.type === 'number') {
        typedNumber = true
        temp.value = val
      }

      if (props.debounce !== void 0) {
        if (emitTimer !== null) clearTimeout(emitTimer)
        temp.value = val
        emitTimer = setTimeout(emitValueFn, props.debounce)
      } else {
        emitValueFn()
      }
    }

    // textarea only
    function adjustHeight() {
      requestAnimationFrame(() => {
        const inp = inputRef.value
        if (inp !== null) {
          const parentStyle = inp.parentNode.style
          // chrome does not keep scroll #15498
          const { scrollTop } = inp
          // chrome calculates a smaller scrollHeight when in a .column container
          const { overflowY, maxHeight } = $q.platform.is.firefox
            ? {}
            : window.getComputedStyle(inp)
          // on firefox or if overflowY is specified as scroll #14263, #14344
          // we don't touch overflow
          // firefox is not so bad in the end
          const changeOverflow = overflowY !== void 0 && overflowY !== 'scroll'

          // reset height of textarea to a small size to detect the real height
          // but keep the total control size the same
          if (changeOverflow) inp.style.overflowY = 'hidden'
          parentStyle.marginBottom = inp.scrollHeight - 1 + 'px'
          inp.style.height = '1px'

          inp.style.height = inp.scrollHeight + 'px'
          // we should allow scrollbars only
          // if there is maxHeight and content is taller than maxHeight
          if (changeOverflow) {
            inp.style.overflowY =
              Number.parseInt(maxHeight, 10) < inp.scrollHeight
                ? 'auto'
                : 'hidden'
          }
          parentStyle.marginBottom = ''
          inp.scrollTop = scrollTop
        }
      })
    }

    function onChange(e) {
      onComposition(e)

      if (emitTimer !== null) {
        clearTimeout(emitTimer)
        emitTimer = null
      }

      emitValueFn?.()

      emit('change', e.target.value)
    }

    function onFinishEditing(e) {
      if (e !== void 0) stop(e)

      if (emitTimer !== null) {
        clearTimeout(emitTimer)
        emitTimer = null
      }

      emitValueFn?.()

      typedNumber = false
      stopValueWatcher = false
      delete temp.value

      // we need to use setTimeout instead of this.$nextTick
      // to avoid a bug where focusout is not emitted for type date/time/week/...
      if (props.type !== 'file') {
        setTimeout(() => {
          if (inputRef.value !== null) {
            inputRef.value.value =
              innerValue.value !== void 0 ? innerValue.value : ''
          }
        })
      }
    }

    function getCurValue() {
      return Object.hasOwn(temp, 'value')
        ? temp.value
        : innerValue.value !== void 0
          ? innerValue.value
          : ''
    }

    onBeforeUnmount(() => {
      onFinishEditing()
    })

    onMounted(() => {
      // textarea only
      if (props.autogrow) adjustHeight()
    })

    Object.assign(state, {
      innerValue,

      fieldClass: computed(
        () =>
          `q-${isTextarea.value ? 'textarea' : 'input'}` +
          (props.autogrow ? ' q-textarea--autogrow' : '')
      ),

      hasShadow: computed(
        () =>
          props.type !== 'file' &&
          typeof props.shadowText === 'string' &&
          props.shadowText.length !== 0
      ),

      inputRef,

      emitValue,

      hasValue,

      floatingLabel: computed(
        () =>
          (hasValue.value &&
            (props.type !== 'number' ||
              Number.isFinite(Number(innerValue.value)))) ||
          fieldValueIsFilled(props.displayValue)
      ),

      getControl: () =>
        h(isTextarea.value ? 'textarea' : 'input', {
          ref: inputRef,
          class: ['q-field__native q-placeholder', props.inputClass],
          style: props.inputStyle,
          ...inputAttrs.value,
          ...onEvents.value,
          ...(props.type !== 'file'
            ? { value: getCurValue() }
            : formDomProps.value)
        }),

      getShadowControl: () =>
        h(
          'div',
          {
            class:
              'q-field__native q-field__shadow absolute-bottom no-pointer-events' +
              (isTextarea.value ? '' : ' text-no-wrap')
          },
          [
            h('span', { class: 'invisible' }, getCurValue()),
            h('span', props.shadowText)
          ]
        )
    })

    const renderFn = useField(state)

    // expose public methods
    Object.assign(proxy, {
      focus,
      select,
      /**
       * DEPRECATED; Access 'nativeEl' directly instead; Get the native input/textarea DOM Element
       *
       * @api method getNativeElement
       * @returns {Element} The underlying native input/textarea DOM Element
       */
      getNativeElement: () => inputRef.value // deprecated
    })

    injectProp(proxy, 'nativeEl', () => inputRef.value)

    return renderFn
  }
})
