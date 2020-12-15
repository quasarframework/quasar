import { h, defineComponent } from 'vue'

import QField from '../field/QField.js'
import QIcon from '../icon/QIcon.js'
import QChip from '../chip/QChip.js'

import QItem from '../item/QItem.js'
import QItemSection from '../item/QItemSection.js'
import QItemLabel from '../item/QItemLabel.js'

import QMenu from '../menu/QMenu.js'
import QDialog from '../dialog/QDialog.js'

import { isDeepEqual } from '../../utils/is.js'
import { stop, prevent, stopAndPrevent } from '../../utils/event.js'
import { normalizeToInterval } from '../../utils/format.js'
import { shouldIgnoreKey, isKeyCode } from '../../utils/key-composition.js'
import { hMergeSlot } from '../../utils/render.js'

import { FormFieldMixin } from '../../mixins/form.js'
import VirtualScroll from '../../mixins/virtual-scroll.js'
import CompositionMixin from '../../mixins/composition.js'

const validateNewValueMode = v => [ 'add', 'add-unique', 'toggle' ].includes(v)
const reEscapeList = '.*+?^${}()|[]\\'

export default defineComponent({
  name: 'QSelect',

  inheritAttrs: false,

  mixins: [
    QField,
    VirtualScroll,
    CompositionMixin,
    FormFieldMixin
  ],

  props: {
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

    behavior: {
      type: String,
      validator: v => [ 'default', 'menu', 'dialog' ].includes(v),
      default: 'default'
    },

    virtualScrollItemSize: {
      type: [ Number, String ],
      default: void 0
    }
  },

  emits: [
    'add', 'remove', 'new-value', 'input-value',
    'keyup', 'keypress', 'keydown',
    'filter-abort', 'filter'
  ],

  data () {
    return {
      menu: false,
      dialog: false,
      optionIndex: -1,
      inputValue: '',
      dialogFieldFocused: false
    }
  },

  watch: {
    innerValue: {
      handler (val) {
        this.innerValueCache = val

        if (
          this.useInput === true &&
          this.fillInput === true &&
          this.multiple !== true &&
          // Prevent re-entering in filter while filtering
          // Also prevent clearing inputValue while filtering
          this.innerLoading !== true &&
          ((this.dialog !== true && this.menu !== true) || this.hasValue !== true)
        ) {
          this.userInputValue !== true && this.__resetInputValue()
          if (this.dialog === true || this.menu === true) {
            this.filter('')
          }
        }
      },
      immediate: true
    },

    fillInput: '__resetInputValue',

    menu: '__updateMenu'
  },

  computed: {
    isOptionsDark () {
      return this.optionsDark === null
        ? this.isDark
        : this.optionsDark
    },

    virtualScrollLength () {
      return Array.isArray(this.options)
        ? this.options.length
        : 0
    },

    fieldClass () {
      return `q-select q-field--auto-height q-select--with${this.useInput !== true ? 'out' : ''}-input` +
        ` q-select--with${this.useChips !== true ? 'out' : ''}-chips` +
        ` q-select--${this.multiple === true ? 'multiple' : 'single'}`
    },

    computedInputClass () {
      let cls = 'q-field__input q-placeholder col'

      if (this.hideSelected === true || this.innerValue.length === 0) {
        return [ cls, this.inputClass ]
      }

      cls += ' q-field__input--padding'

      return this.inputClass === void 0
        ? cls
        : [ cls, this.inputClass ]
    },

    menuContentClass () {
      return (this.virtualScrollHorizontal === true ? 'q-virtual-scroll--horizontal' : '') +
        (this.popupContentClass ? ' ' + this.popupContentClass : '')
    },

    innerValue () {
      const
        mapNull = this.mapOptions === true && this.multiple !== true,
        val = this.modelValue !== void 0 && (this.modelValue !== null || mapNull === true)
          ? (this.multiple === true && Array.isArray(this.modelValue) ? this.modelValue : [this.modelValue])
          : []

      if (this.mapOptions === true && Array.isArray(this.options) === true) {
        const cache = this.mapOptions === true && this.innerValueCache !== void 0
          ? this.innerValueCache
          : []
        const values = val.map(v => this.__getOption(v, cache))

        return this.modelValue === null && mapNull === true
          ? values.filter(v => v !== null)
          : values
      }

      return val
    },

    noOptions () {
      return this.virtualScrollLength === 0
    },

    selectedString () {
      return this.innerValue
        .map(opt => this.getOptionLabel(opt))
        .join(', ')
    },

    needsHtmlFn () {
      return this.optionsHtml === true
        ? () => true
        : opt => opt !== void 0 && opt !== null && opt.html === true
    },

    valueAsHtml () {
      return this.displayValueHtml === true || (
        this.displayValue === void 0 && (
          this.optionsHtml === true ||
          this.innerValue.some(this.needsHtmlFn)
        )
      )
    },

    computedTabindex () {
      return this.focused === true ? this.tabindex : -1
    },

    selectedScope () {
      return this.innerValue.map((opt, i) => ({
        index: i,
        opt,
        html: this.needsHtmlFn(opt),
        selected: true,
        removeAtIndex: this.__removeAtIndexAndFocus,
        toggleOption: this.toggleOption,
        tabindex: this.computedTabindex
      }))
    },

    optionScope () {
      if (this.virtualScrollLength === 0) {
        return []
      }

      const { from, to } = this.virtualScrollSliceRange
      const { options, optionEls } = this.__optionScopeCache

      return this.options.slice(from, to).map((opt, i) => {
        const disable = this.isOptionDisabled(opt) === true
        const index = from + i

        const itemProps = {
          clickable: true,
          active: false,
          activeClass: this.computedOptionsSelectedClass,
          manualFocus: true,
          focused: false,
          disable,
          tabindex: -1,
          dense: this.optionsDense,
          dark: this.isOptionsDark,
          onClick: () => { this.toggleOption(opt) }
        }

        if (disable !== true) {
          this.isOptionSelected(opt) === true && (itemProps.active = true)
          this.optionIndex === index && (itemProps.focused = true)

          if (this.$q.platform.is.desktop === true) {
            itemProps.onMousemove = () => { this.setOptionIndex(index) }
          }
        }

        const option = {
          index,
          opt,
          html: this.needsHtmlFn(opt),
          label: this.getOptionLabel(opt),
          selected: itemProps.active,
          focused: itemProps.focused,
          toggleOption: this.toggleOption,
          setOptionIndex: this.setOptionIndex,
          itemProps
        }

        const optionWithoutEvents = {
          ...option,
          itemProps: {
            ...itemProps,
            onClick: void 0,
            onMousemove: void 0
          }
        }

        if (options[i] === void 0 || isDeepEqual(optionWithoutEvents, options[i]) !== true) {
          options[i] = optionWithoutEvents
          optionEls[i] = void 0
        }

        return option
      })
    },

    dropdownArrowIcon () {
      return this.dropdownIcon !== void 0
        ? this.dropdownIcon
        : this.$q.iconSet.arrow.dropdown
    },

    squaredMenu () {
      return this.optionsCover === false &&
        this.outlined !== true &&
        this.standout !== true &&
        this.borderless !== true &&
        this.rounded !== true
    },

    computedOptionsSelectedClass () {
      return this.optionsSelectedClass !== void 0
        ? this.optionsSelectedClass
        : (this.color !== void 0 ? `text-${this.color}` : '')
    },

    innerOptionsValue () {
      return this.innerValue.map(opt => this.getOptionValue(opt))
    },

    // returns method to get value of an option;
    // takes into account 'option-value' prop
    getOptionValue () {
      return this.__getPropValueFn('optionValue', 'value')
    },

    // returns method to get label of an option;
    // takes into account 'option-label' prop
    getOptionLabel () {
      return this.__getPropValueFn('optionLabel', 'label')
    },

    // returns method to tell if an option is disabled;
    // takes into account 'option-disable' prop
    isOptionDisabled () {
      return this.__getPropValueFn('optionDisable', 'disable')
    },

    inputControlEvents () {
      const evt = {
        onInput: this.__onInput,
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        onChange: this.__onChange,
        onKeydown: this.__onTargetKeydown,
        onKeyup: this.__onTargetAutocomplete,
        onKeypress: this.__onTargetKeypress,
        onFocus: this.__selectInputText,
        onClick: e => {
          this.hasDialog === true && stop(e)
        }
      }

      evt.onCompositionstart = evt.onCompositionupdate = evt.onCompositionend = this.__onComposition

      return evt
    },

    virtualScrollItemSizeComputed () {
      return this.virtualScrollItemSize === void 0
        ? (this.dense === true ? 24 : 48)
        : this.virtualScrollItemSize
    }
  },

  methods: {
    getEmittingOptionValue (opt) {
      return this.emitValue === true
        ? this.getOptionValue(opt)
        : opt
    },

    removeAtIndex (index) {
      if (index > -1 && index < this.innerValue.length) {
        if (this.multiple === true) {
          const model = this.modelValue.slice()
          this.$emit('remove', { index, value: model.splice(index, 1)[ 0 ] })
          this.$emit('update:modelValue', model)
        }
        else {
          this.$emit('update:modelValue', null)
        }
      }
    },

    __removeAtIndexAndFocus (index) {
      this.removeAtIndex(index)
      this.__focus()
    },

    add (opt, unique) {
      const val = this.getEmittingOptionValue(opt)

      if (this.multiple !== true) {
        this.fillInput === true && this.updateInputValue(
          this.getOptionLabel(opt),
          true,
          true
        )

        this.$emit('update:modelValue', val)
        return
      }

      if (this.innerValue.length === 0) {
        this.$emit('add', { index: 0, value: val })
        this.$emit('update:modelValue', this.multiple === true ? [val] : val)
        return
      }

      if (unique === true && this.isOptionSelected(opt) === true) {
        return
      }

      if (this.maxValues !== void 0 && this.modelValue.length >= this.maxValues) {
        return
      }

      const model = this.modelValue.slice()

      this.$emit('add', { index: model.length, value: val })
      model.push(val)
      this.$emit('update:modelValue', model)
    },

    toggleOption (opt, keepOpen) {
      if (this.editable !== true || opt === void 0 || this.isOptionDisabled(opt) === true) {
        return
      }

      const optValue = this.getOptionValue(opt)

      if (this.multiple !== true) {
        if (keepOpen !== true) {
          this.updateInputValue(
            this.fillInput === true ? this.getOptionLabel(opt) : '',
            true,
            true
          )

          this.hidePopup()
        }

        this.$refs.target && this.$refs.target.focus()

        if (isDeepEqual(this.getOptionValue(this.innerValue[ 0 ]), optValue) !== true) {
          this.$emit('update:modelValue', this.emitValue === true ? optValue : opt)
        }
        return
      }

      (this.hasDialog !== true || this.dialogFieldFocused === true) && this.__focus()

      this.__selectInputText()

      if (this.innerValue.length === 0) {
        const val = this.emitValue === true ? optValue : opt
        this.$emit('add', { index: 0, value: val })
        this.$emit('update:modelValue', this.multiple === true ? [val] : val)
        return
      }

      const
        model = this.modelValue.slice(),
        index = this.innerOptionsValue.findIndex(v => isDeepEqual(v, optValue))

      if (index > -1) {
        this.$emit('remove', { index, value: model.splice(index, 1)[ 0 ] })
      }
      else {
        if (this.maxValues !== void 0 && model.length >= this.maxValues) {
          return
        }

        const val = this.emitValue === true ? optValue : opt

        this.$emit('add', { index: model.length, value: val })
        model.push(val)
      }

      this.$emit('update:modelValue', model)
    },

    setOptionIndex (index) {
      if (this.$q.platform.is.desktop !== true) { return }

      const val = index > -1 && index < this.virtualScrollLength
        ? index
        : -1

      if (this.optionIndex !== val) {
        this.optionIndex = val
      }
    },

    moveOptionSelection (offset = 1, skipInputValue) {
      if (this.menu === true) {
        let index = this.optionIndex
        do {
          index = normalizeToInterval(
            index + offset,
            -1,
            this.virtualScrollLength - 1
          )
        }
        while (index !== -1 && index !== this.optionIndex && this.isOptionDisabled(this.options[ index ]) === true)

        if (this.optionIndex !== index) {
          this.setOptionIndex(index)
          this.scrollTo(index)

          if (skipInputValue !== true && this.useInput === true && this.fillInput === true) {
            this.__setInputValue(index >= 0
              ? this.getOptionLabel(this.options[ index ])
              : this.defaultInputValue
            )
          }
        }
      }
    },

    __getOption (value, innerValueCache) {
      const fn = opt => isDeepEqual(this.getOptionValue(opt), value)
      return this.options.find(fn) || innerValueCache.find(fn) || value
    },

    __getPropValueFn (propName, defaultVal) {
      const val = this[ propName ] !== void 0
        ? this[ propName ]
        : defaultVal

      return typeof val === 'function'
        ? val
        : opt => Object(opt) === opt && val in opt
          ? opt[ val ]
          : opt
    },

    isOptionSelected (opt) {
      const val = this.getOptionValue(opt)
      return this.innerOptionsValue.find(v => isDeepEqual(v, val)) !== void 0
    },

    __selectInputText () {
      if (this.useInput === true && this.$refs.target) {
        this.$refs.target.select()
      }
    },

    __onTargetKeyup (e) {
      // if ESC and we have an opened menu
      // then stop propagation (might be caught by a QDialog
      // and so it will also close the QDialog, which is wrong)
      if (isKeyCode(e, 27) === true && this.menu === true) {
        stop(e)
        // on ESC we need to close the dialog also
        this.hidePopup()
        this.__resetInputValue()
      }

      this.$emit('keyup', e)
    },

    __onTargetAutocomplete (e) {
      const { value } = e.target

      if (e.keyCode !== void 0) {
        this.__onTargetKeyup(e)
        return
      }

      e.target.value = ''
      clearTimeout(this.inputTimer)
      this.__resetInputValue()

      if (typeof value === 'string' && value.length > 0) {
        const needle = value.toLocaleLowerCase()

        let fn = opt => this.getOptionValue(opt).toLocaleLowerCase() === needle
        let option = this.options.find(fn)

        if (option !== void 0) {
          if (this.innerValue.indexOf(option) === -1) {
            this.toggleOption(option)
          }
          else {
            this.hidePopup()
          }
        }
        else {
          fn = opt => this.getOptionLabel(opt).toLocaleLowerCase() === needle
          option = this.options.find(fn)

          if (option !== void 0) {
            if (this.innerValue.indexOf(option) === -1) {
              this.toggleOption(option)
            }
            else {
              this.hidePopup()
            }
          }
          else {
            this.filter(value, true)
          }
        }
      }
      else {
        this.__clearValue(e)
      }
    },

    __onTargetKeypress (e) {
      this.$emit('keypress', e)
    },

    __onTargetKeydown (e) {
      this.$emit('keydown', e)

      if (shouldIgnoreKey(e) === true) {
        return
      }

      const newValueModeValid = this.inputValue.length > 0 &&
        (this.newValueMode !== void 0 || this.emitListeners.onNewValue === true)
      const tabShouldSelect = e.shiftKey !== true &&
        this.multiple !== true &&
        (this.optionIndex > -1 || newValueModeValid === true)

      // escape
      if (e.keyCode === 27) {
        prevent(e) // prevent clearing the inputValue
        return
      }

      // tab
      if (e.keyCode === 9 && tabShouldSelect === false) {
        this.__closeMenu()
        return
      }

      if (e.target === void 0 || e.target.id !== this.targetUid) { return }

      // down
      if (
        e.keyCode === 40 &&
        this.innerLoading !== true &&
        this.menu === false
      ) {
        stopAndPrevent(e)
        this.showPopup()
        return
      }

      // backspace
      if (
        e.keyCode === 8 &&
        this.hideSelected !== true &&
        this.inputValue.length === 0
      ) {
        if (this.multiple === true && Array.isArray(this.modelValue) === true) {
          this.removeAtIndex(this.modelValue.length - 1)
        }
        else if (this.multiple !== true && this.modelValue !== null) {
          this.$emit('update:modelValue', null)
        }
        return
      }

      // home, end - 36, 35
      if (
        (e.keyCode === 35 || e.keyCode === 36) &&
        (typeof this.inputValue !== 'string' || this.inputValue.length === 0)
      ) {
        stopAndPrevent(e)
        this.optionIndex = -1
        this.moveOptionSelection(e.keyCode === 36 ? 1 : -1, this.multiple)
      }

      // pg up, pg down - 33, 34
      if (
        (e.keyCode === 33 || e.keyCode === 34) &&
        this.virtualScrollSliceSizeComputed !== void 0
      ) {
        stopAndPrevent(e)
        this.optionIndex = Math.max(
          -1,
          Math.min(
            this.virtualScrollLength,
            this.optionIndex + (e.keyCode === 33 ? -1 : 1) * this.virtualScrollSliceSizeComputed.view
          )
        )
        this.moveOptionSelection(e.keyCode === 33 ? 1 : -1, this.multiple)
      }

      // up, down
      if (e.keyCode === 38 || e.keyCode === 40) {
        stopAndPrevent(e)
        this.moveOptionSelection(e.keyCode === 38 ? -1 : 1, this.multiple)
      }

      const optionsLength = this.virtualScrollLength

      // clear search buffer if expired
      if (this.searchBuffer === void 0 || this.searchBufferExp < Date.now()) {
        this.searchBuffer = ''
      }

      // keyboard search when not having use-input
      if (
        optionsLength > 0 &&
        this.useInput !== true &&
        e.key !== void 0 &&
        e.key.length === 1 && // printable char
        e.altKey === e.ctrlKey && // not kbd shortcut
        (e.keyCode !== 32 || this.searchBuffer.length > 0) // space in middle of search
      ) {
        this.menu !== true && this.showPopup(e)

        const
          char = e.key.toLocaleLowerCase(),
          keyRepeat = this.searchBuffer.length === 1 && this.searchBuffer[ 0 ] === char

        this.searchBufferExp = Date.now() + 1500
        if (keyRepeat === false) {
          stopAndPrevent(e)
          this.searchBuffer += char
        }

        const searchRe = new RegExp('^' + this.searchBuffer.split('').map(l => reEscapeList.indexOf(l) > -1 ? '\\' + l : l).join('.*'), 'i')

        let index = this.optionIndex

        if (keyRepeat === true || index < 0 || searchRe.test(this.getOptionLabel(this.options[ index ])) !== true) {
          do {
            index = normalizeToInterval(index + 1, -1, optionsLength - 1)
          }
          while (index !== this.optionIndex && (
            this.isOptionDisabled(this.options[ index ]) === true ||
            searchRe.test(this.getOptionLabel(this.options[ index ])) !== true
          ))
        }

        if (this.optionIndex !== index) {
          this.$nextTick(() => {
            this.setOptionIndex(index)
            this.scrollTo(index)

            if (index >= 0 && this.useInput === true && this.fillInput === true) {
              this.__setInputValue(this.getOptionLabel(this.options[ index ]))
            }
          })
        }

        return
      }

      // enter, space (when not using use-input and not in search), or tab (when not using multiple and option selected)
      // same target is checked above
      if (
        e.keyCode !== 13 &&
        (e.keyCode !== 32 || this.useInput === true || this.searchBuffer !== '') &&
        (e.keyCode !== 9 || tabShouldSelect === false)
      ) { return }

      e.keyCode !== 9 && stopAndPrevent(e)

      if (this.optionIndex > -1 && this.optionIndex < optionsLength) {
        this.toggleOption(this.options[ this.optionIndex ])
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
            mode = this.newValueMode
          }

          if (val === void 0 || val === null) {
            return
          }

          this.updateInputValue('', this.multiple !== true, true)

          this[ mode === 'toggle' ? 'toggleOption' : 'add' ](
            val,
            mode === 'add-unique'
          )

          if (this.multiple !== true) {
            this.$refs.target && this.$refs.target.focus()
            this.hidePopup()
          }
        }

        if (this.emitListeners.onNewValue === true) {
          this.$emit('new-value', this.inputValue, done)
        }
        else {
          done(this.inputValue)
        }

        if (this.multiple !== true) {
          return
        }
      }

      if (this.menu === true) {
        this.__closeMenu()
      }
      else if (this.innerLoading !== true) {
        this.showPopup()
      }
    },

    __getVirtualScrollEl () {
      return this.hasDialog === true
        ? this.$refs.menuContent
        : (
            this.$refs.menu && this.$refs.menu.quasarPortalInnerRef.value
              ? this.$refs.menu.quasarPortalInnerRef.value
              : void 0
          )
    },

    __getVirtualScrollTarget () {
      return this.__getVirtualScrollEl()
    },

    __getSelection () {
      if (this.hideSelected === true) {
        return []
      }

      if (this.$slots[ 'selected-item' ] !== void 0) {
        return this.selectedScope.map(scope => this.$slots[ 'selected-item' ](scope)).slice()
      }

      if (this.$slots.selected !== void 0) {
        return this.$slots.selected().slice()
      }

      if (this.useChips === true) {
        return this.selectedScope.map((scope, i) => h(QChip, {
          key: 'option-' + i,
          removable: this.editable === true && this.isOptionDisabled(scope.opt) !== true,
          dense: true,
          textColor: this.color,
          tabindex: this.computedTabindex,
          onRemove () { scope.removeAtIndex(i) }
        }, () => h('span', {
          class: 'ellipsis',
          [ scope.html === true ? 'innerHTML' : 'textContent' ]: this.getOptionLabel(scope.opt)
        })))
      }

      return [
        h('span', {
          [ this.valueAsHtml === true ? 'innerHTML' : 'textContent' ]: this.displayValue !== void 0
            ? this.displayValue
            : this.selectedString
        })
      ]
    },

    __getOptions () {
      if (
        this.$slots.option !== void 0 &&
        this.__optionScopeCache.optionSlot !== this.$slots.option
      ) {
        this.__optionScopeCache.optionSlot = this.$slots.option
        this.__optionScopeCache.optionEls = []
      }

      const fn = this.$slots.option !== void 0
        ? this.$slots.option
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

      const { optionEls } = this.__optionScopeCache

      let options = this.__padVirtualScroll('div', this.optionScope.map((scope, i) => {
        if (optionEls[i] === void 0) {
          optionEls[i] = fn(scope)
        }

        return optionEls[i]
      }))

      if (this.$slots[ 'before-options' ] !== void 0) {
        options = this.$slots[ 'before-options' ]().concat(options)
      }

      return hMergeSlot(this, 'after-options', options)
    },

    __getInput (fromDialog, isTarget) {
      const data = {
        ref: isTarget === true ? 'target' : void 0,
        key: 'i_t',
        class: this.computedInputClass,
        style: this.inputStyle,
        value: this.inputValue !== void 0 ? this.inputValue : '',
        // required for Android in order to show ENTER key when in form
        type: 'search',
        ...this.qAttrs,
        id: this.targetUid,
        maxlength: this.maxlength, // this is converted to prop by QField
        tabindex: this.tabindex,
        autocomplete: this.autocomplete,
        'data-autofocus': fromDialog === true ? false : this.autofocus,
        disabled: this.disable === true,
        readonly: this.readonly === true,
        ...this.inputControlEvents
      }

      if (fromDialog !== true && this.hasDialog === true) {
        if (Array.isArray(data.class) === true) {
          data.class[ 0 ] += ' no-pointer-events'
        }
        else {
          data.class += ' no-pointer-events'
        }
      }

      return h('input', data)
    },

    __onChange (e) {
      this.__onComposition(e)
    },

    __onInput (e) {
      clearTimeout(this.inputTimer)

      if (e && e.target && e.target.composing === true) {
        return
      }

      this.__setInputValue(e.target.value || '')
      // mark it here as user input so that if updateInputValue is called
      // before filter is called the indicator is reset
      this.userInputValue = true
      this.defaultInputValue = this.inputValue

      if (
        this.focused !== true &&
        (this.hasDialog !== true || this.dialogFieldFocused === true)
      ) {
        this.__focus()
      }

      if (this.emitListeners.onFilter === true) {
        this.inputTimer = setTimeout(() => {
          this.filter(this.inputValue)
        }, this.inputDebounce)
      }
    },

    __setInputValue (inputValue) {
      if (this.inputValue !== inputValue) {
        this.inputValue = inputValue
        this.$emit('input-value', inputValue)
      }
    },

    updateInputValue (val, noFiltering, internal) {
      this.userInputValue = internal !== true

      if (this.useInput === true) {
        this.__setInputValue(val)

        if (noFiltering === true || internal !== true) {
          this.defaultInputValue = val
        }

        noFiltering !== true && this.filter(val)
      }
    },

    filter (val, keepClosed) {
      if (this.emitListeners.onFilter === void 0 || (keepClosed !== true && this.focused !== true)) {
        return
      }

      if (this.innerLoading === true) {
        this.$emit('filter-abort')
      }
      else {
        this.innerLoading = true
        this.innerLoadingIndicator = true
      }

      if (
        val !== '' &&
        this.multiple !== true &&
        this.innerValue.length > 0 &&
        this.userInputValue !== true &&
        val === this.getOptionLabel(this.innerValue[ 0 ])
      ) {
        val = ''
      }

      const filterId = setTimeout(() => {
        this.menu === true && (this.menu = false)
      }, 10)
      clearTimeout(this.filterId)
      this.filterId = filterId

      this.$emit(
        'filter',
        val,
        (fn, afterFn) => {
          if ((keepClosed === true || this.focused === true) && this.filterId === filterId) {
            clearTimeout(this.filterId)

            typeof fn === 'function' && fn()

            // hide indicator to allow arrow to animate
            this.innerLoadingIndicator = false

            this.$nextTick(() => {
              this.innerLoading = false

              if (this.editable === true) {
                if (keepClosed === true) {
                  this.menu === true && this.hidePopup()
                }
                else if (this.menu === true) {
                  this.__updateMenu(true)
                }
                else {
                  this.menu = true
                }
              }

              typeof afterFn === 'function' && this.$nextTick(() => { afterFn(this) })
            })
          }
        },
        () => {
          if (this.focused === true && this.filterId === filterId) {
            clearTimeout(this.filterId)
            this.innerLoading = false
            this.innerLoadingIndicator = false
          }
          this.menu === true && (this.menu = false)
        }
      )
    },

    __getControlEvents () {
      const onFocusout = e => {
        this.__onControlFocusout(e, () => {
          this.__resetInputValue()
          this.__closeMenu()
        })
      }

      return {
        onFocusin: this.__onControlFocusin,
        onFocusout,
        onClick: e => {
          if (this.hasDialog !== true) {
            // label from QField will propagate click on the input (except IE)
            prevent(e)

            if (this.menu === true) {
              this.__closeMenu()
              this.$refs.target && this.$refs.target.focus()
              return
            }
          }

          this.showPopup(e)
        }
      }
    },

    __getMenu () {
      const child = this.noOptions === true
        ? (
            this.$slots[ 'no-option' ] !== void 0
              ? () => this.$slots[ 'no-option' ]({ inputValue: this.inputValue })
              : void 0
          )
        : this.__getOptions

      return h(QMenu, {
        ref: 'menu',
        modelValue: this.menu,
        fit: this.menuShrink !== true,
        cover: this.optionsCover === true && this.noOptions !== true && this.useInput !== true,
        anchor: this.menuAnchor,
        self: this.menuSelf,
        offset: this.menuOffset,
        contentClass: this.menuContentClass,
        contentStyle: this.popupContentStyle,
        dark: this.isOptionsDark,
        noParentEvent: true,
        noRefocus: true,
        noFocus: true,
        square: this.squaredMenu,
        transitionShow: this.transitionShow,
        transitionHide: this.transitionHide,
        separateClosePopup: true,
        onScrollPassive: this.__onVirtualScrollEvt,
        onBeforeShow: this.__onControlPopupShow,
        onBeforeHide: this.__onMenuBeforeHide,
        onShow: this.__onMenuShow
      }, child)
    },

    __onMenuBeforeHide (e) {
      this.__onControlPopupHide(e)
      this.__closeMenu()
    },

    __onMenuShow () {
      this.__setVirtualScrollSize()
    },

    __onDialogFieldFocus (e) {
      stop(e)
      this.$refs.target && this.$refs.target.focus()
      this.dialogFieldFocused = true
      window.scrollTo(window.pageXOffset || window.scrollX || document.body.scrollLeft || 0, 0)
    },

    __onDialogFieldBlur (e) {
      stop(e)
      this.$nextTick(() => {
        this.dialogFieldFocused = false
      })
    },

    __getDialog () {
      const content = [
        h(QField, {
          class: `col-auto ${this.fieldClass}`,
          ...this.$props,
          for: this.targetUid,
          dark: this.isOptionsDark,
          square: true,
          loading: this.innerLoadingIndicator,
          itemAligned: false,
          filled: true,
          stackLabel: this.inputValue.length > 0,
          ...this.qListeners,
          onFocus: this.__onDialogFieldFocus,
          onBlur: this.__onDialogFieldBlur
        }, {
          ...this.$slots,
          rawControl: () => this.field.getControl(true),
          before: void 0,
          after: void 0
        })
      ]

      this.menu === true && content.push(
        h('div', {
          ref: 'menuContent',
          class: this.menuContentClass + ' scroll',
          style: this.popupContentStyle,
          onClick: prevent,
          onScrollPassive: this.__onVirtualScrollEvt
        }, (
          this.noOptions === true
            ? (
                this.$slots[ 'no-option' ] !== void 0
                  ? this.$slots[ 'no-option' ]({ inputValue: this.inputValue })
                  : null
              )
            : this.__getOptions()
        ))
      )

      return h(QDialog, {
        ref: 'dialog',
        modelValue: this.dialog,
        position: this.useInput === true ? 'top' : void 0,
        transitionShow: this.transitionShowComputed,
        transitionHide: this.transitionHide,
        onBeforeShow: this.__onControlPopupShow,
        onBeforeHide: this.__onDialogBeforeHide,
        onHide: this.__onDialogHide,
        onShow: this.__onDialogShow
      }, () => h('div', {
        class: 'q-select__dialog' +
          (this.isOptionsDark === true ? ' q-select__dialog--dark q-dark' : '') +
          (this.dialogFieldFocused === true ? ' q-select__dialog--focused' : '')
      }, content))
    },

    __onDialogBeforeHide (e) {
      this.__onControlPopupHide(e)
      if (this.$refs.dialog) {
        this.$refs.dialog.__refocusTarget = this.$el.querySelector('.q-field__native > [tabindex]:last-child')
      }
      this.focused = false
    },

    __onDialogHide (e) {
      this.hidePopup()
      this.focused === false && this.$emit('blur', e)
      this.__resetInputValue()
    },

    __onDialogShow () {
      const el = document.activeElement
      // IE can have null document.activeElement
      if (
        (el === null || el.id !== this.targetUid) &&
        this.$refs.target !== el &&
        this.$refs.target
      ) {
        this.$refs.target.focus()
      }

      this.__setVirtualScrollSize()
    },

    __closeMenu () {
      if (this.__optionScopeCache !== void 0) {
        this.__optionScopeCache.optionEls = []
      }

      if (this.dialog === true) {
        return
      }

      this.optionIndex = -1

      if (this.menu === true) {
        this.menu = false
      }

      if (this.focused === false) {
        clearTimeout(this.filterId)
        this.filterId = void 0

        if (this.innerLoading === true) {
          this.$emit('filter-abort')
          this.innerLoading = false
          this.innerLoadingIndicator = false
        }
      }
    },

    showPopup (e) {
      if (this.editable !== true) {
        return
      }

      if (this.hasDialog === true) {
        this.__onControlFocusin(e)
        this.dialog = true
        this.$nextTick(() => {
          this.__focus()
        })
      }
      else {
        this.__focus()
      }

      if (this.emitListeners.onFilter === true) {
        this.filter(this.inputValue)
      }
      else if (this.noOptions !== true || this.$slots[ 'no-option' ] !== void 0) {
        this.menu = true
      }
    },

    hidePopup () {
      this.dialog = false
      this.__closeMenu()
    },

    __resetInputValue () {
      this.useInput === true && this.updateInputValue(
        this.multiple !== true && this.fillInput === true && this.innerValue.length > 0
          ? this.getOptionLabel(this.innerValue[ 0 ]) || ''
          : '',
        true,
        true
      )
    },

    __updateMenu (show) {
      let optionIndex = -1

      if (show === true) {
        if (this.innerValue.length > 0) {
          const val = this.getOptionValue(this.innerValue[ 0 ])
          optionIndex = this.options.findIndex(v => isDeepEqual(this.getOptionValue(v), val))
        }

        this.__resetVirtualScroll(optionIndex)
      }

      this.setOptionIndex(optionIndex)
    },

    updateMenuPosition () {
      this.field.onPostRender()
    }
  },

  created () {
    this.innerLoadingIndicator = false

    Object.assign(this.field, {
      onPreRender: () => {
        this.hasDialog = this.$q.platform.is.mobile !== true && this.behavior !== 'dialog'
          ? false
          : this.behavior !== 'menu' && (
            this.useInput === true
              ? this.$slots[ 'no-option' ] !== void 0 || this.emitListeners.onFilter === true || this.noOptions === false
              : true
          )

        this.transitionShowComputed = this.hasDialog === true && this.useInput === true && this.$q.platform.is.ios === true
          ? 'fade'
          : this.transitionShow
      },

      onPostRender: () => {
        if (this.dialog === false && this.$refs.menu) {
          this.$refs.menu.updatePosition()
        }
      },

      getControlChild: () => {
        if (
          this.editable !== false && (
            this.dialog === true || // dialog always has menu displayed, so need to render it
            this.noOptions !== true ||
            this.$slots[ 'no-option' ] !== void 0
          )
        ) {
          return this[ `__get${this.hasDialog === true ? 'Dialog' : 'Menu'}` ]()
        }
      },

      getControl: fromDialog => {
        const child = this.__getSelection()
        const isTarget = fromDialog === true || this.dialog !== true || this.hasDialog !== true

        if (this.useInput === true) {
          child.push(this.__getInput(fromDialog, isTarget))
        }
      // there can be only one (when dialog is opened the control in dialog should be target)
        else if (this.editable === true && isTarget === true) {
          child.push(
            h('div', {
              ref: 'target',
              key: 'd_t',
              class: 'no-outline',
              id: this.targetUid,
              tabindex: this.tabindex,
              onKeydown: this.__onTargetKeydown,
              onKeyup: this.__onTargetKeyup,
              onKeypress: this.__onTargetKeypress
            })
          )

          if (typeof this.autocomplete === 'string' && this.autocomplete.length > 0) {
            child.push(
              h('input', {
                class: 'q-select__autocomplete-input no-outline',
                autocomplete: this.autocomplete,
                onKeyup: this.__onTargetAutocomplete
              })
            )
          }
        }

        if (this.nameProp !== void 0 && this.disable !== true && this.innerOptionsValue.length > 0) {
          const opts = this.innerOptionsValue.map(value => h('option', { value, selected: true }))

          child.push(
            h('select', {
              class: 'hidden',
              name: this.nameProp,
              multiple: this.multiple
            }, opts)
          )
        }

        return h('div', {
          class: 'q-field__native row items-center',
          ...this.qAttrs
        }, child)
      },

      getInnerAppend: () => {
        return this.loading !== true && this.innerLoadingIndicator !== true && this.hideDropdownIcon !== true
          ? [
              h(QIcon, {
                class: 'q-select__dropdown-icon' + (this.menu === true ? ' rotate-180' : ''),
                name: this.dropdownArrowIcon
              })
            ]
          : null
      }
    })
  },

  beforeMount () {
    this.__optionScopeCache = {
      optionSlot: this.$slots.option,
      options: [],
      optionEls: []
    }
  },

  beforeUnmount () {
    this.__optionScopeCache = void 0
    clearTimeout(this.inputTimer)
  },

  // TODO vue3 - render() required for SSR explicitly even though declared in mixin
  render: QField.render
})
