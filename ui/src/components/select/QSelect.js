import { h, ref, computed, watch, onBeforeUpdate, onUpdated, onBeforeUnmount, nextTick, getCurrentInstance } from 'vue'

import QField from '../field/QField.js'
import QIcon from '../icon/QIcon.js'
import QChip from '../chip/QChip.js'

import QItem from '../item/QItem.js'
import QItemSection from '../item/QItemSection.js'
import QItemLabel from '../item/QItemLabel.js'

import QMenu from '../menu/QMenu.js'
import QDialog from '../dialog/QDialog.js'

import useField, { useFieldState, useFieldProps, useFieldEmits, fieldValueIsFilled } from '../../composables/private/use-field.js'
import { useVirtualScroll, useVirtualScrollProps } from '../virtual-scroll/use-virtual-scroll.js'
import { useFormProps, useFormInputNameAttr } from '../../composables/private/use-form.js'
import useKeyComposition from '../../composables/private/use-key-composition.js'

import { createComponent } from '../../utils/private/create.js'
import { isDeepEqual } from '../../utils/private/is.js'
import { stop, prevent, stopAndPrevent } from '../../utils/event.js'
import { normalizeToInterval } from '../../utils/format.js'
import { shouldIgnoreKey, isKeyCode } from '../../utils/private/key-composition.js'
import { hMergeSlot } from '../../utils/private/render.js'

const validateNewValueMode = v => [ 'add', 'add-unique', 'toggle' ].includes(v)
const reEscapeList = '.*+?^${}()|[]\\'
const fieldPropsList = Object.keys(useFieldProps)

export default createComponent({
  name: 'QSelect',

  inheritAttrs: false,

  props: {
    ...useVirtualScrollProps,
    ...useFormProps,
    ...useFieldProps,

    modelValue: {
      required: true
    },

    multiple: Boolean,

    displayValue: [ String, Number ],
    displayValueHtml: Boolean,
    dropdownIcon: String,

    options: {
      type: Array,
      default: () => []
    },

    optionValue: [ Function, String ],
    optionLabel: [ Function, String ],
    optionDisable: [ Function, String ],

    hideSelected: Boolean,
    hideDropdownIcon: Boolean,
    fillInput: Boolean,

    maxValues: [ Number, String ],

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
    popupContentStyle: [ String, Array, Object ],

    useInput: Boolean,
    useChips: Boolean,

    newValueMode: {
      type: String,
      validator: validateNewValueMode
    },

    mapOptions: Boolean,
    emitValue: Boolean,

    inputDebounce: {
      type: [ Number, String ],
      default: 500
    },

    inputClass: [ Array, String, Object ],
    inputStyle: [ Array, String, Object ],

    tabindex: {
      type: [ String, Number ],
      default: 0
    },

    autocomplete: String,

    transitionShow: String,
    transitionHide: String,
    transitionDuration: [ String, Number ],

    behavior: {
      type: String,
      validator: v => [ 'default', 'menu', 'dialog' ].includes(v),
      default: 'default'
    },

    virtualScrollItemSize: {
      type: [ Number, String ],
      default: void 0
    },

    onNewValue: Function,
    onFilter: Function
  },

  emits: [
    ...useFieldEmits,
    'add', 'remove', 'input-value',
    'keyup', 'keypress', 'keydown',
    'filter-abort'
  ],

  setup (props, { slots, emit }) {
    const { proxy } = getCurrentInstance()
    const { $q } = proxy

    const menu = ref(false)
    const dialog = ref(false)
    const optionIndex = ref(-1)
    const inputValue = ref('')
    const dialogFieldFocused = ref(false)
    const innerLoadingIndicator = ref(false)

    let inputTimer, innerValueCache,
      hasDialog, userInputValue, filterId, defaultInputValue,
      transitionShowComputed, searchBuffer, searchBufferExp

    const inputRef = ref(null)
    const targetRef = ref(null)
    const menuRef = ref(null)
    const dialogRef = ref(null)
    const menuContentRef = ref(null)

    const nameProp = useFormInputNameAttr(props)

    const onComposition = useKeyComposition(onInput)

    const virtualScrollLength = computed(() => (
      Array.isArray(props.options)
        ? props.options.length
        : 0
    ))

    const virtualScrollItemSizeComputed = computed(() => (
      props.virtualScrollItemSize === void 0
        ? (props.dense === true ? 24 : 48)
        : props.virtualScrollItemSize
    ))

    const {
      virtualScrollSliceRange,
      virtualScrollSliceSizeComputed,
      localResetVirtualScroll,
      padVirtualScroll,
      onVirtualScrollEvt,
      scrollTo,
      setVirtualScrollSize
    } = useVirtualScroll({
      virtualScrollLength, getVirtualScrollTarget, getVirtualScrollEl,
      virtualScrollItemSizeComputed
    })

    const state = useFieldState()

    const innerValue = computed(() => {
      const
        mapNull = props.mapOptions === true && props.multiple !== true,
        val = props.modelValue !== void 0 && (props.modelValue !== null || mapNull === true)
          ? (props.multiple === true && Array.isArray(props.modelValue) ? props.modelValue : [ props.modelValue ])
          : []

      if (props.mapOptions === true && Array.isArray(props.options) === true) {
        const cache = props.mapOptions === true && innerValueCache !== void 0
          ? innerValueCache
          : []
        const values = val.map(v => getOption(v, cache))

        return props.modelValue === null && mapNull === true
          ? values.filter(v => v !== null)
          : values
      }

      return val
    })

    const innerFieldProps = computed(() => {
      const acc = {}
      fieldPropsList.forEach(key => {
        const val = props[ key ]
        if (val !== void 0) {
          acc[ key ] = val
        }
      })
      return acc
    })

    const isOptionsDark = computed(() => (
      props.optionsDark === null
        ? state.isDark.value
        : props.optionsDark
    ))

    const hasValue = computed(() => fieldValueIsFilled(innerValue.value))

    const computedInputClass = computed(() => {
      let cls = 'q-field__input q-placeholder col'

      if (props.hideSelected === true || innerValue.value.length === 0) {
        return [ cls, props.inputClass ]
      }

      cls += ' q-field__input--padding'

      return props.inputClass === void 0
        ? cls
        : [ cls, props.inputClass ]
    })

    const menuContentClass = computed(() =>
      (props.virtualScrollHorizontal === true ? 'q-virtual-scroll--horizontal' : '')
      + (props.popupContentClass ? ' ' + props.popupContentClass : '')
    )

    const noOptions = computed(() => virtualScrollLength.value === 0)

    const selectedString = computed(() =>
      innerValue.value
        .map(opt => getOptionLabel.value(opt))
        .join(', ')
    )

    const needsHtmlFn = computed(() => (
      props.optionsHtml === true
        ? () => true
        : opt => opt !== void 0 && opt !== null && opt.html === true
    ))

    const valueAsHtml = computed(() => (
      props.displayValueHtml === true || (
        props.displayValue === void 0 && (
          props.optionsHtml === true
          || innerValue.value.some(needsHtmlFn.value)
        )
      )
    ))

    const tabindex = computed(() => (state.focused.value === true ? props.tabindex : -1))

    const comboboxAttrs = computed(() => ({
      tabindex: props.tabindex,
      role: 'combobox',
      'aria-label': props.label,
      'aria-autocomplete': props.useInput === true ? 'list' : 'none',
      'aria-expanded': menu.value === true ? 'true' : 'false',
      'aria-owns': `${ state.targetUid.value }_lb`,
      'aria-controls': `${ state.targetUid.value }_lb`
    }))

    const listboxAttrs = computed(() => {
      const attrs = {
        id: `${ state.targetUid.value }_lb`,
        role: 'listbox',
        'aria-multiselectable': props.multiple === true ? 'true' : 'false'
      }

      if (optionIndex.value >= 0) {
        attrs[ 'aria-activedescendant' ] = `${ state.targetUid.value }_${ optionIndex.value }`
      }

      return attrs
    })

    const selectedScope = computed(() => {
      return innerValue.value.map((opt, i) => ({
        index: i,
        opt,
        html: needsHtmlFn.value(opt),
        selected: true,
        removeAtIndex: removeAtIndexAndFocus,
        toggleOption,
        tabindex: tabindex.value
      }))
    })

    const optionScope = computed(() => {
      if (virtualScrollLength.value === 0) {
        return []
      }

      const { from, to } = virtualScrollSliceRange.value

      return props.options.slice(from, to).map((opt, i) => {
        const disable = isOptionDisabled.value(opt) === true
        const index = from + i

        const itemProps = {
          clickable: true,
          active: false,
          activeClass: computedOptionsSelectedClass.value,
          manualFocus: true,
          focused: false,
          disable,
          tabindex: -1,
          dense: props.optionsDense,
          dark: isOptionsDark.value,
          role: 'option',
          id: `${ state.targetUid.value }_${ index }`,
          onClick: () => { toggleOption(opt) }
        }

        if (disable !== true) {
          isOptionSelected(opt) === true && (itemProps.active = true)
          optionIndex.value === index && (itemProps.focused = true)

          itemProps[ 'aria-selected' ] = itemProps.active === true ? 'true' : 'false'

          if ($q.platform.is.desktop === true) {
            itemProps.onMousemove = () => { setOptionIndex(index) }
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

    const dropdownArrowIcon = computed(() => (
      props.dropdownIcon !== void 0
        ? props.dropdownIcon
        : $q.iconSet.arrow.dropdown
    ))

    const squaredMenu = computed(() =>
      props.optionsCover === false
      && props.outlined !== true
      && props.standout !== true
      && props.borderless !== true
      && props.rounded !== true
    )

    const computedOptionsSelectedClass = computed(() => (
      props.optionsSelectedClass !== void 0
        ? props.optionsSelectedClass
        : (props.color !== void 0 ? `text-${ props.color }` : '')
    ))

    // returns method to get value of an option;
    // takes into account 'option-value' prop
    const getOptionValue = computed(() => getPropValueFn(props.optionValue, 'value'))

    // returns method to get label of an option;
    // takes into account 'option-label' prop
    const getOptionLabel = computed(() => getPropValueFn(props.optionLabel, 'label'))

    // returns method to tell if an option is disabled;
    // takes into account 'option-disable' prop
    const isOptionDisabled = computed(() => getPropValueFn(props.optionDisable, 'disable'))

    const innerOptionsValue = computed(() => innerValue.value.map(opt => getOptionValue.value(opt)))

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
        onClick (e) { hasDialog === true && stop(e) }
      }

      evt.onCompositionstart = evt.onCompositionupdate = evt.onCompositionend = onComposition

      return evt
    })

    watch(innerValue, val => {
      innerValueCache = val

      if (
        props.useInput === true
        && props.fillInput === true
        && props.multiple !== true
        // Prevent re-entering in filter while filtering
        // Also prevent clearing inputValue while filtering
        && state.innerLoading.value !== true
        && ((dialog.value !== true && menu.value !== true) || hasValue.value !== true)
      ) {
        userInputValue !== true && resetInputValue()
        if (dialog.value === true || menu.value === true) {
          filter('')
        }
      }
    }, { immediate: true })

    watch(() => props.fillInput, resetInputValue)

    watch(menu, updateMenu)

    function getEmittingOptionValue (opt) {
      return props.emitValue === true
        ? getOptionValue.value(opt)
        : opt
    }

    function removeAtIndex (index) {
      if (index > -1 && index < innerValue.value.length) {
        if (props.multiple === true) {
          const model = props.modelValue.slice()
          emit('remove', { index, value: model.splice(index, 1)[ 0 ] })
          emit('update:modelValue', model)
        }
        else {
          emit('update:modelValue', null)
        }
      }
    }

    function removeAtIndexAndFocus (index) {
      removeAtIndex(index)
      state.focus()
    }

    function add (opt, unique) {
      const val = getEmittingOptionValue(opt)

      if (props.multiple !== true) {
        props.fillInput === true && updateInputValue(
          getOptionLabel.value(opt),
          true,
          true
        )

        emit('update:modelValue', val)
        return
      }

      if (innerValue.value.length === 0) {
        emit('add', { index: 0, value: val })
        emit('update:modelValue', props.multiple === true ? [ val ] : val)
        return
      }

      if (unique === true && isOptionSelected(opt) === true) {
        return
      }

      if (props.maxValues !== void 0 && props.modelValue.length >= props.maxValues) {
        return
      }

      const model = props.modelValue.slice()

      emit('add', { index: model.length, value: val })
      model.push(val)
      emit('update:modelValue', model)
    }

    function toggleOption (opt, keepOpen) {
      if (state.editable.value !== true || opt === void 0 || isOptionDisabled.value(opt) === true) {
        return
      }

      const optValue = getOptionValue.value(opt)

      if (props.multiple !== true) {
        if (keepOpen !== true) {
          updateInputValue(
            props.fillInput === true ? getOptionLabel.value(opt) : '',
            true,
            true
          )

          hidePopup()
        }

        targetRef.value !== null && targetRef.value.focus()

        if (isDeepEqual(getOptionValue.value(innerValue.value[ 0 ]), optValue) !== true) {
          emit('update:modelValue', props.emitValue === true ? optValue : opt)
        }
        return
      }

      (hasDialog !== true || dialogFieldFocused.value === true) && state.focus()

      selectInputText()

      if (innerValue.value.length === 0) {
        const val = props.emitValue === true ? optValue : opt
        emit('add', { index: 0, value: val })
        emit('update:modelValue', props.multiple === true ? [ val ] : val)
        return
      }

      const
        model = props.modelValue.slice(),
        index = innerOptionsValue.value.findIndex(v => isDeepEqual(v, optValue))

      if (index > -1) {
        emit('remove', { index, value: model.splice(index, 1)[ 0 ] })
      }
      else {
        if (props.maxValues !== void 0 && model.length >= props.maxValues) {
          return
        }

        const val = props.emitValue === true ? optValue : opt

        emit('add', { index: model.length, value: val })
        model.push(val)
      }

      emit('update:modelValue', model)
    }

    function setOptionIndex (index) {
      if ($q.platform.is.desktop !== true) { return }

      const val = index > -1 && index < virtualScrollLength.value
        ? index
        : -1

      if (optionIndex.value !== val) {
        optionIndex.value = val
      }
    }

    function moveOptionSelection (offset = 1, skipInputValue) {
      if (menu.value === true) {
        let index = optionIndex.value
        do {
          index = normalizeToInterval(
            index + offset,
            -1,
            virtualScrollLength.value - 1
          )
        }
        while (index !== -1 && index !== optionIndex.value && isOptionDisabled.value(props.options[ index ]) === true)

        if (optionIndex.value !== index) {
          setOptionIndex(index)
          scrollTo(index)

          if (skipInputValue !== true && props.useInput === true && props.fillInput === true) {
            setInputValue(index >= 0
              ? getOptionLabel.value(props.options[ index ])
              : defaultInputValue
            )
          }
        }
      }
    }

    function getOption (value, valueCache) {
      const fn = opt => isDeepEqual(getOptionValue.value(opt), value)
      return props.options.find(fn) || valueCache.find(fn) || value
    }

    function getPropValueFn (propValue, defaultVal) {
      const val = propValue !== void 0
        ? propValue
        : defaultVal

      return typeof val === 'function'
        ? val
        : opt => (Object(opt) === opt && val in opt ? opt[ val ] : opt)
    }

    function isOptionSelected (opt) {
      const val = getOptionValue.value(opt)
      return innerOptionsValue.value.find(v => isDeepEqual(v, val)) !== void 0
    }

    function selectInputText () {
      if (props.useInput === true && targetRef.value !== null) {
        targetRef.value.select()
      }
    }

    function onTargetKeyup (e) {
      // if ESC and we have an opened menu
      // then stop propagation (might be caught by a QDialog
      // and so it will also close the QDialog, which is wrong)
      if (isKeyCode(e, 27) === true && menu.value === true) {
        stop(e)
        // on ESC we need to close the dialog also
        hidePopup()
        resetInputValue()
      }

      emit('keyup', e)
    }

    function onTargetAutocomplete (e) {
      const { value } = e.target

      if (e.keyCode !== void 0) {
        onTargetKeyup(e)
        return
      }

      e.target.value = ''
      clearTimeout(inputTimer)
      resetInputValue()

      if (typeof value === 'string' && value.length > 0) {
        const needle = value.toLocaleLowerCase()

        let fn = opt => getOptionValue.value(opt).toLocaleLowerCase() === needle
        let option = props.options.find(fn)

        if (option !== void 0) {
          if (innerValue.value.indexOf(option) === -1) {
            toggleOption(option)
          }
          else {
            hidePopup()
          }
        }
        else {
          fn = opt => getOptionLabel.value(opt).toLocaleLowerCase() === needle
          option = props.options.find(fn)

          if (option !== void 0) {
            if (innerValue.value.indexOf(option) === -1) {
              toggleOption(option)
            }
            else {
              hidePopup()
            }
          }
          else {
            filter(value, true)
          }
        }
      }
      else {
        state.clearValue(e)
      }
    }

    function onTargetKeypress (e) {
      emit('keypress', e)
    }

    function onTargetKeydown (e) {
      emit('keydown', e)

      if (shouldIgnoreKey(e) === true) {
        return
      }

      const newValueModeValid = inputValue.value.length > 0
        && (props.newValueMode !== void 0 || props.onNewValue !== void 0)

      const tabShouldSelect = e.shiftKey !== true
        && props.multiple !== true
        && (optionIndex.value > -1 || newValueModeValid === true)

      // escape
      if (e.keyCode === 27) {
        prevent(e) // prevent clearing the inputValue
        return
      }

      // tab
      if (e.keyCode === 9 && tabShouldSelect === false) {
        closeMenu()
        return
      }

      if (e.target === void 0 || e.target.id !== state.targetUid.value) { return }

      // down
      if (
        e.keyCode === 40
        && state.innerLoading.value !== true
        && menu.value === false
      ) {
        stopAndPrevent(e)
        showPopup()
        return
      }

      // backspace
      if (
        e.keyCode === 8
        && props.hideSelected !== true
        && inputValue.value.length === 0
      ) {
        if (props.multiple === true && Array.isArray(props.modelValue) === true) {
          removeAtIndex(props.modelValue.length - 1)
        }
        else if (props.multiple !== true && props.modelValue !== null) {
          emit('update:modelValue', null)
        }
        return
      }

      // home, end - 36, 35
      if (
        (e.keyCode === 35 || e.keyCode === 36)
        && (typeof inputValue.value !== 'string' || inputValue.value.length === 0)
      ) {
        stopAndPrevent(e)
        optionIndex.value = -1
        moveOptionSelection(e.keyCode === 36 ? 1 : -1, props.multiple)
      }

      // pg up, pg down - 33, 34
      if (
        (e.keyCode === 33 || e.keyCode === 34)
        && virtualScrollSliceSizeComputed.value !== void 0
      ) {
        stopAndPrevent(e)
        optionIndex.value = Math.max(
          -1,
          Math.min(
            virtualScrollLength.value,
            optionIndex.value + (e.keyCode === 33 ? -1 : 1) * virtualScrollSliceSizeComputed.value.view
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
        optionsLength > 0
        && props.useInput !== true
        && e.key !== void 0
        && e.key.length === 1 // printable char
        && e.altKey === e.ctrlKey // not kbd shortcut
        && (e.keyCode !== 32 || searchBuffer.length > 0) // space in middle of search
      ) {
        menu.value !== true && showPopup(e)

        const
          char = e.key.toLocaleLowerCase(),
          keyRepeat = searchBuffer.length === 1 && searchBuffer[ 0 ] === char

        searchBufferExp = Date.now() + 1500
        if (keyRepeat === false) {
          stopAndPrevent(e)
          searchBuffer += char
        }

        const searchRe = new RegExp('^' + searchBuffer.split('').map(l => (reEscapeList.indexOf(l) > -1 ? '\\' + l : l)).join('.*'), 'i')

        let index = optionIndex.value

        if (keyRepeat === true || index < 0 || searchRe.test(getOptionLabel.value(props.options[ index ])) !== true) {
          do {
            index = normalizeToInterval(index + 1, -1, optionsLength - 1)
          }
          while (index !== optionIndex.value && (
            isOptionDisabled.value(props.options[ index ]) === true
            || searchRe.test(getOptionLabel.value(props.options[ index ])) !== true
          ))
        }

        if (optionIndex.value !== index) {
          nextTick(() => {
            setOptionIndex(index)
            scrollTo(index)

            if (index >= 0 && props.useInput === true && props.fillInput === true) {
              setInputValue(getOptionLabel.value(props.options[ index ]))
            }
          })
        }

        return
      }

      // enter, space (when not using use-input and not in search), or tab (when not using multiple and option selected)
      // same target is checked above
      if (
        e.keyCode !== 13
        && (e.keyCode !== 32 || props.useInput === true || searchBuffer !== '')
        && (e.keyCode !== 9 || tabShouldSelect === false)
      ) { return }

      e.keyCode !== 9 && stopAndPrevent(e)

      if (optionIndex.value > -1 && optionIndex.value < optionsLength) {
        toggleOption(props.options[ optionIndex.value ])
        return
      }

      if (newValueModeValid === true) {
        const done = (val, mode) => {
          if (mode) {
            if (validateNewValueMode(mode) !== true) {
              return
            }
          }
          else {
            mode = props.newValueMode
          }

          if (val === void 0 || val === null) {
            return
          }

          updateInputValue('', props.multiple !== true, true)

          const fn = mode === 'toggle' ? toggleOption : add
          fn(val, mode === 'add-unique')

          if (props.multiple !== true) {
            targetRef.value !== null && targetRef.value.focus()
            hidePopup()
          }
        }

        if (props.onNewValue !== void 0) {
          emit('new-value', inputValue.value, done)
        }
        else {
          done(inputValue.value)
        }

        if (props.multiple !== true) {
          return
        }
      }

      if (menu.value === true) {
        closeMenu()
      }
      else if (state.innerLoading.value !== true) {
        showPopup()
      }
    }

    function getVirtualScrollEl () {
      return hasDialog === true
        ? menuContentRef.value
        : (
            menuRef.value !== null && menuRef.value.__qPortalInnerRef.value !== null
              ? menuRef.value.__qPortalInnerRef.value
              : void 0
          )
    }

    function getVirtualScrollTarget () {
      return getVirtualScrollEl()
    }

    function getSelection () {
      if (props.hideSelected === true) {
        return []
      }

      if (slots[ 'selected-item' ] !== void 0) {
        return selectedScope.value.map(scope => slots[ 'selected-item' ](scope)).slice()
      }

      if (slots.selected !== void 0) {
        return [].concat(slots.selected())
      }

      if (props.useChips === true) {
        return selectedScope.value.map((scope, i) => h(QChip, {
          key: 'option-' + i,
          removable: state.editable.value === true && isOptionDisabled.value(scope.opt) !== true,
          dense: true,
          textColor: props.color,
          tabindex: tabindex.value,
          onRemove () { scope.removeAtIndex(i) }
        }, () => h('span', {
          class: 'ellipsis',
          [ scope.html === true ? 'innerHTML' : 'textContent' ]: getOptionLabel.value(scope.opt)
        })))
      }

      return [
        h('span', {
          [ valueAsHtml.value === true ? 'innerHTML' : 'textContent' ]: props.displayValue !== void 0
            ? props.displayValue
            : selectedString.value
        })
      ]
    }

    function getAllOptions () {
      if (noOptions.value === true) {
        return slots[ 'no-option' ] !== void 0
          ? slots[ 'no-option' ]({ inputValue: inputValue.value })
          : void 0
      }

      const fn = slots.option !== void 0
        ? slots.option
        : scope => {
          return h(QItem, {
            key: scope.index,
            ...scope.itemProps
          }, () => {
            return h(
              QItemSection,
              () => h(
                QItemLabel,
                () => h('span', {
                  [ scope.html === true ? 'innerHTML' : 'textContent' ]: scope.label
                })
              )
            )
          })
        }

      let options = padVirtualScroll('div', optionScope.value.map(fn))

      if (slots[ 'before-options' ] !== void 0) {
        options = slots[ 'before-options' ]().concat(options)
      }

      return hMergeSlot(slots[ 'after-options' ], options)
    }

    function getInput (fromDialog, isTarget) {
      const data = {
        ref: isTarget === true ? targetRef : void 0,
        key: 'i_t',
        class: computedInputClass.value,
        style: props.inputStyle,
        value: inputValue.value !== void 0 ? inputValue.value : '',
        // required for Android in order to show ENTER key when in form
        type: 'search',
        ...comboboxAttrs.value,
        ...state.splitAttrs.attributes.value,
        id: state.targetUid.value,
        maxlength: props.maxlength,
        autocomplete: props.autocomplete,
        'data-autofocus': (fromDialog !== true && props.autofocus === true) || void 0,
        disabled: props.disable === true,
        readonly: props.readonly === true,
        ...inputControlEvents.value
      }

      if (fromDialog !== true && hasDialog === true) {
        if (Array.isArray(data.class) === true) {
          data.class[ 0 ] += ' no-pointer-events'
        }
        else {
          data.class += ' no-pointer-events'
        }
      }

      return h('input', data)
    }

    function onInput (e) {
      clearTimeout(inputTimer)

      if (e && e.target && e.target.composing === true) {
        return
      }

      setInputValue(e.target.value || '')
      // mark it here as user input so that if updateInputValue is called
      // before filter is called the indicator is reset
      userInputValue = true
      defaultInputValue = inputValue.value

      if (
        state.focused.value !== true
        && (hasDialog !== true || dialogFieldFocused.value === true)
      ) {
        state.focus()
      }

      if (props.onFilter !== void 0) {
        inputTimer = setTimeout(() => {
          filter(inputValue.value)
        }, props.inputDebounce)
      }
    }

    function setInputValue (val) {
      if (inputValue.value !== val) {
        inputValue.value = val
        emit('input-value', val)
      }
    }

    function updateInputValue (val, noFiltering, internal) {
      userInputValue = internal !== true

      if (props.useInput === true) {
        setInputValue(val)

        if (noFiltering === true || internal !== true) {
          defaultInputValue = val
        }

        noFiltering !== true && filter(val)
      }
    }

    function filter (val, keepClosed) {
      if (props.onFilter === void 0 || (keepClosed !== true && state.focused.value !== true)) {
        return
      }

      if (state.innerLoading.value === true) {
        emit('filter-abort')
      }
      else {
        state.innerLoading.value = true
        innerLoadingIndicator.value = true
      }

      if (
        val !== ''
        && props.multiple !== true
        && innerValue.value.length > 0
        && userInputValue !== true
        && val === getOptionLabel.value(innerValue.value[ 0 ])
      ) {
        val = ''
      }

      const localFilterId = setTimeout(() => {
        menu.value === true && (menu.value = false)
      }, 10)

      clearTimeout(filterId)
      filterId = localFilterId

      emit(
        'filter',
        val,
        (fn, afterFn) => {
          if ((keepClosed === true || state.focused.value === true) && filterId === localFilterId) {
            clearTimeout(filterId)

            typeof fn === 'function' && fn()

            // hide indicator to allow arrow to animate
            innerLoadingIndicator.value = false

            nextTick(() => {
              state.innerLoading.value = false

              if (state.editable.value === true) {
                if (keepClosed === true) {
                  menu.value === true && hidePopup()
                }
                else if (menu.value === true) {
                  updateMenu(true)
                }
                else {
                  menu.value = true
                }
              }

              typeof afterFn === 'function' && nextTick(() => { afterFn(proxy) })
            })
          }
        },
        () => {
          if (state.focused.value === true && filterId === localFilterId) {
            clearTimeout(filterId)
            state.innerLoading.value = false
            innerLoadingIndicator.value = false
          }
          menu.value === true && (menu.value = false)
        }
      )
    }

    function getMenu () {
      return h(QMenu, {
        ref: menuRef,
        class: menuContentClass.value,
        style: props.popupContentStyle,
        modelValue: menu.value,
        fit: props.menuShrink !== true,
        cover: props.optionsCover === true && noOptions.value !== true && props.useInput !== true,
        anchor: props.menuAnchor,
        self: props.menuSelf,
        offset: props.menuOffset,
        dark: isOptionsDark.value,
        noParentEvent: true,
        noRefocus: true,
        noFocus: true,
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
      }, getAllOptions)
    }

    function onMenuBeforeHide (e) {
      onControlPopupHide(e)
      closeMenu()
    }

    function onMenuShow () {
      setVirtualScrollSize()
    }

    function onDialogFieldFocus (e) {
      stop(e)
      targetRef.value !== null && targetRef.value.focus()
      dialogFieldFocused.value = true
      window.scrollTo(window.pageXOffset || window.scrollX || document.body.scrollLeft || 0, 0)
    }

    function onDialogFieldBlur (e) {
      stop(e)
      nextTick(() => {
        dialogFieldFocused.value = false
      })
    }

    function getDialog () {
      const content = [
        h(QField, {
          class: `col-auto ${ state.fieldClass }`,
          ...innerFieldProps.value,
          for: state.targetUid.value,
          dark: isOptionsDark.value,
          square: true,
          loading: innerLoadingIndicator.value,
          itemAligned: false,
          filled: true,
          stackLabel: inputValue.value.length > 0,
          ...state.splitAttrs.listeners.value,
          onFocus: onDialogFieldFocus,
          onBlur: onDialogFieldBlur
        }, {
          ...slots,
          rawControl: () => state.getControl(true),
          before: void 0,
          after: void 0
        })
      ]

      menu.value === true && content.push(
        h('div', {
          ref: menuContentRef,
          class: menuContentClass.value + ' scroll',
          style: props.popupContentStyle,
          ...listboxAttrs.value,
          onClick: prevent,
          onScrollPassive: onVirtualScrollEvt
        }, getAllOptions())
      )

      return h(QDialog, {
        ref: dialogRef,
        modelValue: dialog.value,
        position: props.useInput === true ? 'top' : void 0,
        transitionShow: transitionShowComputed,
        transitionHide: props.transitionHide,
        transitionDuration: props.transitionDuration,
        onBeforeShow: onControlPopupShow,
        onBeforeHide: onDialogBeforeHide,
        onHide: onDialogHide,
        onShow: onDialogShow
      }, () => h('div', {
        class: 'q-select__dialog'
          + (isOptionsDark.value === true ? ' q-select__dialog--dark q-dark' : '')
          + (dialogFieldFocused.value === true ? ' q-select__dialog--focused' : '')
      }, content))
    }

    function onDialogBeforeHide (e) {
      onControlPopupHide(e)

      if (dialogRef.value !== null) {
        dialogRef.value.__updateRefocusTarget(
          state.rootRef.value.querySelector('.q-field__native > [tabindex]:last-child')
        )
      }

      state.focused.value = false
    }

    function onDialogHide (e) {
      hidePopup()
      state.focused.value === false && emit('blur', e)
      resetInputValue()
    }

    function onDialogShow () {
      const el = document.activeElement
      if (
        (el === null || el.id !== state.targetUid.value)
        && targetRef.value !== null
        && targetRef.value !== el
      ) {
        targetRef.value.focus()
      }

      setVirtualScrollSize()
    }

    function closeMenu () {
      if (dialog.value === true) {
        return
      }

      optionIndex.value = -1

      if (menu.value === true) {
        menu.value = false
      }

      if (state.focused.value === false) {
        clearTimeout(filterId)
        filterId = void 0

        if (state.innerLoading.value === true) {
          emit('filter-abort')
          state.innerLoading.value = false
          innerLoadingIndicator.value = false
        }
      }
    }

    function showPopup (e) {
      if (state.editable.value !== true) {
        return
      }

      if (hasDialog === true) {
        state.onControlFocusin(e)
        dialog.value = true
        nextTick(() => {
          state.focus()
        })
      }
      else {
        state.focus()
      }

      if (props.onFilter !== void 0) {
        filter(inputValue.value)
      }
      else if (noOptions.value !== true || slots[ 'no-option' ] !== void 0) {
        menu.value = true
      }
    }

    function hidePopup () {
      dialog.value = false
      closeMenu()
    }

    function resetInputValue () {
      props.useInput === true && updateInputValue(
        props.multiple !== true && props.fillInput === true && innerValue.value.length > 0
          ? getOptionLabel.value(innerValue.value[ 0 ]) || ''
          : '',
        true,
        true
      )
    }

    function updateMenu (show) {
      let optionIndex = -1

      if (show === true) {
        if (innerValue.value.length > 0) {
          const val = getOptionValue.value(innerValue.value[ 0 ])
          optionIndex = props.options.findIndex(v => isDeepEqual(getOptionValue.value(v), val))
        }

        localResetVirtualScroll(optionIndex)
      }

      setOptionIndex(optionIndex)
    }

    function updateMenuPosition () {
      if (dialog.value === false && menuRef.value !== null) {
        menuRef.value.updatePosition()
      }
    }

    function onControlPopupShow (e) {
      e !== void 0 && stop(e)
      emit('popup-show', e)
      state.hasPopupOpen.value = true
      state.onControlFocusin(e)
    }

    function onControlPopupHide (e) {
      e !== void 0 && stop(e)
      emit('popup-hide', e)
      state.hasPopupOpen.value = false
      state.onControlFocusout(e)
    }

    function updatePreState () {
      hasDialog = $q.platform.is.mobile !== true && props.behavior !== 'dialog'
        ? false
        : props.behavior !== 'menu' && (
          props.useInput === true
            ? slots[ 'no-option' ] !== void 0 || props.onFilter !== void 0 || noOptions.value === false
            : true
        )

      transitionShowComputed = $q.platform.is.ios === true && hasDialog === true && props.useInput === true
        ? 'fade'
        : props.transitionShow
    }

    onBeforeUpdate(updatePreState)
    onUpdated(updateMenuPosition)

    updatePreState()

    onBeforeUnmount(() => {
      clearTimeout(inputTimer)
    })

    // expose public methods
    Object.assign(proxy, {
      showPopup, hidePopup,
      removeAtIndex, add, toggleOption,
      setOptionIndex, moveOptionSelection,
      filter, updateMenuPosition, updateInputValue,
      isOptionSelected,
      getEmittingOptionValue,
      isOptionDisabled: (...args) => isOptionDisabled.value.apply(null, args),
      getOptionValue: (...args) => getOptionValue.value.apply(null, args),
      getOptionLabel: (...args) => getOptionLabel.value.apply(null, args)
    })

    Object.assign(state, {
      innerValue,

      fieldClass: computed(() =>
        `q-select q-field--auto-height q-select--with${ props.useInput !== true ? 'out' : '' }-input`
        + ` q-select--with${ props.useChips !== true ? 'out' : '' }-chips`
        + ` q-select--${ props.multiple === true ? 'multiple' : 'single' }`
      ),

      inputRef,
      targetRef,
      hasValue,
      showPopup,

      floatingLabel: computed(() =>
        (props.hideSelected === true
          ? inputValue.value.length > 0
          : hasValue.value === true
        )
        || fieldValueIsFilled(props.displayValue)
      ),

      getControlChild: () => {
        if (
          state.editable.value !== false && (
            dialog.value === true // dialog always has menu displayed, so need to render it
            || noOptions.value !== true
            || slots[ 'no-option' ] !== void 0
          )
        ) {
          return hasDialog === true ? getDialog() : getMenu()
        }
      },

      controlEvents: {
        onFocusin (e) { state.onControlFocusin(e) },
        onFocusout (e) {
          state.onControlFocusout(e, () => {
            resetInputValue()
            closeMenu()
          })
        },
        onClick (e) {
          // label from QField will propagate click on the input
          prevent(e)

          if (hasDialog !== true && menu.value === true) {
            closeMenu()
            targetRef.value !== null && targetRef.value.focus()
            return
          }

          showPopup(e)
        }
      },

      getControl: fromDialog => {
        const child = getSelection()
        const isTarget = fromDialog === true || dialog.value !== true || hasDialog !== true

        if (props.useInput === true) {
          child.push(getInput(fromDialog, isTarget))
        }
        // there can be only one (when dialog is opened the control in dialog should be target)
        else if (state.editable.value === true && isTarget === true) {
          child.push(
            h('div', {
              ref: targetRef,
              key: 'd_t',
              class: 'no-outline',
              id: state.targetUid.value,
              ...comboboxAttrs.value,
              onKeydown: onTargetKeydown,
              onKeyup: onTargetKeyup,
              onKeypress: onTargetKeypress
            })
          )

          if (typeof props.autocomplete === 'string' && props.autocomplete.length > 0) {
            child.push(
              h('input', {
                class: 'q-select__autocomplete-input no-outline',
                autocomplete: props.autocomplete,
                onKeyup: onTargetAutocomplete
              })
            )
          }
        }

        if (nameProp.value !== void 0 && props.disable !== true && innerOptionsValue.value.length > 0) {
          const opts = innerOptionsValue.value.map(value => h('option', { value, selected: true }))

          child.push(
            h('select', {
              class: 'hidden',
              name: nameProp.value,
              multiple: props.multiple
            }, opts)
          )
        }

        return h('div', {
          class: 'q-field__native row items-center',
          ...state.splitAttrs.attributes.value
        }, child)
      },

      getInnerAppend: () => (
        props.loading !== true && innerLoadingIndicator.value !== true && props.hideDropdownIcon !== true
          ? [
              h(QIcon, {
                class: 'q-select__dropdown-icon' + (menu.value === true ? ' rotate-180' : ''),
                name: dropdownArrowIcon.value
              })
            ]
          : null
      )
    })

    return useField(state)
  }
})
