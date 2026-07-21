import {
  Transition,
  computed,
  getCurrentInstance,
  h,
  nextTick,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  ref
} from 'vue'

import QIcon from '../../components/icon/QIcon.js'
import QSpinner from '../../components/spinner/QSpinner.js'

import useId from '../use-id/use-id.js'
import useSplitAttrs from '../use-split-attrs/use-split-attrs.js'
import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'
import useValidate, {
  useValidateProps
} from '../private.use-validate/use-validate.js'

import { hSlot } from '../../utils/private.render/render.js'
import { prevent, stopAndPrevent } from '../../utils/event/event.js'
import {
  addFocusFn,
  removeFocusFn
} from '../../utils/private.focus/focus-manager.js'

export function fieldValueIsFilled(val) {
  return val !== void 0 && val !== null && String(val).length !== 0
}

export const useNonInputFieldProps = {
  ...useDarkProps,
  ...useValidateProps,

  label: String,
  stackLabel: Boolean,
  hint: String,
  hideHint: Boolean,
  prefix: String,
  suffix: String,

  labelColor: String,
  color: String,
  bgColor: String,

  filled: Boolean,
  outlined: Boolean,
  borderless: Boolean,
  standout: [Boolean, String],

  square: Boolean,

  loading: Boolean,

  labelSlot: Boolean,

  bottomSlots: Boolean,
  hideBottomSpace: Boolean,

  rounded: Boolean,
  dense: Boolean,
  itemAligned: Boolean,

  counter: Boolean,

  clearable: Boolean,
  clearIcon: String,

  disable: Boolean,
  readonly: Boolean,

  autofocus: Boolean,

  for: String
}

export const useFieldProps = {
  ...useNonInputFieldProps,
  maxlength: [Number, String]
}

export const useFieldEmits = ['update:modelValue', 'clear', 'focus', 'blur']

export function useFieldState({
  requiredForAttr = true,
  tagProp,
  changeEvent = false
} = {}) {
  const { props, proxy } = getCurrentInstance()

  const isDark = useDark(props, proxy.$q)
  const targetUid = useId({
    required: requiredForAttr,
    getValue: () => props.for
  })

  return {
    requiredForAttr,
    changeEvent,
    tag: tagProp ? computed(() => props.tag) : { value: 'label' },

    isDark,

    editable: computed(() => !props.disable && !props.readonly),

    innerLoading: ref(false),
    focused: ref(false),
    hasPopupOpen: false,

    splitAttrs: useSplitAttrs(),
    targetUid,

    rootRef: ref(null),
    targetRef: ref(null),
    controlRef: ref(null)

    /**
     * user supplied additionals:

     * innerValue - computed
     * floatingLabel - computed
     * inputRef - computed

     * fieldClass - computed
     * hasShadow - computed

     * controlEvents - Object with fn(e)

     * getControl - fn
     * getInnerAppend - fn
     * getControlChild - fn
     * getShadowControl - fn
     * showPopup - fn
     */
  }
}

function getInnerAppendNode(key, content) {
  return content === null
    ? null
    : h(
        'div',
        {
          key,
          class:
            'q-field__append q-field__marginal row no-wrap items-center q-anchor--skip'
        },
        content
      )
}

export default function useField(state) {
  const { props, emit, slots, attrs, proxy } = getCurrentInstance()
  const { $q } = proxy

  let focusoutTimer = null

  if (state.hasValue === void 0) {
    state.hasValue = computed(() => fieldValueIsFilled(props.modelValue))
  }

  if (state.emitValue === void 0) {
    state.emitValue = value => {
      emit('update:modelValue', value)
    }
  }

  if (state.controlEvents === void 0) {
    state.controlEvents = {
      onFocusin: onControlFocusin,
      onFocusout: onControlFocusout
    }
  }

  Object.assign(state, {
    clearValue,
    onControlFocusin,
    onControlFocusout,
    focus
  })

  if (state.computedCounter === void 0) {
    state.computedCounter = computed(() => {
      if (props.counter) {
        const len =
          typeof props.modelValue === 'string' ||
          typeof props.modelValue === 'number'
            ? String(props.modelValue).length
            : Array.isArray(props.modelValue)
              ? props.modelValue.length
              : 0

        const max =
          props.maxlength !== void 0 ? props.maxlength : props.maxValues

        return len + (max !== void 0 ? ' / ' + max : '')
      }
    })
  }

  const { isDirtyModel, hasRules, hasError, errorMessage, resetValidation } =
    useValidate(state.focused, state.innerLoading)

  const floatingLabel =
    state.floatingLabel !== void 0
      ? computed(
          () =>
            props.stackLabel || state.focused.value || state.floatingLabel.value
        )
      : computed(
          () => props.stackLabel || state.focused.value || state.hasValue.value
        )

  const shouldRenderBottom = computed(
    () =>
      props.bottomSlots ||
      props.hint !== void 0 ||
      hasRules.value ||
      props.counter ||
      props.error !== null
  )

  const styleType = computed(() => {
    if (props.filled) return 'filled'
    if (props.outlined) return 'outlined'
    if (props.borderless) return 'borderless'
    if (props.standout) return 'standout'
    return 'standard'
  })

  const classes = computed(
    () =>
      `q-field row no-wrap items-start q-field--${styleType.value}` +
      (state.fieldClass !== void 0 ? ` ${state.fieldClass.value}` : '') +
      (props.rounded ? ' q-field--rounded' : '') +
      (props.square ? ' q-field--square' : '') +
      (floatingLabel.value ? ' q-field--float' : '') +
      (hasLabel.value ? ' q-field--labeled' : '') +
      (props.dense ? ' q-field--dense' : '') +
      (props.itemAligned ? ' q-field--item-aligned q-item-type' : '') +
      (state.isDark.value ? ' q-field--dark' : '') +
      (state.getControl === void 0 ? ' q-field--auto-height' : '') +
      (state.focused.value ? ' q-field--focused' : '') +
      (hasError.value ? ' q-field--error' : '') +
      (hasError.value || state.focused.value ? ' q-field--highlighted' : '') +
      (!props.hideBottomSpace && shouldRenderBottom.value
        ? ' q-field--with-bottom'
        : '') +
      (props.disable
        ? ' q-field--disabled'
        : props.readonly
          ? ' q-field--readonly'
          : '')
  )

  const contentClass = computed(
    () =>
      'q-field__control relative-position row no-wrap' +
      (props.bgColor !== void 0 ? ` bg-${props.bgColor}` : '') +
      (hasError.value
        ? ' text-negative'
        : typeof props.standout === 'string' &&
            props.standout.length !== 0 &&
            state.focused.value
          ? ` ${props.standout}`
          : props.color !== void 0
            ? ` text-${props.color}`
            : '')
  )

  const hasLabel = computed(() => props.labelSlot || props.label !== void 0)

  const labelClass = computed(
    () =>
      'q-field__label no-pointer-events absolute ellipsis' +
      (props.labelColor !== void 0 && !hasError.value
        ? ` text-${props.labelColor}`
        : '')
  )

  const controlSlotScope = computed(() => ({
    id: state.targetUid.value,
    editable: state.editable.value,
    focused: state.focused.value,
    floatingLabel: floatingLabel.value,
    modelValue: props.modelValue,
    emitValue: state.emitValue
  }))

  const attributes = computed(() => {
    const acc = {}

    if (state.targetUid.value) {
      acc.for = state.targetUid.value
    }

    if (props.disable) {
      acc['aria-disabled'] = 'true'
    }

    return acc
  })

  function focusHandler() {
    const el = document.activeElement
    let target = state.targetRef?.value

    if (target && (el === null || el.id !== state.targetUid.value)) {
      if (!target.hasAttribute('tabindex')) {
        target = target.querySelector('[tabindex]')
      }

      if (target !== el) {
        target?.focus({ preventScroll: true })
      }
    }
  }

  function focus() {
    addFocusFn(focusHandler)
  }

  function blur() {
    removeFocusFn(focusHandler)
    const el = document.activeElement
    if (el !== null && state.rootRef.value.contains(el)) {
      el.blur()
    }
  }

  function onControlFocusin(e) {
    if (focusoutTimer !== null) {
      clearTimeout(focusoutTimer)
      focusoutTimer = null
    }

    if (state.editable.value && !state.focused.value) {
      state.focused.value = true
      emit('focus', e)
    }
  }

  function onControlFocusout(e, then) {
    if (focusoutTimer !== null) clearTimeout(focusoutTimer)
    focusoutTimer = setTimeout(() => {
      focusoutTimer = null

      if (
        document.hasFocus() &&
        (state.hasPopupOpen ||
          state.controlRef === void 0 ||
          state.controlRef.value === null ||
          state.controlRef.value.contains(document.activeElement))
      ) {
        return
      }

      if (state.focused.value) {
        state.focused.value = false
        emit('blur', e)
      }

      then?.()
    }, 0)
  }

  function clearValue(e) {
    // prevent activating the field but keep focus on desktop
    stopAndPrevent(e)

    if (!$q.platform.is.mobile) {
      const el = state.targetRef?.value || state.rootRef.value
      el.focus()
    } else if (state.rootRef.value.contains(document.activeElement)) {
      document.activeElement.blur()
    }

    if (props.type === 'file') {
      // do not let focus be triggered
      // as it will make the native file dialog
      // appear for another selection
      state.inputRef.value.value = null
    }

    state.onClear?.()

    emit('update:modelValue', null)
    if (state.changeEvent) emit('change', null)
    emit('clear', props.modelValue)

    nextTick(() => {
      const isDirty = isDirtyModel.value
      resetValidation()
      isDirtyModel.value = isDirty
    })
  }

  function onClearableKeyup(evt) {
    if ([13, 32].includes(evt.keyCode)) clearValue(evt)
  }

  function getContent() {
    const node = []

    if (slots.prepend !== void 0) {
      node.push(
        h(
          'div',
          {
            class:
              'q-field__prepend q-field__marginal row no-wrap items-center',
            key: 'prepend',
            onClick: prevent
          },
          slots.prepend()
        )
      )
    }

    node.push(
      h(
        'div',
        {
          class:
            'q-field__control-container col relative-position row no-wrap q-anchor--skip'
        },
        getControlContainer()
      )
    )

    if (hasError.value && !props.noErrorIcon) {
      node.push(
        getInnerAppendNode('error', [
          h(QIcon, { name: $q.iconSet.field.error, color: 'negative' })
        ])
      )
    }

    if (props.loading || state.innerLoading.value) {
      node.push(
        getInnerAppendNode(
          'inner-loading-append',
          slots.loading !== void 0
            ? slots.loading()
            : [h(QSpinner, { color: props.color })]
        )
      )
    } else if (
      props.clearable &&
      state.hasValue.value &&
      state.editable.value
    ) {
      node.push(
        getInnerAppendNode('inner-clearable-append', [
          h(QIcon, {
            class: 'q-field__focusable-action',
            name: props.clearIcon || $q.iconSet.field.clear,
            tabindex: 0,
            role: 'button',
            'aria-hidden': 'false',
            'aria-label': $q.lang.label.clear,
            onKeyup: onClearableKeyup,
            onClick: clearValue
          })
        ])
      )
    }

    if (slots.append !== void 0) {
      node.push(
        h(
          'div',
          {
            class: 'q-field__append q-field__marginal row no-wrap items-center',
            key: 'append',
            onClick: prevent
          },
          slots.append()
        )
      )
    }

    if (state.getInnerAppend !== void 0) {
      node.push(getInnerAppendNode('inner-append', state.getInnerAppend()))
    }

    if (state.getControlChild !== void 0) {
      node.push(state.getControlChild())
    }

    return node
  }

  function getControlContainer() {
    const node = []

    if (props.prefix !== void 0 && props.prefix !== null) {
      node.push(
        h(
          'div',
          {
            class: 'q-field__prefix no-pointer-events row items-center'
          },
          props.prefix
        )
      )
    }

    if (state.getShadowControl !== void 0 && state.hasShadow.value) {
      node.push(state.getShadowControl())
    }

    if (hasLabel.value) {
      node.push(
        h(
          'div',
          {
            class: labelClass.value
          },
          hSlot(slots.label, props.label)
        )
      )
    }

    if (state.getControl !== void 0) {
      node.push(state.getControl())
    }
    // internal usage only:
    else if (slots.rawControl !== void 0) {
      node.push(slots.rawControl())
    } else if (slots.control !== void 0) {
      node.push(
        h(
          'div',
          {
            ref: state.targetRef,
            class: 'q-field__native row',
            tabindex: -1,
            ...state.splitAttrs.attributes.value,
            'data-autofocus': props.autofocus || void 0
          },
          slots.control(controlSlotScope.value)
        )
      )
    }

    if (props.suffix !== void 0 && props.suffix !== null) {
      node.push(
        h(
          'div',
          {
            class: 'q-field__suffix no-pointer-events row items-center'
          },
          props.suffix
        )
      )
    }

    // oxlint-disable-next-line unicorn/prefer-spread
    return node.concat(hSlot(slots.default))
  }

  function getBottom() {
    let msg, key

    if (hasError.value) {
      if (errorMessage.value !== null) {
        msg = [h('div', { role: 'alert' }, errorMessage.value)]
        key = `q--slot-error-${errorMessage.value}`
      } else {
        msg = hSlot(slots.error)
        key = 'q--slot-error'
      }
    } else if (!props.hideHint || state.focused.value) {
      if (props.hint !== void 0) {
        msg = [h('div', props.hint)]
        key = `q--slot-hint-${props.hint}`
      } else {
        msg = hSlot(slots.hint)
        key = 'q--slot-hint'
      }
    }

    const hasCounter = props.counter || slots.counter !== void 0

    if (props.hideBottomSpace && !hasCounter && msg === void 0) {
      return
    }

    const main = h(
      'div',
      {
        key,
        class: 'q-field__messages col'
      },
      msg
    )

    return h(
      'div',
      {
        class:
          'q-field__bottom row items-start q-field__bottom--' +
          (props.hideBottomSpace ? 'stale' : 'animated'),
        onClick: prevent
      },
      [
        props.hideBottomSpace
          ? main
          : h(Transition, { name: 'q-transition--field-message' }, () => main),

        hasCounter
          ? h(
              'div',
              {
                class: 'q-field__counter'
              },
              slots.counter !== void 0
                ? slots.counter()
                : state.computedCounter.value
            )
          : null
      ]
    )
  }

  let shouldActivate = false

  onDeactivated(() => {
    shouldActivate = true
  })

  onActivated(() => {
    if (shouldActivate && props.autofocus) {
      proxy.focus()
    }
  })

  if (props.autofocus) {
    onMounted(() => {
      proxy.focus()
    })
  }

  onBeforeUnmount(() => {
    if (focusoutTimer !== null) clearTimeout(focusoutTimer)
  })

  // expose public methods
  Object.assign(proxy, { focus, blur })

  return function renderField() {
    const labelAttrs =
      state.getControl === void 0 && slots.control === void 0
        ? {
            ...state.splitAttrs.attributes.value,
            'data-autofocus': props.autofocus || void 0,
            ...attributes.value
          }
        : attributes.value

    return h(
      state.tag.value,
      {
        ref: state.rootRef,
        class: [classes.value, attrs.class],
        style: attrs.style,
        ...labelAttrs
      },
      [
        slots.before !== void 0
          ? h(
              'div',
              {
                class:
                  'q-field__before q-field__marginal row no-wrap items-center',
                onClick: prevent
              },
              slots.before()
            )
          : null,

        h(
          'div',
          {
            class: 'q-field__inner relative-position col self-stretch'
          },
          [
            h(
              'div',
              {
                ref: state.controlRef,
                class: contentClass.value,
                tabindex: -1,
                ...state.controlEvents
              },
              getContent()
            ),

            shouldRenderBottom.value ? getBottom() : null
          ]
        ),

        slots.after !== void 0
          ? h(
              'div',
              {
                class:
                  'q-field__after q-field__marginal row no-wrap items-center',
                onClick: prevent
              },
              slots.after()
            )
          : null
      ]
    )
  }
}
