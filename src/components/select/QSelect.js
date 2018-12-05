import Vue from 'vue'

import QField from '../field/QField.js'
import QIcon from '../icon/QIcon.js'
import QSpinner from '../spinner/QSpinner.js'
import QChip from '../chip/QChip.js'

import QItem from '../list/QItem.js'
import QItemSection from '../list/QItemSection.js'

import TransitionMixin from '../../mixins/transition.js'

import ClickOutside from '../../directives/click-outside.js'

import uid from '../../utils/uid.js'
import { isDeepEqual } from '../../utils/is.js'
import { stopAndPrevent } from '../../utils/event.js'
import { normalizeToInterval } from '../../utils/format.js'

export default Vue.extend({
  name: 'QSelect',

  mixins: [ QField, TransitionMixin ],

  directives: {
    ClickOutside
  },

  // field options
  fieldDataFocus: false,

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

    hideSelected: Boolean,
    counter: Boolean,
    maxValues: [Number, String],

    useInput: Boolean,
    useChips: Boolean,

    inputDebounce: {
      type: [Number, String],
      default: 500
    },

    expandBesides: Boolean
  },

  data () {
    return {
      menu: false,
      targetFocused: false,
      optionIndex: -1,
      optionsToShow: 20,
      inputValue: '',
      loading: false
    }
  },

  watch: {
    selectedString (val) {
      this.inputValue = this.multiple !== true && this.hideSelected === true && this.inputValue !== val
        ? val
        : ''
    },

    menu (show) {
      this.optionIndex = -1
      if (show === true) {
        this.optionsToShow = 20
      }
      document.body[(show === true ? 'add' : 'remove') + 'EventListener']('keydown', this.__onGlobalKeydown)
    }
  },

  computed: {
    fieldClass () {
      return `q-select q-field--auto-height q-select--with${this.useInput !== true ? 'out' : ''}-input`
    },

    focused () {
      return this.targetFocused === true || this.menu === true
    },

    innerValue () {
      return this.value !== void 0 && this.value !== null
        ? (this.multiple === true ? this.value : [ this.value ])
        : []
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
      return this.innerValue.map((opt, i) => ({
        index: i,
        opt,
        selected: true,
        removeValue: this.removeValue,
        toggleOption: this.toggleOption,
        control: this
      }))
    },

    computedCounter () {
      if (this.multiple === true && this.counter === true) {
        return (this.value !== void 0 && this.value !== null ? this.value.length : '0') +
          (this.maxValues !== void 0 ? ' / ' + this.maxValues : '')
      }
    },

    optionScope () {
      return this.options.slice(0, this.optionsToShow).map((opt, i) => ({
        index: i,
        opt,
        selected: this.__isSelected(opt),
        focused: this.optionIndex === i,
        toggleOption: this.toggleOption,
        setOptionIndex: this.setOptionIndex
      }))
    },

    dropdownArrowIcon () {
      return this.dropdownIcon !== void 0
        ? this.dropdownIcon
        : this.$q.icon.select.dropdownIcon
    }
  },

  methods: {
    removeValue (opt) {
      if (this.multiple !== true) {
        this.$emit('input', null)
        return
      }

      const index = this.value.findIndex(v => isDeepEqual(v, opt))
      if (index > -1) {
        const model = [].concat(this.value)
        this.$emit('remove', { index, value: model.splice(index, 1) })
        this.$emit('input', model)
      }
    },

    addValue (opt) {
      if (this.multiple !== true) {
        this.$emit('input', opt)
        return
      }

      if (this.innerValue.length === 0) {
        this.$emit('add', { index: 0, value: opt })
        this.$emit('input', this.multiple === true ? [ opt ] : opt)
        return
      }

      const model = [].concat(this.value)

      this.$emit('add', { index: model.length, value: opt })
      model.push(opt)
      this.$emit('input', model)
    },

    toggleOption (opt, optionIndex) {
      if (this.editable !== true || opt === void 0 || opt.disable === true) { return }

      if (this.multiple !== true) {
        this.menu = false

        if (this.hideSelected === true && this.inputValue !== this.selectedString) {
          this.inputValue = this.selectedString
        }

        if (isDeepEqual(this.value, opt) !== true) {
          this.$emit('input', opt)
        }

        return
      }

      if (optionIndex !== void 0) {
        if (this.optionIndex !== optionIndex) {
          this.optionIndex = optionIndex
        }
        this.$refs.target.focus()
      }

      if (this.innerValue.length === 0) {
        this.$emit('add', { index: 0, value: opt })
        this.$emit('input', this.multiple === true ? [ opt ] : opt)
        return
      }

      const
        model = [].concat(this.value),
        index = this.value.findIndex(v => isDeepEqual(v, opt))

      if (index > -1) {
        this.$emit('remove', { index, value: model.splice(index, 1) })
      }
      else {
        if (this.maxValues !== void 0 && model.length >= this.maxValues) {
          return
        }

        this.$emit('add', { index: model.length, value: opt })
        model.push(opt)
      }

      this.$emit('input', model)
    },

    setOptionIndex (optionIndex) {
      if (this.optionIndex !== optionIndex) {
        this.optionIndex = optionIndex
      }
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

    __isSelected (opt) {
      const val = this.__getOptionValue(opt)
      return this.innerValue.find(v => isDeepEqual(this.__getOptionValue(v), val)) !== void 0
    },

    __onClick  (e) {
      this.$refs.target.focus()

      if (this.menu === true) {
        this.menu = false
      }
      else {
        if (this.$listeners.filter !== void 0) {
          this.filter(this.inputValue)
        }
        else {
          this.menu = true
        }
      }
    },

    __onFocusin (e) {
      this.targetFocused = true
    },

    __onTargetFocus (e) {
      if (this.useInput === true && this.inputValue.length > 0) {
        e.target.setSelectionRange(0, this.inputValue.length)
      }
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
        this.removeValue(this.value[this.value.length - 1])
        return
      }

      // enter
      if (e.keyCode !== 13) { return }

      if (this.optionIndex > -1 && this.options.length > this.optionIndex) {
        this.toggleOption(this.options[this.optionIndex])
        return
      }

      if (this.multiple === true && this.$listeners['new-value'] !== void 0 && this.inputValue.length > 0) {
        this.menu = false
        this.$emit('new-value', this.inputValue, val => {
          val !== void 0 && val !== null && this.addValue(val)
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

        if (this.menu === true && this.options.length > 0) {
          let index = this.optionIndex
          do {
            index = normalizeToInterval(
              index + (e.keyCode === 38 ? -1 : 1),
              0,
              this.options.length - 1
            )
          }
          while (index !== this.optionIndex && this.options[index].disable === true)

          const dir = index > this.optionIndex ? 1 : -1
          this.optionIndex = index

          this.$nextTick(() => {
            const el = this.$refs.menu.querySelector('.q-focusable--focused')
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

    __onMenuFocusin () {
      this.optionIndex = -1
    },

    __onFocusout () {
      setTimeout(() => {
        clearTimeout(this.inputTimer)

        if (this.$refs === void 0 || this.$refs.control === void 0) {
          this.targetFocused = false
          return
        }

        const el = document.activeElement

        if (this.$refs.control.contains(el) !== false) {
          return
        }

        this.targetFocused = false

        if (this.menu === true && el !== document.body) {
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
        const
          disable = this.editable !== true,
          tabindex = this.targetFocused === true && disable === false ? 0 : -1

        return this.selectedScope.map(scope => h(QChip, {
          props: {
            removable: true,
            disable,
            tabindex,
            dense: true,
            textColor: this.color
          },
          on: {
            remove: () => { scope.removeValue(scope.opt) }
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
        props: {
          clickable: true,
          disable: scope.opt.disable,
          dense: this.dense,
          active: scope.selected,
          focused: scope.focused,
          tabindex: -1
        },
        on: {
          click: () => { scope.toggleOption(scope.opt, scope.index) }
        },
        nativeOn: {
          mouseenter: () => { scope.setOptionIndex(scope.index) }
        }
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

      // const fit = this.expandBesides === true || this.noOptions === true || this.filter !== void 0

      return h('transition', {
        props: { name: this.transition }
      }, [
        this.menu === true
          ? h('div', {
            ref: 'menu',
            staticClass: 'q-local-menu scroll',
            on: {
              click: stopAndPrevent,
              focusin: this.__onMenuFocusin,
              focusout: this.__onFocusout,
              '&scroll': this.__onMenuScroll
            },
            directives: [{
              name: 'click-outside',
              value: () => { this.menu = false },
              arg: [ this.$refs.control ]
            }]
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
          focus: this.__onTargetFocus,
          keydown: this.__onTargetKeydown
        }
      })
    },

    __onInputValue (e) {
      clearTimeout(this.inputTimer)
      this.inputValue = e.target.value || ''

      if (this.$listeners.filter !== void 0) {
        this.inputTimer = setTimeout(() => {
          this.filter(this.inputValue)
        }, this.inputDebounce)
      }
    },

    filter (val) {
      this.menu = false
      this.optionIndex = -1
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
    }
  },

  beforeDestroy () {
    clearTimeout(this.inputTimer)
    document.body.removeEventListener('keydown', this.__onGlobalKeydown)
  }
})
