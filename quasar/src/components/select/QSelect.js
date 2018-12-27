import Vue from 'vue'

import QField from '../field/QField.js'
import QIcon from '../icon/QIcon.js'
import QSpinner from '../spinner/QSpinner.js'
import QChip from '../chip/QChip.js'

import QItem from '../list/QItem.js'
import QItemSection from '../list/QItemSection.js'

import TransitionMixin from '../../mixins/transition.js'

import uid from '../../utils/uid.js'
import { isDeepEqual } from '../../utils/is.js'
import { stopAndPrevent } from '../../utils/event.js'
import { normalizeToInterval } from '../../utils/format.js'

import { updatePosition } from './select-menu-position.js'

export default Vue.extend({
  name: 'QSelect',

  mixins: [ QField, TransitionMixin ],

  props: {
    value: {
      required: true
    },

    multiple: Boolean,

    displayValue: [String, Number],
    dropdownIcon: String,

    options: {
      type: Array,
      default: () => []
    },

    optionValue: [Function, String],
    optionLabel: [Function, String],
    optionDisable: [Function, String],

    hideSelected: Boolean,
    counter: Boolean,
    maxValues: [Number, String],

    optionsDense: Boolean,
    optionsDark: Boolean,
    optionsSelectedClass: String,

    useInput: Boolean,
    useChips: Boolean,

    mapOptions: Boolean,
    emitValue: Boolean,

    inputDebounce: {
      type: [Number, String],
      default: 500
    },

    expandBesides: Boolean,
    autofocus: Boolean
  },

  data () {
    return {
      menu: false,
      optionIndex: -1,
      optionsToShow: 20,
      inputValue: '',
      loading: false
    }
  },

  watch: {
    selectedString (val) {
      const value = this.multiple !== true && this.hideSelected === true
        ? val
        : ''

      if (this.inputValue !== value) {
        this.inputValue = value
      }
    },

    menu (show) {
      this.optionIndex = -1
      if (show === true) {
        this.optionsToShow = 20
        this.$nextTick(this.updateMenuPosition)
      }
      document.body[(show === true ? 'add' : 'remove') + 'EventListener']('keydown', this.__onGlobalKeydown)
    }
  },

  computed: {
    fieldClass () {
      return `q-select q-field--auto-height q-select--with${this.useInput !== true ? 'out' : ''}-input`
    },

    innerValue () {
      const val = this.value !== void 0 && this.value !== null
        ? (this.multiple === true ? this.value : [ this.value ])
        : []

      return this.mapOptions === true
        ? val.map(v => this.__getOption(v))
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

    selectedScope () {
      const tabindex = this.focused === true ? 0 : -1

      return this.innerValue.map((opt, i) => ({
        index: i,
        opt,
        selected: true,
        removeAtIndex: this.removeAtIndex,
        toggleOption: this.toggleOption,
        tabindex
      }))
    },

    computedCounter () {
      if (this.multiple === true && this.counter === true) {
        return (this.value !== void 0 && this.value !== null ? this.value.length : '0') +
          (this.maxValues !== void 0 ? ' / ' + this.maxValues : '')
      }
    },

    optionScope () {
      return this.options.slice(0, this.optionsToShow).map((opt, i) => {
        const disable = this.__isDisabled(opt)

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
          this.optionIndex === i && (itemProps.focused = true)
        }

        const itemEvents = {
          click: () => { this.toggleOption(opt) }
        }

        if (this.$q.platform.is.desktop === true) {
          itemEvents.mousemove = () => { this.setOptionIndex(i) }
        }

        return {
          index: i,
          opt,
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
        : this.$q.icon.select.dropdownIcon
    }
  },

  methods: {
    focus () {
      this.$refs.target.focus()
    },

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

    add (opt) {
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

      const model = [].concat(this.value)

      this.$emit('add', { index: model.length, value: val })
      model.push(val)
      this.$emit('input', model)
    },

    toggleOption (opt) {
      if (this.editable !== true || opt === void 0 || this.__isDisabled(opt) === true) { return }

      this.focus()

      const optValue = this.__getOptionValue(opt)

      if (this.multiple !== true) {
        this.menu = false

        if (isDeepEqual(this.__getOptionValue(this.value), optValue) !== true) {
          this.$emit('input', this.emitValue === true ? optValue : opt)
        }
        else {
          const val = this.__getOptionLabel(opt)
          if (val !== this.inputValue) {
            this.inputValue = val
          }
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

      const val = index >= -1 && index < this.optionsToShow
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
      return this.innerValue.find(v => isDeepEqual(this.__getOptionValue(v), val)) !== void 0
    },

    __onTargetKeydown (e) {
      if (this.loading !== true && this.menu === false && e.keyCode === 40) { // down
        stopAndPrevent(e)

        if (this.$listeners.filter !== void 0) {
          this.filter(this.inputValue)
        }
        else {
          this.menu = true
        }

        return
      }

      if (this.multiple === true && this.inputValue.length === 0 && e.keyCode === 8) { // delete
        this.removeAtIndex(this.value.length - 1)
        return
      }

      // enter
      if (e.keyCode !== 13) { return }

      if (this.optionIndex > -1 && this.optionIndex < this.optionsToShow) {
        this.toggleOption(this.options[this.optionIndex])

        if (this.multiple === true) {
          if (this.$listeners.filter !== void 0) {
            this.filter('')
            this.optionIndex = -1
          }
          else {
            this.inputValue = ''
          }
        }
        return
      }

      if (
        this.multiple === true &&
        this.$listeners['new-value'] !== void 0 &&
        this.inputValue.length > 0
      ) {
        this.$emit('new-value', this.inputValue, val => {
          val !== void 0 && val !== null && this.add(val)
          this.inputValue = ''
        })
      }

      if (this.menu === true) {
        this.menu = false
      }
      else if (this.loading !== true) {
        if (this.$listeners.filter !== void 0) {
          this.filter(this.inputValue)
        }
        else {
          this.menu = true
        }
      }
    },

    __onGlobalKeydown (e) {
      // escape
      if (e.keyCode === 27) {
        this.menu = false
        return
      }

      // up, down
      if (e.keyCode === 38 || e.keyCode === 40) {
        stopAndPrevent(e)

        if (this.menu === true) {
          let index = this.optionIndex
          do {
            index = normalizeToInterval(
              index + (e.keyCode === 38 ? -1 : 1),
              -1,
              this.options.length - 1
            )

            if (index === -1) {
              this.optionIndex = -1
              return
            }
          }
          while (index !== this.optionIndex && this.__isDisabled(this.options[index]) === true)

          const dir = index > this.optionIndex ? 1 : -1
          this.optionIndex = index

          this.$nextTick(() => {
            const el = this.$refs.menu.querySelector('.q-manual-focusable--focused')
            if (el !== null && el.scrollIntoView !== void 0) {
              if (el.scrollIntoViewIfNeeded !== void 0) {
                el.scrollIntoViewIfNeeded(false)
              }
              else {
                el.scrollIntoView(dir === -1)
              }
            }
          })
        }
      }
    },

    __onMenuScroll () {
      if (this.avoidScroll !== true && this.optionsToShow < this.options.length) {
        const el = this.$refs.menu

        if (el.scrollHeight - el.scrollTop - el.clientHeight < 200) {
          this.optionsToShow += 20
          this.avoidScroll = true
          this.$nextTick(() => {
            this.avoidScroll = false
          })
        }
      }
    },

    __getSelection (h) {
      if (this.hideSelected === true) {
        return []
      }

      if (this.$scopedSlots.selected !== void 0) {
        return this.selectedScope.map(scope => this.$scopedSlots.selected(scope))
      }

      if (this.$slots.selected !== void 0) {
        return this.$slots.selected
      }

      if (this.useChips === true) {
        const tabindex = this.focused === true ? 0 : -1

        return this.selectedScope.map((scope, i) => h(QChip, {
          key: 'option-' + i,
          props: {
            removable: true,
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
              innerHTML: this.__getOptionLabel(scope.opt)
            }
          })
        ]))
      }

      return [
        h('span', {
          domProps: {
            innerHTML: this.displayValue !== void 0
              ? this.displayValue
              : this.selectedString
          }
        })
      ]
    },

    __getControl (h) {
      const child = this.__getSelection(h)

      if (this.useInput === true) {
        child.push(this.__getInput(h))
      }

      const data = this.editable === true && this.useInput === false
        ? {
          ref: 'target',
          attrs: { tabindex: 0 },
          on: {
            keydown: this.__onTargetKeydown
          }
        }
        : {}

      data.staticClass = 'q-field__native row items-center'

      return h('div', data, child)
    },

    __getOptions (h) {
      const fn = this.$scopedSlots.option || (scope => h(QItem, {
        key: scope.index,
        props: scope.itemProps,
        on: scope.itemEvents
      }, [
        h(QItemSection, {
          domProps: {
            innerHTML: this.__getOptionLabel(scope.opt)
          }
        })
      ]))

      return this.optionScope.map(fn)
    },

    __getLocalMenu (h) {
      if (
        this.editable === false ||
        (this.noOptions === true && this.$slots['no-option'] === void 0)
      ) {
        return
      }

      return h('transition', {
        props: { name: this.transition }
      }, [
        this.menu === true
          ? h('div', {
            ref: 'menu',
            staticClass: 'q-local-menu scroll',
            class: {
              'q-local-menu--dark': this.optionsDark,
              'q-local-menu--square': this.expandBesides
            },
            on: {
              click: stopAndPrevent,
              '&scroll': this.__onMenuScroll
            }
          }, this.noOptions === true ? this.$slots['no-option'] : this.__getOptions(h))
          : null
      ])
    },

    __getInnerAppend (h) {
      return [
        this.loading === true
          ? (
            this.$slots.loading !== void 0
              ? this.$slots.loading
              : h(QSpinner, { props: { color: this.color } })
          )
          : null,

        h(QIcon, {
          staticClass: 'q-select__dropdown-icon',
          props: { name: this.dropdownArrowIcon }
        })
      ]
    },

    __getInput (h) {
      return h('input', {
        ref: 'target',
        staticClass: 'q-select__input col',
        class: this.hideSelected !== true && this.innerValue.length > 0
          ? 'q-select__input--padding'
          : null,
        domProps: { value: this.inputValue },
        attrs: {
          disabled: this.editable !== true
        },
        on: {
          input: this.__onInputValue,
          keydown: this.__onTargetKeydown
        }
      })
    },

    __onInputValue (e) {
      clearTimeout(this.inputTimer)
      this.inputValue = e.target.value || ''

      if (this.optionIndex !== -1) {
        this.optionIndex = -1
      }

      if (this.$listeners.filter !== void 0) {
        this.inputTimer = setTimeout(() => {
          this.filter(this.inputValue)
        }, this.inputDebounce)
      }
    },

    filter (val) {
      this.menu = false
      this.inputValue = val

      if (this.loading === true) {
        this.$emit('filter-abort')
      }
      else {
        this.loading = true
      }

      const filterId = uid()
      this.filterId = filterId

      this.$emit(
        'filter',
        val,
        fn => {
          if (this.focused === true && this.filterId === filterId) {
            this.loading = false
            this.menu = true
            typeof fn === 'function' && fn()
          }
        },
        () => {
          if (this.focused === true && this.filterId === filterId) {
            this.loading = false
          }
        }
      )
    },

    __onControlClick () {
      this.focus()

      if (this.menu === true) {
        this.menu = false
      }
      else {
        if (this.$listeners.filter !== void 0) {
          this.filter(this.inputValue)
        }
        else if (this.noOptions !== true || this.$slots['no-option'] !== void 0) {
          this.menu = true
        }
      }
    },

    __onControlFocusin (e) {
      this.focused = true

      if (this.useInput === true && this.inputValue.length > 0) {
        this.$refs.target.setSelectionRange(0, this.inputValue.length)
      }
    },

    __onControlFocusout () {
      setTimeout(() => {
        clearTimeout(this.inputTimer)

        if (this.$refs === void 0 || this.$refs.control === void 0) {
          return
        }

        if (this.$refs.control.contains(document.activeElement) !== false) {
          return
        }

        this.focused = false

        if (this.menu === true) {
          this.menu = false
        }

        const val = this.multiple !== true && this.hideSelected === true
          ? this.selectedString
          : ''

        if (this.inputValue !== val) {
          this.inputValue = val
        }

        this.filterId = void 0

        if (this.loading === true) {
          this.$emit('filter-abort')
          this.loading = false
        }
      })
    },

    updateMenuPosition () {
      const el = this.$refs.menu

      if (el === void 0) { return }

      updatePosition(
        el,
        this.$refs.control,
        this.expandBesides !== true && this.noOptions !== true && this.useInput !== true
      )
    }
  },

  created () {
    this.controlEvents = {
      click: this.__onControlClick,
      mousedown: stopAndPrevent,
      focusin: this.__onControlFocusin,
      focusout: this.__onControlFocusout
    }
  },

  mounted () {
    this.autofocus === true && this.$nextTick(this.focus)
  },

  beforeDestroy () {
    clearTimeout(this.inputTimer)
    document.body.removeEventListener('keydown', this.__onGlobalKeydown)
  }
})
