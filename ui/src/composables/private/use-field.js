import { h, ref, computed, watch, Transition, nextTick, onActivated, onDeactivated, onBeforeUnmount, onMounted, getCurrentInstance } from 'vue'

import { isRuntimeSsrPreHydration } from '../../plugins/Platform.js'

import QIcon from '../../components/icon/QIcon.js'
import QSpinner from '../../components/spinner/QSpinner.js'

import useDark, { useDarkProps } from '../../composables/private/use-dark.js'
import useValidate, { useValidateProps } from './use-validate.js'
import useSplitAttrs from './use-split-attrs.js'

import { hSlot } from '../../utils/private/render.js'
import uid from '../../utils/uid.js'
import { prevent, stopAndPrevent } from '../../utils/event.js'
import { addFocusFn, removeFocusFn } from '../../utils/private/focus-manager.js'

function getTargetUid (val) {
  return val === void 0 ? `f_${ uid() }` : val
}

export function fieldValueIsFilled (val) {
  return val !== void 0
    && val !== null
    && ('' + val).length !== 0
}

export const useFieldProps = {
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
  standout: [ Boolean, String ],

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

  for: String,

  maxlength: [ Number, String ]
}

export const useFieldEmits = [ 'update:modelValue', 'clear', 'focus', 'blur', 'popupShow', 'popupHide' ]

export function useFieldState () {
  const { props, attrs, proxy, vnode } = getCurrentInstance()

  const isDark = useDark(props, proxy.$q)

  return {
    isDark,

    editable: computed(() =>
      props.disable !== true && props.readonly !== true
    ),

    innerLoading: ref(false),
    focused: ref(false),
    hasPopupOpen: false,

    splitAttrs: useSplitAttrs(attrs, vnode),
    targetUid: ref(getTargetUid(props.for)),

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

export default function (state) {
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
      if (props.counter !== false) {
        const len = typeof props.modelValue === 'string' || typeof props.modelValue === 'number'
          ? ('' + props.modelValue).length
          : (Array.isArray(props.modelValue) === true ? props.modelValue.length : 0)

        const max = props.maxlength !== void 0
          ? props.maxlength
          : props.maxValues

        return len + (max !== void 0 ? ' / ' + max : '')
      }
    })
  }

  const {
    isDirtyModel,
    hasRules,
    hasError,
    errorMessage,
    resetValidation
  } = useValidate(state.focused, state.innerLoading)

  const floatingLabel = state.floatingLabel !== void 0
    ? computed(() => props.stackLabel === true || state.focused.value === true || state.floatingLabel.value === true)
    : computed(() => props.stackLabel === true || state.focused.value === true || state.hasValue.value === true)

  const shouldRenderBottom = computed(() =>
    props.bottomSlots === true
    || props.hint !== void 0
    || hasRules.value === true
    || props.counter === true
    || props.error !== null
  )

  const styleType = computed(() => {
    if (props.filled === true) { return 'filled' }
    if (props.outlined === true) { return 'outlined' }
    if (props.borderless === true) { return 'borderless' }
    if (props.standout) { return 'standout' }
    return 'standard'
  })

  const classes = computed(() =>
    `q-field row no-wrap items-start q-field--${ styleType.value }`
    + (state.fieldClass !== void 0 ? ` ${ state.fieldClass.value }` : '')
    + (props.rounded === true ? ' q-field--rounded' : '')
    + (props.square === true ? ' q-field--square' : '')
    + (floatingLabel.value === true ? ' q-field--float' : '')
    + (hasLabel.value === true ? ' q-field--labeled' : '')
    + (props.dense === true ? ' q-field--dense' : '')
    + (props.itemAligned === true ? ' q-field--item-aligned q-item-type' : '')
    + (state.isDark.value === true ? ' q-field--dark' : '')
    + (state.getControl === void 0 ? ' q-field--auto-height' : '')
    + (state.focused.value === true ? ' q-field--focused' : '')
    + (hasError.value === true ? ' q-field--error' : '')
    + (hasError.value === true || state.focused.value === true ? ' q-field--highlighted' : '')
    + (props.hideBottomSpace !== true && shouldRenderBottom.value === true ? ' q-field--with-bottom' : '')
    + (props.disable === true ? ' q-field--disabled' : (props.readonly === true ? ' q-field--readonly' : ''))
  )

  const contentClass = computed(() =>
    'q-field__control relative-position row no-wrap'
    + (props.bgColor !== void 0 ? ` bg-${ props.bgColor }` : '')
    + (
      hasError.value === true
        ? ' text-negative'
        : (
            typeof props.standout === 'string' && props.standout.length !== 0 && state.focused.value === true
              ? ` ${ props.standout }`
              : (props.color !== void 0 ? ` text-${ props.color }` : '')
          )
    )
  )

  const hasLabel = computed(() =>
    props.labelSlot === true || props.label !== void 0
  )

  const labelClass = computed(() =>
    'q-field__label no-pointer-events absolute ellipsis'
    + (props.labelColor !== void 0 && hasError.value !== true ? ` text-${ props.labelColor }` : '')
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
    const acc = {
      for: state.targetUid.value
    }

    if (props.disable === true) {
      acc[ 'aria-disabled' ] = 'true'
    }
    else if (props.readonly === true) {
      acc[ 'aria-readonly' ] = 'true'
    }

    return acc
  })

  watch(() => props.for, val => {
    // don't transform targetUid into a computed
    // prop as it will break SSR
    state.targetUid.value = getTargetUid(val)
  })

  function focusHandler () {
    const el = document.activeElement
    let target = state.targetRef !== void 0 && state.targetRef.value

    if (target && (el === null || el.id !== state.targetUid.value)) {
      target.hasAttribute('tabindex') === true || (target = target.querySelector('[tabindex]'))
      if (target && target !== el) {
        target.focus({ preventScroll: true })
      }
    }
  }

  function focus () {
    addFocusFn(focusHandler)
  }

  function blur () {
    removeFocusFn(focusHandler)
    const el = document.activeElement
    if (el !== null && state.rootRef.value.contains(el)) {
      el.blur()
    }
  }

  function onControlFocusin (e) {
    if (focusoutTimer !== null) {
      clearTimeout(focusoutTimer)
      focusoutTimer = null
    }

    if (state.editable.value === true && state.focused.value === false) {
      state.focused.value = true
      emit('focus', e)
    }
  }

  function onControlFocusout (e, then) {
    focusoutTimer !== null && clearTimeout(focusoutTimer)
    focusoutTimer = setTimeout(() => {
      focusoutTimer = null

      if (
        document.hasFocus() === true && (
          state.hasPopupOpen === true
          || state.controlRef === void 0
          || state.controlRef.value === null
          || state.controlRef.value.contains(document.activeElement) !== false
        )
      ) {
        return
      }

      if (state.focused.value === true) {
        state.focused.value = false
        emit('blur', e)
      }

      then !== void 0 && then()
    })
  }

  function clearValue (e) {
    // prevent activating the field but keep focus on desktop
    stopAndPrevent(e)

    if ($q.platform.is.mobile !== true) {
      const el = (state.targetRef !== void 0 && state.targetRef.value) || state.rootRef.value
      el.focus()
    }
    else if (state.rootRef.value.contains(document.activeElement) === true) {
      document.activeElement.blur()
    }

    if (props.type === 'file') { // TODO vue3
      // do not let focus be triggered
      // as it will make the native file dialog
      // appear for another selection
      state.inputRef.value.value = null
    }

    emit('update:modelValue', null)
    emit('clear', props.modelValue)

    nextTick(() => {
      resetValidation()

      if ($q.platform.is.mobile !== true) {
        isDirtyModel.value = false
      }
    })
  }

  function getContent () {
    const node = []

    slots.prepend !== void 0 && node.push(
      h('div', {
        class: 'q-field__prepend q-field__marginal row no-wrap items-center',
        key: 'prepend',
        onClick: prevent
      }, slots.prepend())
    )

    node.push(
      h('div', {
        class: 'q-field__control-container col relative-position row no-wrap q-anchor--skip'
      }, getControlContainer())
    )

    hasError.value === true && props.noErrorIcon === false && node.push(
      getInnerAppendNode('error', [
        h(QIcon, { name: $q.iconSet.field.error, color: 'negative' })
      ])
    )

    if (props.loading === true || state.innerLoading.value === true) {
      node.push(
        getInnerAppendNode(
          'inner-loading-append',
          slots.loading !== void 0
            ? slots.loading()
            : [ h(QSpinner, { color: props.color }) ]
        )
      )
    }
    else if (props.clearable === true && state.hasValue.value === true && state.editable.value === true) {
      node.push(
        getInnerAppendNode('inner-clearable-append', [
          h(QIcon, {
            class: 'q-field__focusable-action',
            tag: 'button',
            name: props.clearIcon || $q.iconSet.field.clear,
            tabindex: 0,
            type: 'button',
            'aria-hidden': null,
            role: null,
            onClick: clearValue
          })
        ])
      )
    }

    slots.append !== void 0 && node.push(
      h('div', {
        class: 'q-field__append q-field__marginal row no-wrap items-center',
        key: 'append',
        onClick: prevent
      }, slots.append())
    )

    state.getInnerAppend !== void 0 && node.push(
      getInnerAppendNode('inner-append', state.getInnerAppend())
    )

    state.getControlChild !== void 0 && node.push(
      state.getControlChild()
    )

    return node
  }

  function getControlContainer () {
    const node = []

    props.prefix !== void 0 && props.prefix !== null && node.push(
      h('div', {
        class: 'q-field__prefix no-pointer-events row items-center'
      }, props.prefix)
    )

    if (state.getShadowControl !== void 0 && state.hasShadow.value === true) {
      node.push(
        state.getShadowControl()
      )
    }

    if (state.getControl !== void 0) {
      node.push(state.getControl())
    }
    // internal usage only:
    else if (slots.rawControl !== void 0) {
      node.push(slots.rawControl())
    }
    else if (slots.control !== void 0) {
      node.push(
        h('div', {
          ref: state.targetRef,
          class: 'q-field__native row',
          tabindex: -1,
          ...state.splitAttrs.attributes.value,
          'data-autofocus': props.autofocus === true || void 0
        }, slots.control(controlSlotScope.value))
      )
    }

    hasLabel.value === true && node.push(
      h('div', {
        class: labelClass.value
      }, hSlot(slots.label, props.label))
    )

    props.suffix !== void 0 && props.suffix !== null && node.push(
      h('div', {
        class: 'q-field__suffix no-pointer-events row items-center'
      }, props.suffix)
    )

    return node.concat(hSlot(slots.default))
  }

  function getBottom () {
    let msg, key

    if (hasError.value === true) {
      if (errorMessage.value !== null) {
        msg = [ h('div', { role: 'alert' }, errorMessage.value) ]
        key = `q--slot-error-${ errorMessage.value }`
      }
      else {
        msg = hSlot(slots.error)
        key = 'q--slot-error'
      }
    }
    else if (props.hideHint !== true || state.focused.value === true) {
      if (props.hint !== void 0) {
        msg = [ h('div', props.hint) ]
        key = `q--slot-hint-${ props.hint }`
      }
      else {
        msg = hSlot(slots.hint)
        key = 'q--slot-hint'
      }
    }

    const hasCounter = props.counter === true || slots.counter !== void 0

    if (props.hideBottomSpace === true && hasCounter === false && msg === void 0) {
      return
    }

    const main = h('div', {
      key,
      class: 'q-field__messages col'
    }, msg)

    return h('div', {
      class: 'q-field__bottom row items-start q-field__bottom--'
        + (props.hideBottomSpace !== true ? 'animated' : 'stale'),
      onClick: prevent
    }, [
      props.hideBottomSpace === true
        ? main
        : h(Transition, { name: 'q-transition--field-message' }, () => main),

      hasCounter === true
        ? h('div', {
          class: 'q-field__counter'
        }, slots.counter !== void 0 ? slots.counter() : state.computedCounter.value)
        : null
    ])
  }

  function getInnerAppendNode (key, content) {
    return content === null
      ? null
      : h('div', {
        key,
        class: 'q-field__append q-field__marginal row no-wrap items-center q-anchor--skip'
      }, content)
  }

  let shouldActivate = false

  onDeactivated(() => {
    shouldActivate = true
  })

  onActivated(() => {
    shouldActivate === true && props.autofocus === true && proxy.focus()
  })

  onMounted(() => {
    if (isRuntimeSsrPreHydration.value === true && props.for === void 0) {
      state.targetUid.value = getTargetUid()
    }

    props.autofocus === true && proxy.focus()
  })

  onBeforeUnmount(() => {
    focusoutTimer !== null && clearTimeout(focusoutTimer)
  })

  // expose public methods
  Object.assign(proxy, { focus, blur })

  return function renderField () {
    const labelAttrs = state.getControl === void 0 && slots.control === void 0
      ? {
          ...state.splitAttrs.attributes.value,
          'data-autofocus': props.autofocus === true || void 0,
          ...attributes.value
        }
      : attributes.value

    return h('label', {
      ref: state.rootRef,
      class: [
        classes.value,
        attrs.class
      ],
      style: attrs.style,
      ...labelAttrs
    }, [
      slots.before !== void 0
        ? h('div', {
          class: 'q-field__before q-field__marginal row no-wrap items-center',
          onClick: prevent
        }, slots.before())
        : null,

      h('div', {
        class: 'q-field__inner relative-position col self-stretch'
      }, [
        h('div', {
          ref: state.controlRef,
          class: contentClass.value,
          tabindex: -1,
          ...state.controlEvents
        }, getContent()),

        shouldRenderBottom.value === true
          ? getBottom()
          : null
      ]),

      slots.after !== void 0
        ? h('div', {
          class: 'q-field__after q-field__marginal row no-wrap items-center',
          onClick: prevent
        }, slots.after())
        : null
    ])
  }
}
