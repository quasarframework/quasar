import {
  computed,
  getCurrentInstance,
  h,
  nextTick,
  onBeforeUnmount,
  onBeforeUpdate,
  onUpdated,
  ref,
  watch
} from 'vue'

import QField from '../field/QField.js'
import QIcon from '../icon/QIcon.js'
import QChip from '../chip/QChip.js'

import QItem from '../item/QItem.js'
import QItemSection from '../item/QItemSection.js'
import QItemLabel from '../item/QItemLabel.js'

import QMenu from '../menu/QMenu.js'
import QDialog from '../dialog/QDialog.js'

import useField, {
  fieldValueIsFilled,
  useFieldEmits,
  useFieldProps,
  useFieldState
} from '../../composables/private.use-field/use-field.js'
import {
  useVirtualScroll,
  useVirtualScrollProps
} from '../virtual-scroll/use-virtual-scroll.js'
import {
  useFormInputNameAttr,
  useFormProps
} from '../../composables/use-form/private.use-form.js'
import useKeyComposition from '../../composables/private.use-key-composition/use-key-composition.js'

import { createComponent } from '../../utils/private.create/create.js'
import { isDeepEqual } from '../../utils/is/is.js'
import { prevent, stop, stopAndPrevent } from '../../utils/event/event.js'
import { normalizeToInterval } from '../../utils/format/format.js'
import {
  isKeyCode,
  shouldIgnoreKey
} from '../../utils/private.keyboard/key-composition.js'
import { hMergeSlot } from '../../utils/private.render/render.js'

const validateNewValueMode = v => ['add', 'add-unique', 'toggle'].includes(v)
// oxlint-disable-next-line no-template-curly-in-string
const reEscapeList = '.*+?^${}()|[]\\'
const fieldPropsList = Object.keys(useFieldProps)

function getPropValueFn(userPropName, defaultPropName) {
  if (typeof userPropName === 'function') return userPropName

  const propName = userPropName !== void 0 ? userPropName : defaultPropName

  return opt =>
    opt !== null && typeof opt === 'object' && propName in opt
      ? opt[propName]
      : opt
}

export default createComponent({
  name: 'QSelect',

  inheritAttrs: false,

  props: {
    ...useVirtualScrollProps,
    ...useFormProps,
    ...useFieldProps,

    // override of useFieldProps > modelValue
    modelValue: {
      required: true
    },

    multiple: Boolean,

    displayValue: [String, Number],
    displayValueHtml: Boolean,
    dropdownIcon: String,

    options: {
      type: Array,
      default: () => []
    },

    optionValue: [Function, String],
    optionLabel: [Function, String],
    optionDisable: [Function, String],

    hideSelected: Boolean,
    hideDropdownIcon: Boolean,
    fillInput: Boolean,

    maxValues: [Number, String],

    optionsDense: Boolean,
    optionsDark: {
      type: Boolean,
      default: null
    },
    optionsSelectedClass: String,
    optionsHtml: Boolean,

    optionsCover: Boolean,

    menuShrink: Boolean,
    menuAnchor: String,
    menuSelf: String,
    menuOffset: Array,

    popupContentClass: String,
    popupContentStyle: [String, Array, Object],
    popupNoRouteDismiss: Boolean,

    useInput: Boolean,
    useChips: Boolean,

    newValueMode: {
      type: String,
      validator: validateNewValueMode
    },

    mapOptions: Boolean,
    emitValue: Boolean,

    disableTabSelection: Boolean,

    inputDebounce: {
      type: [Number, String],
      default: 500
    },

    inputClass: [Array, String, Object],
    inputStyle: [Array, String, Object],

    tabindex: {
      type: [String, Number],
      default: 0
    },

    autocomplete: String,

    transitionShow: {},
    transitionHide: {},
    transitionDuration: {},

    behavior: {
      type: String,
      validator: v => ['default', 'menu', 'dialog'].includes(v),
      default: 'default'
    },

    // override of useVirtualScrollProps > virtualScrollItemSize (no default)
    virtualScrollItemSize: useVirtualScrollProps.virtualScrollItemSize.type,

    onNewValue: Function,
    onFilter: Function
  },

  emits: [
    ...useFieldEmits,
    'add',
    'remove',
    'inputValue',
    'keyup',
    'keypress',
    'keydown',
    'popupShow',
    'popupHide',
    'filterAbort'
  ],

  setup(props, { slots, emit }) {
    const { proxy } = getCurrentInstance()
    const { $q } = proxy

    const menu = ref(false)
    const dialog = ref(false)
    const optionIndex = ref(-1)
    const inputValue = ref('')
    const dialogFieldFocused = ref(false)
    const innerLoadingIndicator = ref(false)

    let filterTimer = null,
      inputValueTimer = null,
      innerValueCache,
      hasDialog,
      userInputValue,
      filterId = null,
      defaultInputValue,
      transitionShowComputed,
      searchBuffer,
      searchBufferExp

    const inputRef = ref(null)
    const targetRef = ref(null)
    const menuRef = ref(null)
    const dialogRef = ref(null)
    const menuContentRef = ref(null)

    const nameProp = useFormInputNameAttr(props)

    const onComposition = useKeyComposition(onInput)

    const virtualScrollLength = computed(() =>
      Array.isArray(props.options) ? props.options.length : 0
    )

    const virtualScrollItemSizeComputed = computed(() =>
      props.virtualScrollItemSize === void 0
        ? props.optionsDense
          ? 24
          : 48
        : props.virtualScrollItemSize
    )

    const {
      virtualScrollSliceRange,
      virtualScrollSliceSizeComputed,
      localResetVirtualScroll,
      padVirtualScroll,
      onVirtualScrollEvt,
      scrollTo,
      setVirtualScrollSize
    } = useVirtualScroll({
      virtualScrollLength,
      getVirtualScrollTarget,
      getVirtualScrollEl,
      virtualScrollItemSizeComputed
    })

    const state = useFieldState()

    const innerValue = computed(() => {
      const mapNull = props.mapOptions && !props.multiple,
        val =
          props.modelValue !== void 0 && (props.modelValue !== null || mapNull)
            ? props.multiple && Array.isArray(props.modelValue)
              ? props.modelValue
              : [props.modelValue]
            : []

      if (props.mapOptions && Array.isArray(props.options)) {
        const cache =
          props.mapOptions && innerValueCache !== void 0 ? innerValueCache : []
        const values = val.map(v => getOption(v, cache))

        return props.modelValue === null && mapNull
          ? values.filter(v => v !== null)
          : values
      }

      return val
    })

    const innerFieldProps = computed(() => {
      const acc = {}
      fieldPropsList.forEach(key => {
        const val = props[key]
        if (val !== void 0) {
          acc[key] = val
        }
      })
      return acc
    })

    const isOptionsDark = computed(() =>
      props.optionsDark === null ? state.isDark.value : props.optionsDark
    )

    const hasValue = computed(() => fieldValueIsFilled(innerValue.value))

    const computedInputClass = computed(() => {
      let cls = 'q-field__input q-placeholder col'

      if (props.hideSelected || innerValue.value.length === 0) {
        return [cls, props.inputClass]
      }

      cls += ' q-field__input--padding'

      return props.inputClass === void 0 ? cls : [cls, props.inputClass]
    })

    const menuContentClass = computed(
      () =>
        (props.virtualScrollHorizontal ? 'q-virtual-scroll--horizontal' : '') +
        (props.popupContentClass ? ' ' + props.popupContentClass : '')
    )

    const noOptions = computed(() => virtualScrollLength.value === 0)

    const selectedString = computed(() =>
      innerValue.value.map(opt => getOptionLabel.value(opt)).join(', ')
    )

    const ariaCurrentValue = computed(() =>
      props.displayValue !== void 0 ? props.displayValue : selectedString.value
    )

    const needsHtmlFn = computed(() =>
      props.optionsHtml ? () => true : opt => opt?.html === true
    )

    const valueAsHtml = computed(
      () =>
        props.displayValueHtml ||
        (props.displayValue === void 0 &&
          (props.optionsHtml || innerValue.value.some(needsHtmlFn.value)))
    )

    const tabindex = computed(() => (state.focused.value ? props.tabindex : -1))

    const comboboxAttrs = computed(() => {
      const attrs = {
        tabindex: props.tabindex,
        role: 'combobox',
        'aria-label': props.label,
        'aria-readonly': props.readonly ? 'true' : 'false',
        'aria-autocomplete': props.useInput ? 'list' : 'none',
        'aria-expanded': menu.value ? 'true' : 'false',
        'aria-controls': `${state.targetUid.value}_lb`
      }

      if (optionIndex.value >= 0) {
        attrs['aria-activedescendant'] =
          `${state.targetUid.value}_${optionIndex.value}`
      }

      return attrs
    })

    const listboxAttrs = computed(() => ({
      id: `${state.targetUid.value}_lb`,
      role: 'listbox',
      'aria-multiselectable': props.multiple ? 'true' : 'false'
    }))

    const selectedScope = computed(() =>
      innerValue.value.map((opt, i) => ({
        index: i,
        opt,
        html: needsHtmlFn.value(opt),
        selected: true,
        removeAtIndex: removeAtIndexAndFocus,
        toggleOption,
        tabindex: tabindex.value
      }))
    )

    const optionScope = computed(() => {
      if (virtualScrollLength.value === 0) return []

      const { from, to } = virtualScrollSliceRange.value

      return props.options.slice(from, to).map((opt, i) => {
        const disable = isOptionDisabled.value(opt) === true
        const active = isOptionSelected(opt)
        const index = from + i

        const itemProps = {
          clickable: true,
          active,
          activeClass: computedOptionsSelectedClass.value,
          manualFocus: true,
          focused: false,
          disable,
          tabindex: -1,
          dense: props.optionsDense,
          dark: isOptionsDark.value,
          role: 'option',
          'aria-selected': active ? 'true' : 'false',
          id: `${state.targetUid.value}_${index}`,
          onClick: () => {
            toggleOption(opt)
          }
        }

        if (!disable) {
          if (optionIndex.value === index) itemProps.focused = true

          if ($q.platform.is.desktop) {
            itemProps.onMousemove = () => {
              if (menu.value) setOptionIndex(index)
            }
          }
        }

        return {
          index,
          opt,
          html: needsHtmlFn.value(opt),
          label: getOptionLabel.value(opt),
          selected: itemProps.active,
          focused: itemProps.focused,
          toggleOption,
          setOptionIndex,
          itemProps
        }
      })
    })

    const dropdownArrowIcon = computed(() =>
      props.dropdownIcon !== void 0
        ? props.dropdownIcon
        : $q.iconSet.arrow.dropdown
    )

    const squaredMenu = computed(
      () =>
        !props.optionsCover &&
        !props.outlined &&
        !props.standout &&
        !props.borderless &&
        !props.rounded
    )

    const computedOptionsSelectedClass = computed(() =>
      props.optionsSelectedClass !== void 0
        ? props.optionsSelectedClass
        : props.color !== void 0
          ? `text-${props.color}`
          : ''
    )

    // returns method to get value of an option;
    // takes into account 'option-value' prop
    const getOptionValue = computed(() =>
      getPropValueFn(props.optionValue, 'value')
    )

    // returns method to get label of an option;
    // takes into account 'option-label' prop
    const getOptionLabel = computed(() =>
      getPropValueFn(props.optionLabel, 'label')
    )

    // returns method to tell if an option is disabled;
    // takes into account 'option-disable' prop;
    // must be compared strictly to boolean true
    const isOptionDisabled = computed(() =>
      getPropValueFn(props.optionDisable, 'disable')
    )

    const innerOptionsValue = computed(() =>
      innerValue.value.map(getOptionValue.value)
    )

    const inputControlEvents = computed(() => {
      const evt = {
        onInput,
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        onChange: onComposition,
        onKeydown: onTargetKeydown,
        onKeyup: onTargetAutocomplete,
        onKeypress: onTargetKeypress,
        onFocus: selectInputText,
        onClick(e) {
          if (hasDialog) stop(e)
        }
      }

      evt.onCompositionstart =
        evt.onCompositionupdate =
        evt.onCompositionend =
          onComposition

      return evt
    })

    watch(
      innerValue,
      val => {
        innerValueCache = val

        if (
          props.useInput &&
          props.fillInput &&
          !props.multiple &&
          // Prevent re-entering in filter while filtering
          // Also prevent clearing inputValue while filtering
          !state.innerLoading.value &&
          ((!dialog.value && !menu.value) || !hasValue.value)
        ) {
          if (!userInputValue) resetInputValue()
          if (dialog.value || menu.value) filter('')
        }
      },
      { immediate: true }
    )

    watch(() => props.fillInput, resetInputValue)

    watch(menu, updateMenu)

    watch(virtualScrollLength, rerenderMenu)

    function getEmittingOptionValue(opt) {
      return props.emitValue ? getOptionValue.value(opt) : opt
    }

    function removeAtIndex(index) {
      if (index !== -1 && index < innerValue.value.length) {
        if (props.multiple) {
          const model = [...props.modelValue]
          emit('remove', { index, value: model.splice(index, 1)[0] })
          emit('update:modelValue', model)
        } else {
          emit('update:modelValue', null)
        }
      }
    }

    function removeAtIndexAndFocus(index) {
      removeAtIndex(index)
      state.focus()
    }

    function add(opt, unique) {
      const val = getEmittingOptionValue(opt)

      if (!props.multiple) {
        if (props.fillInput) {
          updateInputValue(getOptionLabel.value(opt), true, true)
        }

        emit('update:modelValue', val)
        return
      }

      if (innerValue.value.length === 0) {
        emit('add', { index: 0, value: val })
        emit('update:modelValue', props.multiple ? [val] : val)
        return
      }

      if (unique && isOptionSelected(opt)) return

      if (
        props.maxValues !== void 0 &&
        props.modelValue.length >= props.maxValues
      ) {
        return
      }

      const model = [...props.modelValue]

      emit('add', { index: model.length, value: val })
      model.push(val)
      emit('update:modelValue', model)
    }

    function toggleOption(opt, keepOpen) {
      if (
        !state.editable.value ||
        opt === void 0 ||
        isOptionDisabled.value(opt) === true
      ) {
        return
      }

      const optValue = getOptionValue.value(opt)

      if (!props.multiple) {
        if (!keepOpen) {
          updateInputValue(
            props.fillInput ? getOptionLabel.value(opt) : '',
            true,
            true
          )

          hidePopup()
        }

        targetRef.value?.focus()

        if (
          innerValue.value.length === 0 ||
          !isDeepEqual(getOptionValue.value(innerValue.value[0]), optValue)
        ) {
          emit('update:modelValue', props.emitValue ? optValue : opt)
        }

        return
      }

      if (!hasDialog || dialogFieldFocused.value) state.focus()

      selectInputText()

      if (innerValue.value.length === 0) {
        const val = props.emitValue ? optValue : opt
        emit('add', { index: 0, value: val })
        emit('update:modelValue', props.multiple ? [val] : val)
        return
      }

      const model = [...props.modelValue],
        index = innerOptionsValue.value.findIndex(v => isDeepEqual(v, optValue))

      if (index !== -1) {
        emit('remove', { index, value: model.splice(index, 1)[0] })
      } else {
        if (props.maxValues !== void 0 && model.length >= props.maxValues) {
          return
        }

        const val = props.emitValue ? optValue : opt

        emit('add', { index: model.length, value: val })
        model.push(val)
      }

      emit('update:modelValue', model)
    }

    function setOptionIndex(index) {
      if (!$q.platform.is.desktop) return

      const val = index !== -1 && index < virtualScrollLength.value ? index : -1

      if (optionIndex.value !== val) {
        optionIndex.value = val
      }
    }

    // oxlint-disable-next-line default-param-last
    function moveOptionSelection(localOffset = 1, skipInputValue) {
      if (menu.value) {
        let index = optionIndex.value
        do {
          index = normalizeToInterval(
            index + localOffset,
            -1,
            virtualScrollLength.value - 1
          )
        } while (
          index !== -1 &&
          index !== optionIndex.value &&
          isOptionDisabled.value(props.options[index]) === true
        )

        if (optionIndex.value !== index) {
          setOptionIndex(index)
          scrollTo(index)

          if (!skipInputValue && props.useInput && props.fillInput) {
            setInputValue(
              index >= 0
                ? getOptionLabel.value(props.options[index])
                : defaultInputValue,
              true
            )
          }
        }
      }
    }

    function getOption(value, valueCache) {
      const fn = opt => isDeepEqual(getOptionValue.value(opt), value)
      return props.options.find(fn) || valueCache.find(fn) || value
    }

    function isOptionSelected(opt) {
      const val = getOptionValue.value(opt)
      return innerOptionsValue.value.find(v => isDeepEqual(v, val)) !== void 0
    }

    function selectInputText(e) {
      if (
        props.useInput &&
        targetRef.value !== null &&
        (e === void 0 ||
          (targetRef.value === e.target &&
            e.target.value === selectedString.value))
      ) {
        targetRef.value.select()
      }
    }

    function onTargetKeyup(e) {
      // if ESC and we have an opened menu
      // then stop propagation (might be caught by a QDialog
      // and so it will also close the QDialog, which is wrong)
      if (isKeyCode(e, 27) && menu.value) {
        stop(e)
        // on ESC we need to close the dialog also
        hidePopup()
        resetInputValue()
      }

      emit('keyup', e)
    }

    function onTargetAutocomplete(e) {
      const { value } = e.target

      if (e.keyCode !== void 0) {
        onTargetKeyup(e)
        return
      }

      e.target.value = ''

      if (filterTimer !== null) {
        clearTimeout(filterTimer)
        filterTimer = null
      }
      if (inputValueTimer !== null) {
        clearTimeout(inputValueTimer)
        inputValueTimer = null
      }

      resetInputValue()

      if (typeof value === 'string' && value.length !== 0) {
        const needle = value.toLocaleLowerCase()
        const findFn = extractFn => {
          const option = props.options.find(
            opt => String(extractFn.value(opt)).toLocaleLowerCase() === needle
          )

          if (option === void 0) return false

          if (innerValue.value.includes(option)) hidePopup()
          else toggleOption(option)

          return true
        }
        const fillFn = afterFilter => {
          if (
            !findFn(getOptionValue) &&
            !afterFilter &&
            !findFn(getOptionLabel)
          ) {
            filter(value, true, () => fillFn(true))
          }
        }

        fillFn()
      } else {
        state.clearValue(e)
      }
    }

    function onTargetKeypress(e) {
      emit('keypress', e)
    }

    function onTargetKeydown(e) {
      emit('keydown', e)

      if (shouldIgnoreKey(e)) return

      const newValueModeValid =
        inputValue.value.length !== 0 &&
        (props.newValueMode !== void 0 || props.onNewValue !== void 0)

      const tabShouldSelect =
        !e.shiftKey &&
        !props.disableTabSelection &&
        !props.multiple &&
        (optionIndex.value !== -1 || newValueModeValid)

      // escape
      if (e.keyCode === 27) {
        prevent(e) // prevent clearing the inputValue
        return
      }

      // tab
      if (e.keyCode === 9 && !tabShouldSelect) {
        closeMenu()
        return
      }

      if (
        e.target === void 0 ||
        e.target.id !== state.targetUid.value ||
        !state.editable.value
      ) {
        return
      }

      // down
      if (e.keyCode === 40 && !state.innerLoading.value && !menu.value) {
        stopAndPrevent(e)
        showPopup()
        return
      }

      // backspace
      if (
        e.keyCode === 8 &&
        (props.useChips || props.clearable) &&
        !props.hideSelected &&
        inputValue.value.length === 0
      ) {
        if (props.multiple && Array.isArray(props.modelValue)) {
          removeAtIndex(props.modelValue.length - 1)
        } else if (!props.multiple && props.modelValue !== null) {
          emit('update:modelValue', null)
        }

        return
      }

      // home, end - 36, 35
      if (
        (e.keyCode === 35 || e.keyCode === 36) &&
        (typeof inputValue.value !== 'string' || inputValue.value.length === 0)
      ) {
        stopAndPrevent(e)
        optionIndex.value = -1
        moveOptionSelection(e.keyCode === 36 ? 1 : -1, props.multiple)
      }

      // pg up, pg down - 33, 34
      if (
        (e.keyCode === 33 || e.keyCode === 34) &&
        virtualScrollSliceSizeComputed.value !== void 0
      ) {
        stopAndPrevent(e)
        optionIndex.value = Math.max(
          -1,
          Math.min(
            virtualScrollLength.value,
            optionIndex.value +
              (e.keyCode === 33 ? -1 : 1) *
                virtualScrollSliceSizeComputed.value.view
          )
        )
        moveOptionSelection(e.keyCode === 33 ? 1 : -1, props.multiple)
      }

      // up, down
      if (e.keyCode === 38 || e.keyCode === 40) {
        stopAndPrevent(e)
        moveOptionSelection(e.keyCode === 38 ? -1 : 1, props.multiple)
      }

      const optionsLength = virtualScrollLength.value

      // clear search buffer if expired
      if (searchBuffer === void 0 || searchBufferExp < Date.now()) {
        searchBuffer = ''
      }

      // keyboard search when not having use-input
      if (
        optionsLength > 0 &&
        !props.useInput &&
        e.key !== void 0 &&
        e.key.length === 1 && // printable char
        !e.altKey && // not kbd shortcut
        !e.ctrlKey && // not kbd shortcut
        !e.metaKey && // not kbd shortcut, especially on macOS with Command key
        (e.keyCode !== 32 || searchBuffer.length !== 0) // space in middle of search
      ) {
        if (!menu.value) showPopup(e)

        const char = e.key.toLocaleLowerCase(),
          keyRepeat = searchBuffer.length === 1 && searchBuffer[0] === char

        searchBufferExp = Date.now() + 1500
        if (!keyRepeat) {
          stopAndPrevent(e)
          searchBuffer += char
        }

        const searchRe = new RegExp(
          '^' +
            [...searchBuffer]
              .map(l => (reEscapeList.includes(l) ? '\\' + l : l))
              .join('.*'),
          'i'
        )

        let index = optionIndex.value

        if (
          keyRepeat ||
          index < 0 ||
          !searchRe.test(getOptionLabel.value(props.options[index]))
        ) {
          do {
            index = normalizeToInterval(index + 1, -1, optionsLength - 1)
          } while (
            index !== optionIndex.value &&
            (isOptionDisabled.value(props.options[index]) === true ||
              !searchRe.test(getOptionLabel.value(props.options[index])))
          )
        }

        if (optionIndex.value !== index) {
          nextTick(() => {
            setOptionIndex(index)
            scrollTo(index)

            if (index >= 0 && props.useInput && props.fillInput) {
              setInputValue(getOptionLabel.value(props.options[index]), true)
            }
          })
        }

        return
      }

      // enter, space (when not using use-input and not in search),
      // or tab (when not using multiple and option selected)
      // same target is checked above
      if (
        e.keyCode !== 13 &&
        (e.keyCode !== 32 || props.useInput || searchBuffer !== '') &&
        (e.keyCode !== 9 || !tabShouldSelect)
      ) {
        return
      }

      if (e.keyCode !== 9) stopAndPrevent(e)

      if (optionIndex.value !== -1 && optionIndex.value < optionsLength) {
        toggleOption(props.options[optionIndex.value])
        return
      }

      if (newValueModeValid) {
        const done = (val, mode) => {
          if (mode) {
            if (!validateNewValueMode(mode)) return
          } else {
            mode = props.newValueMode
          }

          updateInputValue('', !props.multiple, true)

          if (val === void 0 || val === null) return

          const fn = mode === 'toggle' ? toggleOption : add
          fn(val, mode === 'add-unique')

          if (!props.multiple) {
            targetRef.value?.focus()
            hidePopup()
          }
        }

        if (props.onNewValue !== void 0) {
          emit('newValue', inputValue.value, done)
        } else {
          done(inputValue.value)
        }

        if (!props.multiple) return
      }

      if (menu.value) {
        closeMenu()
      } else if (!state.innerLoading.value) {
        showPopup()
      }
    }

    function getVirtualScrollEl() {
      return hasDialog
        ? menuContentRef.value
        : menuRef.value !== null && menuRef.value.contentEl !== null
          ? menuRef.value.contentEl
          : void 0
    }

    function getVirtualScrollTarget() {
      return getVirtualScrollEl()
    }

    function getSelection() {
      if (props.hideSelected) return []

      if (slots['selected-item'] !== void 0) {
        return selectedScope.value.map(scope => slots['selected-item'](scope))
      }

      if (slots.selected !== void 0) {
        return [slots.selected()].flat()
      }

      if (props.useChips) {
        return selectedScope.value.map((scope, i) =>
          h(
            QChip,
            {
              key: 'option-' + i,
              removable:
                state.editable.value &&
                isOptionDisabled.value(scope.opt) !== true,
              dense: true,
              textColor: props.color,
              tabindex: tabindex.value,
              onRemove() {
                scope.removeAtIndex(i)
              }
            },
            () =>
              h('span', {
                class: 'ellipsis',
                [scope.html ? 'innerHTML' : 'textContent']:
                  getOptionLabel.value(scope.opt)
              })
          )
        )
      }

      return [
        h('span', {
          class: 'ellipsis',
          [valueAsHtml.value ? 'innerHTML' : 'textContent']:
            ariaCurrentValue.value
        })
      ]
    }

    function getAllOptions() {
      if (noOptions.value) {
        return slots['no-option'] !== void 0
          ? slots['no-option']({ inputValue: inputValue.value })
          : void 0
      }

      const fn =
        slots.option !== void 0
          ? slots.option
          : scope =>
              h(
                QItem,
                {
                  key: scope.index,
                  ...scope.itemProps
                },
                () =>
                  h(QItemSection, () =>
                    h(QItemLabel, () =>
                      h('span', {
                        [scope.html ? 'innerHTML' : 'textContent']: scope.label
                      })
                    )
                  )
              )

      let options = padVirtualScroll('div', optionScope.value.map(fn))

      if (slots['before-options'] !== void 0) {
        options = [slots['before-options'](), ...options].flat()
      }

      return hMergeSlot(slots['after-options'], options)
    }

    function getInput(fromDialog, isTarget) {
      const attrs = isTarget
        ? { ...comboboxAttrs.value, ...state.splitAttrs.attributes.value }
        : void 0

      const data = {
        ref: isTarget ? targetRef : void 0,
        key: 'i_t',
        class: computedInputClass.value,
        style: props.inputStyle,
        value: inputValue.value !== void 0 ? inputValue.value : '',
        // required for Android in order to show ENTER key when in form
        type: 'search',
        ...attrs,
        id: isTarget ? state.targetUid.value : void 0,
        maxlength: props.maxlength,
        autocomplete: props.autocomplete,
        'data-autofocus': fromDialog === true || props.autofocus || void 0,
        disabled: props.disable,
        readonly: props.readonly,
        ...inputControlEvents.value
      }

      if (!fromDialog && hasDialog) {
        if (Array.isArray(data.class)) {
          data.class = [...data.class, 'no-pointer-events']
        } else {
          data.class += ' no-pointer-events'
        }
      }

      return h('input', data)
    }

    function onInput(e) {
      if (filterTimer !== null) {
        clearTimeout(filterTimer)
        filterTimer = null
      }
      if (inputValueTimer !== null) {
        clearTimeout(inputValueTimer)
        inputValueTimer = null
      }

      if (e?.target?.qComposing) return

      setInputValue(e.target.value || '')
      // mark it here as user input so that if updateInputValue is called
      // before filter is called the indicator is reset
      userInputValue = true
      defaultInputValue = inputValue.value

      if (!state.focused.value && (!hasDialog || dialogFieldFocused.value)) {
        state.focus()
      }

      if (props.onFilter !== void 0) {
        filterTimer = setTimeout(() => {
          filterTimer = null
          filter(inputValue.value)
        }, props.inputDebounce)
      }
    }

    function setInputValue(val, emitImmediately) {
      if (inputValue.value !== val) {
        if (inputValueTimer !== null) {
          clearTimeout(inputValueTimer)
          inputValueTimer = null
        }

        inputValue.value = val

        if (
          emitImmediately ||
          props.inputDebounce === 0 ||
          props.inputDebounce === '0'
        ) {
          emit('inputValue', val)
        } else {
          inputValueTimer = setTimeout(() => {
            inputValueTimer = null
            emit('inputValue', val)
          }, props.inputDebounce)
        }
      }
    }

    function updateInputValue(val, noFiltering, internal) {
      userInputValue = internal !== true

      if (props.useInput) {
        setInputValue(val, true)

        if (noFiltering || userInputValue) {
          defaultInputValue = val
        }

        if (!noFiltering) filter(val)
      }
    }

    function filter(val, keepClosed, afterUpdateFn) {
      if (props.onFilter === void 0 || (!keepClosed && !state.focused.value)) {
        return
      }

      if (state.innerLoading.value) {
        emit('filterAbort')
      } else {
        state.innerLoading.value = true
        innerLoadingIndicator.value = true
      }

      if (
        val !== '' &&
        !props.multiple &&
        innerValue.value.length !== 0 &&
        !userInputValue &&
        val === getOptionLabel.value(innerValue.value[0])
      ) {
        val = ''
      }

      const localFilterId = setTimeout(() => {
        if (menu.value) menu.value = false
      }, 10)

      if (filterId !== null) clearTimeout(filterId)
      filterId = localFilterId

      emit(
        'filter',
        val,
        (fn, afterFn) => {
          if (
            (keepClosed || state.focused.value) &&
            filterId === localFilterId
          ) {
            clearTimeout(filterId)

            if (typeof fn === 'function') fn()

            // hide indicator to allow arrow to animate
            innerLoadingIndicator.value = false

            nextTick(() => {
              state.innerLoading.value = false

              if (state.editable.value) {
                if (keepClosed) {
                  if (menu.value) hidePopup()
                } else if (menu.value) {
                  updateMenu(true)
                } else {
                  menu.value = true
                }
              }

              if (typeof afterFn === 'function') {
                nextTick(() => {
                  afterFn(proxy)
                })
              }

              if (typeof afterUpdateFn === 'function') {
                nextTick(() => {
                  afterUpdateFn(proxy)
                })
              }
            })
          }
        },
        () => {
          if (state.focused.value && filterId === localFilterId) {
            clearTimeout(filterId)
            state.innerLoading.value = false
            innerLoadingIndicator.value = false
          }

          if (menu.value) menu.value = false
        }
      )
    }

    function getMenu() {
      return h(
        QMenu,
        {
          ref: menuRef,
          class: menuContentClass.value,
          style: props.popupContentStyle,
          modelValue: menu.value,
          fit: !props.menuShrink,
          cover: props.optionsCover && !noOptions.value && !props.useInput,
          anchor: props.menuAnchor,
          self: props.menuSelf,
          offset: props.menuOffset,
          dark: isOptionsDark.value,
          noParentEvent: true,
          noRefocus: true,
          noFocus: true,
          noRouteDismiss: props.popupNoRouteDismiss,
          square: squaredMenu.value,
          transitionShow: props.transitionShow,
          transitionHide: props.transitionHide,
          transitionDuration: props.transitionDuration,
          separateClosePopup: true,
          ...listboxAttrs.value,
          onScrollPassive: onVirtualScrollEvt,
          onBeforeShow: onControlPopupShow,
          onBeforeHide: onMenuBeforeHide,
          onShow: onMenuShow
        },
        getAllOptions
      )
    }

    function onMenuBeforeHide(e) {
      onControlPopupHide(e)
      closeMenu()
    }

    function onMenuShow() {
      setVirtualScrollSize()
    }

    function onDialogFieldFocus(e) {
      stop(e)
      targetRef.value?.focus()
      dialogFieldFocused.value = true
      window.scrollTo(
        window.pageXOffset || window.scrollX || document.body.scrollLeft || 0,
        0
      )
    }

    function onDialogFieldBlur(e) {
      stop(e)
      nextTick(() => {
        dialogFieldFocused.value = false
      })
    }

    function getDialog() {
      const content = [
        h(
          QField,
          {
            class: `col-auto ${state.fieldClass.value}`,
            ...innerFieldProps.value,
            for: state.targetUid.value,
            dark: isOptionsDark.value,
            square: true,
            loading: innerLoadingIndicator.value,
            itemAligned: false,
            filled: true,
            stackLabel: inputValue.value.length !== 0,
            ...state.splitAttrs.listeners.value,
            onFocus: onDialogFieldFocus,
            onBlur: onDialogFieldBlur
          },
          {
            ...slots,
            rawControl: () => state.getControl(true),
            before: void 0,
            after: void 0
          }
        )
      ]

      if (menu.value) {
        content.push(
          h(
            'div',
            {
              ref: menuContentRef,
              class: menuContentClass.value + ' scroll',
              style: props.popupContentStyle,
              ...listboxAttrs.value,
              onClick: prevent,
              onScrollPassive: onVirtualScrollEvt
            },
            getAllOptions()
          )
        )
      }

      return h(
        QDialog,
        {
          ref: dialogRef,
          modelValue: dialog.value,
          position: props.useInput ? 'top' : void 0,
          transitionShow: transitionShowComputed,
          transitionHide: props.transitionHide,
          transitionDuration: props.transitionDuration,
          noRouteDismiss: props.popupNoRouteDismiss,
          onBeforeShow: onControlPopupShow,
          onBeforeHide: onDialogBeforeHide,
          onHide: onDialogHide,
          onShow: onDialogShow
        },
        () =>
          h(
            'div',
            {
              class:
                'q-select__dialog' +
                (isOptionsDark.value ? ' q-select__dialog--dark q-dark' : '') +
                (dialogFieldFocused.value ? ' q-select__dialog--focused' : '')
            },
            content
          )
      )
    }

    function onDialogBeforeHide(e) {
      onControlPopupHide(e)

      if (dialogRef.value !== null) {
        dialogRef.value.__updateRefocusTarget(
          state.rootRef.value.querySelector(
            '.q-field__native > [tabindex]:last-child'
          )
        )
      }

      state.focused.value = false
    }

    function onDialogHide(e) {
      hidePopup()
      if (!state.focused.value) emit('blur', e)
      resetInputValue()
    }

    function onDialogShow() {
      const el = document.activeElement
      if (
        (el === null || el.id !== state.targetUid.value) &&
        targetRef.value !== null &&
        targetRef.value !== el
      ) {
        targetRef.value.focus()
      }

      setVirtualScrollSize()
    }

    function closeMenu() {
      if (dialog.value) return

      optionIndex.value = -1

      if (menu.value) {
        menu.value = false
      }

      if (!state.focused.value) {
        if (filterId !== null) {
          clearTimeout(filterId)
          filterId = null
        }

        if (state.innerLoading.value) {
          emit('filterAbort')
          state.innerLoading.value = false
          innerLoadingIndicator.value = false
        }
      }
    }

    function showPopup(e) {
      if (!state.editable.value) return

      if (hasDialog) {
        state.onControlFocusin(e)
        dialog.value = true
        nextTick(() => {
          state.focus()
        })
      } else {
        state.focus()
      }

      if (props.onFilter !== void 0) {
        filter(inputValue.value)
      } else if (!noOptions.value || slots['no-option'] !== void 0) {
        menu.value = true
      }
    }

    function hidePopup() {
      dialog.value = false
      closeMenu()
    }

    function resetInputValue() {
      if (props.useInput) {
        updateInputValue(
          !props.multiple && props.fillInput && innerValue.value.length !== 0
            ? getOptionLabel.value(innerValue.value[0]) || ''
            : '',
          true,
          true
        )
      }
    }

    function updateMenu(show) {
      let localOptionIndex = -1

      if (show) {
        if (innerValue.value.length !== 0) {
          const val = getOptionValue.value(innerValue.value[0])
          localOptionIndex = props.options.findIndex(v =>
            isDeepEqual(getOptionValue.value(v), val)
          )
        }

        localResetVirtualScroll(localOptionIndex)
      }

      setOptionIndex(localOptionIndex)
    }

    function rerenderMenu(newLength, oldLength) {
      if (menu.value && !state.innerLoading.value) {
        localResetVirtualScroll(-1, true)

        nextTick(() => {
          if (menu.value && !state.innerLoading.value) {
            if (newLength > oldLength) {
              localResetVirtualScroll()
            } else {
              updateMenu(true)
            }
          }
        })
      }
    }

    function updateMenuPosition() {
      if (!dialog.value) menuRef.value?.updatePosition()
    }

    function onControlPopupShow(e) {
      if (e !== void 0) stop(e)
      emit('popupShow', e)
      state.hasPopupOpen = true
      state.onControlFocusin(e)
    }

    function onControlPopupHide(e) {
      if (e !== void 0) stop(e)
      emit('popupHide', e)
      state.hasPopupOpen = false
      state.onControlFocusout(e)
    }

    function updatePreState() {
      hasDialog =
        !$q.platform.is.mobile && props.behavior !== 'dialog'
          ? false
          : props.behavior !== 'menu' &&
            (props.useInput
              ? slots['no-option'] !== void 0 ||
                props.onFilter !== void 0 ||
                !noOptions.value
              : true)

      transitionShowComputed =
        $q.platform.is.ios && hasDialog && props.useInput
          ? 'fade'
          : props.transitionShow
    }

    onBeforeUpdate(updatePreState)
    onUpdated(updateMenuPosition)

    updatePreState()

    onBeforeUnmount(() => {
      if (filterTimer !== null) clearTimeout(filterTimer)
      if (inputValueTimer !== null) clearTimeout(inputValueTimer)
    })

    // expose public methods
    Object.assign(proxy, {
      showPopup,
      hidePopup,
      removeAtIndex,
      add,
      toggleOption,
      getOptionIndex: () => optionIndex.value,
      setOptionIndex,
      moveOptionSelection,
      filter,
      updateMenuPosition,
      updateInputValue,
      isOptionSelected,
      getEmittingOptionValue,
      isOptionDisabled: (...args) => isOptionDisabled.value(...args) === true,
      getOptionValue: (...args) => getOptionValue.value(...args),
      getOptionLabel: (...args) => getOptionLabel.value(...args)
    })

    Object.assign(state, {
      innerValue,

      fieldClass: computed(
        () =>
          `q-select q-field--auto-height q-select--with${props.useInput ? '' : 'out'}-input` +
          ` q-select--with${props.useChips ? '' : 'out'}-chips` +
          ` q-select--${props.multiple ? 'multiple' : 'single'}`
      ),

      inputRef,
      targetRef,
      hasValue,
      showPopup,

      floatingLabel: computed(
        () =>
          (!props.hideSelected && hasValue.value) ||
          typeof inputValue.value === 'number' ||
          inputValue.value.length !== 0 ||
          fieldValueIsFilled(props.displayValue)
      ),

      getControlChild: () => {
        if (
          state.editable.value &&
          (dialog.value || // dialog always has menu displayed, so need to render it
            !noOptions.value ||
            slots['no-option'] !== void 0)
        ) {
          return hasDialog ? getDialog() : getMenu()
        } else if (state.hasPopupOpen) {
          // explicitly set it otherwise TAB will not blur component
          state.hasPopupOpen = false
        }
      },

      controlEvents: {
        onFocusin(e) {
          state.onControlFocusin(e)
        },
        onFocusout(e) {
          state.onControlFocusout(e, () => {
            resetInputValue()
            closeMenu()
          })
        },
        onClick(e) {
          // label from QField will propagate click on the input
          prevent(e)

          if (!hasDialog && menu.value) {
            closeMenu()
            targetRef.value?.focus()
            return
          }

          showPopup(e)
        }
      },

      getControl: fromDialog => {
        const child = getSelection()
        const isTarget = fromDialog === true || !dialog.value || !hasDialog

        if (props.useInput) {
          child.push(getInput(fromDialog, isTarget))
        }
        // there can be only one (when dialog is opened the control in dialog should be target)
        else if (state.editable.value) {
          const attrs = isTarget ? comboboxAttrs.value : void 0

          child.push(
            h('input', {
              ref: isTarget ? targetRef : void 0,
              key: 'd_t',
              class: 'q-select__focus-target',
              id: isTarget ? state.targetUid.value : void 0,
              value: ariaCurrentValue.value,
              readonly: true,
              'data-autofocus':
                fromDialog === true || props.autofocus || void 0,
              ...attrs,
              onKeydown: onTargetKeydown,
              onKeyup: onTargetKeyup,
              onKeypress: onTargetKeypress
            })
          )

          if (
            isTarget &&
            typeof props.autocomplete === 'string' &&
            props.autocomplete.length !== 0
          ) {
            child.push(
              h('input', {
                class: 'q-select__autocomplete-input',
                autocomplete: props.autocomplete,
                tabindex: -1,
                onKeyup: onTargetAutocomplete
              })
            )
          }
        }

        if (
          nameProp.value !== void 0 &&
          !props.disable &&
          innerOptionsValue.value.length !== 0
        ) {
          const opts = innerOptionsValue.value.map(value =>
            h('option', { value, selected: true })
          )

          child.push(
            h(
              'select',
              {
                class: 'hidden',
                name: nameProp.value,
                multiple: props.multiple
              },
              opts
            )
          )
        }

        const attrs =
          props.useInput || !isTarget
            ? void 0
            : state.splitAttrs.attributes.value

        return h(
          'div',
          {
            class: 'q-field__native row items-center',
            ...attrs,
            ...state.splitAttrs.listeners.value
          },
          child
        )
      },

      getInnerAppend: () =>
        !props.loading &&
        !innerLoadingIndicator.value &&
        !props.hideDropdownIcon
          ? [
              h(QIcon, {
                class:
                  'q-select__dropdown-icon' + (menu.value ? ' rotate-180' : ''),
                name: dropdownArrowIcon.value
              })
            ]
          : null
    })

    return useField(state)
  }
})
