import Vue from 'vue'

import QField from '../field/QField.js'
import QIcon from '../icon/QIcon.js'
import QChip from '../chip/QChip.js'

import QItem from '../list/QItem.js'
import QItemSection from '../list/QItemSection.js'
import QItemLabel from '../list/QItemLabel.js'

import QMenu from '../menu/QMenu.js'
import QDialog from '../dialog/QDialog.js'

import { isDeepEqual } from '../../utils/is.js'
import { stop, prevent, stopAndPrevent } from '../../utils/event.js'
import debounce from '../../utils/debounce'
import frameDebounce from '../../utils/frame-debounce.js'
import { normalizeToInterval } from '../../utils/format.js'

const validateNewValueMode = v => ['add', 'add-unique', 'toggle'].includes(v)

const
  optionsSliceSize = 31,
  optionDefaultHeight = 24,
  optionsListMaxPadding = 100000

export default Vue.extend({
  name: 'QSelect',

  mixins: [ QField ],

  props: {
    value: {
      required: true
    },

    multiple: Boolean,

    displayValue: [String, Number],
    displayValueSanitize: Boolean,
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
    optionsDark: Boolean,
    optionsSelectedClass: String,
    optionsCover: Boolean,
    optionsSanitize: Boolean,

    popupContentClass: String,
    popupContentStyle: [String, Array, Object],

    useInput: Boolean,
    useChips: Boolean,

    newValueMode: {
      type: String,
      validator: validateNewValueMode
    },

    mapOptions: Boolean,
    emitValue: Boolean,

    inputDebounce: {
      type: [Number, String],
      default: 500
    },

    transitionShow: {
      type: String,
      default: 'fade'
    },

    transitionHide: {
      type: String,
      default: 'fade'
    }
  },

  data () {
    return {
      menu: false,
      dialog: false,
      optionIndex: -1,
      optionsSliceRange: { from: 0, to: 0 },
      inputValue: ''
    }
  },

  watch: {
    innerValue: {
      handler () {
        if (
          this.useInput === true &&
          this.fillInput === true &&
          this.multiple !== true &&
          // Prevent re-entering in filter while filtering
          // Also prevent clearing inputValue while filtering
          this.innerLoading !== true &&
          ((this.dialog !== true && this.menu !== true) || this.hasValue !== true)
        ) {
          this.__resetInputValue()
          if (this.dialog === true || this.menu === true) {
            this.filter('')
          }
        }
      },
      immediate: true
    },

    menu (show) {
      this.__updateMenu(show)
    },

    options: {
      handler (options) {
        const optionsLength = Array.isArray(options) === false ? 0 : options.length
        const optionsHeights = new Array(optionsLength)

        for (let i = optionsLength - 1; i >= 0; i--) {
          optionsHeights[i] = optionDefaultHeight
        }

        this.optionsHeights = optionsHeights
        this.optionsHeight = optionsLength * optionDefaultHeight
        this.optionsMarginTop = this.optionsHeight
      },
      immediate: true
    }
  },

  computed: {
    fieldClass () {
      return `q-select q-field--auto-height q-select--with${this.useInput !== true ? 'out' : ''}-input`
    },

    menuClass () {
      return (this.optionsDark === true ? 'q-select__menu--dark' : '') +
        (this.popupContentClass ? ' ' + this.popupContentClass : '')
    },

    innerValue () {
      const
        mapNull = this.mapOptions === true && this.multiple !== true,
        val = this.value !== void 0 && (this.value !== null || mapNull === true)
          ? (this.multiple === true ? this.value : [ this.value ])
          : []

      return this.mapOptions === true && Array.isArray(this.options) === true
        ? (
          this.value === null && mapNull === true
            ? val.map(v => this.__getOption(v)).filter(v => v !== null)
            : val.map(v => this.__getOption(v))
        )
        : val
    },

    noOptions () {
      return this.options === void 0 || this.options === null || this.options.length === 0
    },

    selectedString () {
      return this.innerValue
        .map(opt => this.__getOptionLabel(opt))
        .join(', ')
    },

    displayAsText () {
      return this.displayValueSanitize === true || (
        this.displayValue === void 0 && (
          this.optionsSanitize === true ||
          this.innerValue.some(opt => opt !== null && opt.sanitize === true)
        )
      )
    },

    selectedScope () {
      const tabindex = this.focused === true ? 0 : -1

      return this.innerValue.map((opt, i) => ({
        index: i,
        opt,
        sanitize: this.optionsSanitize === true || opt.sanitize === true,
        selected: true,
        removeAtIndex: this.__removeAtIndexAndFocus,
        toggleOption: this.toggleOption,
        tabindex
      }))
    },

    optionScope () {
      return this.options.slice(this.optionsSliceRange.from, this.optionsSliceRange.to).map((opt, i) => {
        const disable = this.__isDisabled(opt)
        const index = this.optionsSliceRange.from + i

        const itemProps = {
          clickable: true,
          active: false,
          activeClass: this.optionsSelectedClass,
          manualFocus: true,
          focused: false,
          disable,
          tabindex: -1,
          dense: this.optionsDense,
          dark: this.optionsDark
        }

        if (disable !== true) {
          this.__isSelected(opt) === true && (itemProps.active = true)
          this.optionIndex === index && (itemProps.focused = true)
        }

        const itemEvents = {
          click: () => { this.toggleOption(opt) }
        }

        if (this.$q.platform.is.desktop === true) {
          itemEvents.mousemove = () => { this.setOptionIndex(index) }
        }

        return {
          index,
          opt,
          sanitize: this.optionsSanitize === true || opt.sanitize === true,
          selected: itemProps.active,
          focused: itemProps.focused,
          toggleOption: this.toggleOption,
          setOptionIndex: this.setOptionIndex,
          itemProps,
          itemEvents
        }
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
    }
  },

  methods: {
    removeAtIndex (index) {
      if (index > -1 && index < this.innerValue.length) {
        if (this.multiple === true) {
          const model = [].concat(this.value)
          this.$emit('remove', { index, value: model.splice(index, 1) })
          this.$emit('input', model)
        }
        else {
          this.$emit('input', null)
        }
      }
    },

    __removeAtIndexAndFocus (index) {
      this.removeAtIndex(index)
      this.focus()
    },

    add (opt, unique) {
      const val = this.emitValue === true
        ? this.__getOptionValue(opt)
        : opt

      if (this.multiple !== true) {
        this.$emit('input', val)
        return
      }

      if (this.innerValue.length === 0) {
        this.$emit('add', { index: 0, value: val })
        this.$emit('input', this.multiple === true ? [ val ] : val)
        return
      }

      if (unique === true && this.__isSelected(opt) === true) {
        return
      }

      const model = [].concat(this.value)

      if (this.maxValues !== void 0 && model.length >= this.maxValues) {
        return
      }

      this.$emit('add', { index: model.length, value: val })
      model.push(val)
      this.$emit('input', model)
    },

    toggleOption (opt) {
      if (this.editable !== true || opt === void 0 || this.__isDisabled(opt) === true) {
        return
      }

      const optValue = this.__getOptionValue(opt)

      this.multiple !== true && this.updateInputValue(
        this.fillInput === true ? this.__getOptionLabel(opt) : '',
        true
      )
      this.__focus()

      if (this.multiple !== true) {
        this.hidePopup()

        if (isDeepEqual(this.__getOptionValue(this.value), optValue) !== true) {
          this.$emit('input', this.emitValue === true ? optValue : opt)
        }
        return
      }

      if (this.innerValue.length === 0) {
        const val = this.emitValue === true ? optValue : opt
        this.$emit('add', { index: 0, value: val })
        this.$emit('input', this.multiple === true ? [ val ] : val)
        return
      }

      const
        model = [].concat(this.value),
        index = this.value.findIndex(v => isDeepEqual(this.__getOptionValue(v), optValue))

      if (index > -1) {
        this.$emit('remove', { index, value: model.splice(index, 1) })
      }
      else {
        if (this.maxValues !== void 0 && model.length >= this.maxValues) {
          return
        }

        const val = this.emitValue === true ? optValue : opt

        this.$emit('add', { index: model.length, value: val })
        model.push(val)
      }

      this.$emit('input', model)
    },

    setOptionIndex (index) {
      if (this.$q.platform.is.desktop !== true) { return }

      const val = index > -1 && index < this.options.length
        ? index
        : -1

      if (this.optionIndex !== val) {
        this.optionIndex = val
      }
    },

    __getOption (value) {
      return this.options.find(opt => isDeepEqual(this.__getOptionValue(opt), value)) || value
    },

    __getOptionValue (opt) {
      if (typeof this.optionValue === 'function') {
        return this.optionValue(opt)
      }
      if (Object(opt) === opt) {
        return typeof this.optionValue === 'string'
          ? opt[this.optionValue]
          : opt.value
      }
      return opt
    },

    __getOptionLabel (opt) {
      if (typeof this.optionLabel === 'function') {
        return this.optionLabel(opt)
      }
      if (Object(opt) === opt) {
        return typeof this.optionLabel === 'string'
          ? opt[this.optionLabel]
          : opt.label
      }
      return opt
    },

    __isDisabled (opt) {
      if (typeof this.optionDisable === 'function') {
        return this.optionDisable(opt) === true
      }
      if (Object(opt) === opt) {
        return typeof this.optionDisable === 'string'
          ? opt[this.optionDisable] === true
          : opt.disable === true
      }
      return false
    },

    __isSelected (opt) {
      const val = this.__getOptionValue(opt)
      return this.innerValue
        .find(v => isDeepEqual(this.__getOptionValue(v), val)) !== void 0
    },

    __onTargetKeydown (e) {
      // escape, tab
      if (e.keyCode === 27 || e.keyCode === 9) {
        this.__closeMenu()
        return
      }

      if (e.target !== this.$refs.target) { return }

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

      // delete
      if (
        e.keyCode === 8 &&
        this.multiple === true &&
        this.inputValue.length === 0 &&
        Array.isArray(this.value)
      ) {
        this.removeAtIndex(this.value.length - 1)
        return
      }

      // up, down
      const optionsLength = this.options.length

      if (e.keyCode === 38 || e.keyCode === 40) {
        stopAndPrevent(e)

        if (this.menu === true) {
          let index = this.optionIndex
          do {
            index = normalizeToInterval(
              index + (e.keyCode === 38 ? -1 : 1),
              -1,
              optionsLength - 1
            )
          }
          while (index !== -1 && index !== this.optionIndex && this.__isDisabled(this.options[index]) === true)

          if (this.optionIndex !== index) {
            this.__setPreventNextScroll()

            this.optionIndex = index

            this.__hydrateOptions({ target: this.__getMenuContentEl() }, index)
          }
        }
      }

      // enter
      if (e.target !== this.$refs.target || e.keyCode !== 13) { return }

      stopAndPrevent(e)

      if (this.optionIndex > -1 && this.optionIndex < optionsLength) {
        this.toggleOption(this.options[this.optionIndex])
        return
      }

      if (
        this.inputValue.length > 0 &&
        (this.newValueMode !== void 0 || this.$listeners['new-value'] !== void 0)
      ) {
        const done = (val, mode) => {
          if (mode) {
            if (validateNewValueMode(mode) !== true) {
              console.error('QSelect: invalid new value mode - ' + mode)
              return
            }
          }
          else {
            mode = this.newValueMode
          }

          if (val !== void 0 && val !== null) {
            this[mode === 'toggle' ? 'toggleOption' : 'add'](
              val,
              mode === 'add-unique'
            )
          }

          this.updateInputValue('', this.multiple !== true)
        }

        if (this.$listeners['new-value'] !== void 0) {
          this.$emit('new-value', this.inputValue, done)

          if (this.multiple !== true) {
            return
          }
        }
        else {
          done(this.inputValue)
        }
      }

      if (this.menu === true) {
        this.dialog !== true && this.__closeMenu()
      }
      else if (this.innerLoading !== true) {
        this.showPopup()
      }
    },

    __getMenuContentEl () {
      return this.hasDialog === true
        ? this.$refs.menuContent
        : (
          this.$refs.menu !== void 0
            ? this.$refs.menu.__portal.$el
            : void 0
        )
    },

    __hydrateOptions (ev, toIndex) {
      clearTimeout(this.hidrateTimer)

      if (ev === void 0 || (this.preventNextScroll === true && toIndex === void 0)) {
        return
      }

      const
        delayNextScroll = this.delayNextScroll === true && toIndex === void 0,
        target = delayNextScroll === true || ev.target === void 0 || ev.target.nodeType === 8 ? void 0 : ev.target,
        content = target === void 0 ? null : target.querySelector('.q-select__options--content')

      if (content === null) {
        this.hidrateTimer = setTimeout(() => {
          this.__hydrateOptions({ target: this.__getMenuContentEl() }, toIndex)
        }, 10)

        return
      }

      const
        scrollTop = target.scrollTop,
        viewHeight = target.clientHeight,
        child = content.children[toIndex - this.optionsSliceRange.from],
        childPosTop = child === void 0 ? -1 : content.offsetTop + child.offsetTop,
        childPosBottom = child === void 0 ? -1 : childPosTop + child.clientHeight,
        fromScroll = toIndex === void 0

      if (fromScroll === true) {
        const toIndexMax = this.options.length - 1

        toIndex = -1
        for (let i = Math.trunc(scrollTop + viewHeight / 2); i >= 0 && toIndex < toIndexMax;) {
          toIndex++
          i -= this.optionsHeights[toIndex]
        }
      }

      toIndex = toIndex < 0 ? 0 : toIndex

      // destination option is not in view
      if (childPosTop < scrollTop || childPosBottom > scrollTop + viewHeight) {
        this.__setOptionsSliceRange(toIndex, target, fromScroll)
      }
    },

    __setPreventNextScroll (delay) {
      clearTimeout(this.preventNextScrollTimer)

      this.preventNextScroll = delay !== true
      this.delayNextScroll = delay === true

      this.preventNextScrollTimer = setTimeout(() => {
        this.preventNextScroll = false
        this.delayNextScroll = false
      }, 10)
    },

    __setOptionsSliceRange (toIndex, target, fromScroll) {
      const
        from = Math.max(0, Math.min(toIndex - Math.round(optionsSliceSize / 2), this.options.length - optionsSliceSize)),
        to = from + optionsSliceSize,
        repositionScroll = fromScroll !== true || from < this.optionsSliceRange.from

      if (from === this.optionsSliceRange.from && to === this.optionsSliceRange.to) {
        if (fromScroll === true) {
          return
        }
      }
      else {
        this.__setPreventNextScroll(fromScroll)
        this.optionsSliceRange = { from, to }
      }

      this.$nextTick(() => {
        const content = target === void 0 ? null : target.querySelector('.q-select__options--content')

        if (content === null) {
          return
        }

        const children = content.children

        let marginTopDiff = 0

        for (let i = children.length - 1; i >= 0; i--) {
          const diff = children[i].clientHeight - this.optionsHeights[from + i]

          if (diff !== 0) {
            marginTopDiff += diff
            this.optionsHeights[from + i] += diff
          }
        }

        const
          marginTop = this.optionsHeights.slice(from).reduce((acc, h) => acc + h, 0),
          height = marginTop + this.optionsHeights.slice(0, from).reduce((acc, h) => acc + h, 0),
          padding = this.optionsHeight % optionsListMaxPadding + height - this.optionsHeight

        if (this.optionsMarginTop !== marginTop || this.optionsHeight !== height) {
          this.optionsMarginTop = marginTop
          this.optionsHeight = height

          this.__setPreventNextScroll(fromScroll)
          // content.previousSibling is the last padding block
          content.previousSibling.style.cssText = padding >= 0 ? `height: ${padding}px; margin-top: 0px` : `height: 0px; margin-top: ${padding}px`
          content.style.marginTop = `-${marginTop}px`
        }

        if (repositionScroll === true) {
          if (fromScroll !== true) {
            this.__setPreventNextScroll(fromScroll)
            target.scrollTop = this.optionsHeights.slice(0, toIndex).reduce((acc, h) => acc + h, 0) + (
              this.$q.platform.is.mobile === true
                ? 0
                : Math.trunc(this.optionsHeights[toIndex] / 2 - target.clientHeight / 2)
            )
          }
          else if (marginTopDiff !== 0) {
            this.__setPreventNextScroll(fromScroll)
            target.scrollTop += marginTopDiff
          }
        }
      })
    },

    __getSelection (h, fromDialog) {
      if (this.hideSelected === true) {
        return fromDialog !== true && this.hasDialog === true
          ? [
            h('span', {
              domProps: {
                'textContent': this.inputValue
              }
            })
          ]
          : []
      }

      if (this.$scopedSlots['selected-item'] !== void 0) {
        return this.selectedScope.map(scope => this.$scopedSlots['selected-item'](scope))
      }

      if (this.$scopedSlots.selected !== void 0) {
        return this.$scopedSlots.selected()
      }

      if (this.useChips === true) {
        const tabindex = this.focused === true ? 0 : -1

        return this.selectedScope.map((scope, i) => h(QChip, {
          key: 'option-' + i,
          props: {
            removable: this.__isDisabled(scope.opt) !== true,
            dense: true,
            textColor: this.color,
            tabindex
          },
          on: {
            remove () { scope.removeAtIndex(i) }
          }
        }, [
          h('span', {
            domProps: {
              [scope.sanitize === true ? 'textContent' : 'innerHTML']: this.__getOptionLabel(scope.opt)
            }
          })
        ]))
      }

      return [
        h('span', {
          domProps: {
            [this.displayAsText ? 'textContent' : 'innerHTML']: this.displayValue !== void 0
              ? this.displayValue
              : this.selectedString
          }
        })
      ]
    },

    __getControl (h, fromDialog) {
      let data = { attrs: {} }
      const child = this.__getSelection(h, fromDialog)

      if (this.useInput === true && (fromDialog === true || this.hasDialog === false)) {
        child.push(this.__getInput(h))
      }
      else if (this.editable === true) {
        data = {
          ref: 'target',
          attrs: {
            tabindex: 0,
            autofocus: this.autofocus
          },
          on: {
            keydown: this.__onTargetKeydown
          }
        }
      }

      Object.assign(data.attrs, this.$attrs)
      data.staticClass = 'q-field__native row items-center'

      return h('div', data, child)
    },

    __getOptions (h) {
      const fn = this.$scopedSlots.option !== void 0
        ? this.$scopedSlots.option
        : scope => h(QItem, {
          key: scope.index,
          props: scope.itemProps,
          on: scope.itemEvents
        }, [
          h(QItemSection, [
            h(QItemLabel, {
              domProps: {
                [scope.sanitize === true ? 'textContent' : 'innerHTML']: this.__getOptionLabel(scope.opt)
              }
            })
          ])
        ])

      const list = []

      for (let i = Math.trunc(this.optionsHeight / optionsListMaxPadding); i > 0; i--) {
        list.push(h('div', { staticClass: 'q-select__options--padding', style: { height: `${optionsListMaxPadding}px` } }))
      }
      list.push(h('div', { staticClass: 'q-select__options--padding', style: { height: `${this.optionsHeight % optionsListMaxPadding}px` } }))

      list.push(h('div', {
        staticClass: 'q-select__options--content',
        style: {
          marginTop: `-${this.optionsMarginTop}px`
        }
      }, this.optionScope.map(fn)))

      return list
    },

    __getInnerAppend (h) {
      return this.loading !== true && this.innerLoading !== true && this.hideDropdownIcon !== true
        ? [
          h(QIcon, {
            staticClass: 'q-select__dropdown-icon',
            props: { name: this.dropdownArrowIcon }
          })
        ]
        : null
    },

    __onCompositionStart (e) {
      e.target.composing = true
    },

    __onCompositionUpdate (e) {
      if (typeof e.data === 'string' && e.data.codePointAt(0) < 256) {
        e.target.composing = false
      }
    },

    __onCompositionEnd (e) {
      if (e.target.composing !== true) { return }
      e.target.composing = false

      this.__onInputValue(e)
    },

    __getInput (h) {
      const on = {
        input: this.__onInputValue,
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        change: this.__onCompositionEnd,
        compositionstart: this.__onCompositionStart,
        compositionend: this.__onCompositionEnd,
        keydown: this.__onTargetKeydown
      }

      if (this.$q.platform.is.android === true) {
        on.compositionupdate = this.__onCompositionUpdate
      }

      return h('input', {
        ref: 'target',
        staticClass: 'q-select__input q-placeholder col',
        class: this.hideSelected !== true && this.innerValue.length > 0
          ? 'q-select__input--padding'
          : null,
        domProps: { value: this.inputValue },
        attrs: {
          tabindex: 0,
          autofocus: this.autofocus,
          ...this.$attrs,
          disabled: this.editable !== true
        },
        on
      })
    },

    __onInputValue (e) {
      clearTimeout(this.inputTimer)

      if (e && e.target && e.target.composing === true) {
        return
      }

      this.inputValue = e.target.value || ''

      if (this.$listeners.filter !== void 0) {
        this.inputTimer = setTimeout(() => {
          this.filter(this.inputValue, true)
        }, this.inputDebounce)
      }
    },

    updateInputValue (val, noFiltering) {
      if (this.useInput === true) {
        if (this.inputValue !== val) {
          this.inputValue = val
        }

        noFiltering !== true && this.filter(val)
      }
    },

    filter (val, userInput) {
      if (this.$listeners.filter === void 0 || this.focused !== true) {
        return
      }

      if (this.innerLoading === true) {
        this.$emit('filter-abort')
      }
      else {
        this.innerLoading = true
      }

      if (
        val !== '' &&
        this.multiple !== true &&
        this.innerValue.length > 0 &&
        userInput !== true &&
        val === this.__getOptionLabel(this.innerValue[0])
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
        fn => {
          if (this.focused === true && this.filterId === filterId) {
            clearTimeout(this.filterId)
            typeof fn === 'function' && fn()
            this.$nextTick(() => {
              this.innerLoading = false
              if (this.menu === true) {
                this.__updateMenu()
              }
              else {
                this.menu = true
              }
            })
          }
        },
        () => {
          if (this.focused === true && this.filterId === filterId) {
            clearTimeout(this.filterId)
            this.innerLoading = false
          }
          this.menu === true && (this.menu = false)
        }
      )
    },

    __getControlEvents () {
      const focusout = e => {
        this.__onControlFocusout(e, () => {
          this.__resetInputValue()
          this.__closeMenu()
        })
      }

      return {
        focus: e => {
          this.hasDialog !== true && this.focus(e)
        },
        focusin: this.__onControlFocusin,
        focusout,
        'popup-show': this.__onControlPopupShow,
        'popup-hide': e => {
          this.hasPopupOpen = false
          focusout(e)
        },
        click: e => {
          if (this.hasDialog !== true && this.menu === true) {
            this.__closeMenu()
          }
          else {
            this.showPopup(e)
          }
        }
      }
    },

    __getPopup (h) {
      if (
        this.editable !== false && (
          this.dialog === true || // dialog always has menu displayed, so need to render it
          this.noOptions !== true ||
          this.$scopedSlots['no-option'] !== void 0
        )
      ) {
        return this[`__get${this.hasDialog === true ? 'Dialog' : 'Menu'}`](h)
      }
    },

    __getMenu (h) {
      const child = this.noOptions === true
        ? (
          this.$scopedSlots['no-option'] !== void 0
            ? this.$scopedSlots['no-option']({ inputValue: this.inputValue })
            : null
        )
        : this.__getOptions(h)

      return h(QMenu, {
        ref: 'menu',
        props: {
          value: this.menu,
          fit: true,
          cover: this.optionsCover === true && this.noOptions !== true && this.useInput !== true,
          contentClass: this.menuClass,
          contentStyle: this.popupContentStyle,
          noParentEvent: true,
          noRefocus: true,
          noFocus: true,
          square: this.squaredMenu,
          transitionShow: this.transitionShow,
          transitionHide: this.transitionHide
        },
        on: {
          '&scroll': this.__hydrateOptions,
          'before-hide': this.__closeMenu
        }
      }, child)
    },

    __getDialog (h) {
      const content = [
        h(QField, {
          staticClass: `col-auto ${this.fieldClass}`,
          props: {
            ...this.$props,
            dark: this.optionsDark,
            square: true,
            loading: this.innerLoading,
            filled: true,
            stackLabel: this.inputValue.length > 0
          },
          on: {
            ...this.$listeners,
            focus: stop,
            blur: stop
          },
          scopedSlots: {
            ...this.$scopedSlots,
            rawControl: () => this.__getControl(h, true),
            before: void 0,
            after: void 0
          }
        })
      ]

      this.menu === true && content.push(
        h('div', {
          ref: 'menuContent',
          staticClass: 'scroll',
          class: this.popupContentClass,
          style: this.popupContentStyle,
          on: {
            click: prevent,
            '&scroll': this.__hydrateOptions
          }
        }, (
          this.noOptions === true
            ? (
              this.$scopedSlots['no-option'] !== void 0
                ? this.$scopedSlots['no-option']({ inputValue: this.inputValue })
                : null
            )
            : this.__getOptions(h)
        ))
      )

      return h(QDialog, {
        props: {
          value: this.dialog,
          noRefocus: true,
          noFocus: true,
          position: this.useInput === true ? 'top' : void 0
        },
        on: {
          'before-hide': () => {
            this.focused = false
          },
          hide: e => {
            this.hidePopup()
            this.$emit('blur', e)
            this.__resetInputValue()
          },
          show: () => {
            this.$refs.target.focus()
          }
        }
      }, [
        h('div', {
          staticClass: 'q-select__dialog' + (this.optionsDark === true ? ' q-select__menu--dark' : '')
        }, content)
      ])
    },

    __closeMenu () {
      this.menu = false

      if (this.focused === false) {
        clearTimeout(this.filterId)
        this.filterId = void 0

        if (this.innerLoading === true) {
          this.$emit('filter-abort')
          this.innerLoading = false
        }
      }
    },

    showPopup (e) {
      if (this.hasDialog === true) {
        this.__onControlFocusin(e)
        this.dialog = true
      }
      else {
        this.focus(e)
      }

      if (this.$listeners.filter !== void 0) {
        this.filter(this.inputValue)
      }
      else if (this.noOptions !== true || this.$scopedSlots['no-option'] !== void 0) {
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
          ? this.__getOptionLabel(this.innerValue[0]) || ''
          : '',
        true
      )
    },

    __updateMenu (show) {
      let optionIndex = -1

      if (show === true) {
        if (this.innerValue.length > 0) {
          const val = this.__getOptionValue(this.innerValue[0])
          optionIndex = this.options.findIndex(v => isDeepEqual(this.__getOptionValue(v), val))
        }

        this.__setPreventNextScroll(true)
        this.optionsSliceRange = { from: 0, to: 0 }
        this.__hydrateOptions({ target: this.__getMenuContentEl() }, optionIndex)
      }

      this.optionIndex = optionIndex
    },

    __onPreRender () {
      this.hasDialog = this.$q.platform.is.mobile !== true
        ? false
        : (
          this.useInput === true
            ? this.$scopedSlots['no-option'] !== void 0 || this.$listeners.filter !== void 0
            : true
        )
    },

    __onPostRender () {
      if (this.dialog === false && this.$refs.menu !== void 0) {
        this.$refs.menu.updatePosition()
      }
    },

    updateMenuPosition () {
      this.__onPostRender()
    }
  },

  mounted () {
    this.__setOptionsSliceRange = this.$q.platform.is.ios === true || this.$q.platform.is.safari === true
      ? frameDebounce(this.__setOptionsSliceRange)
      : debounce(this.__setOptionsSliceRange, 50)
  },

  beforeDestroy () {
    clearTimeout(this.inputTimer)
    clearTimeout(this.hidrateTimer)
  }
})
