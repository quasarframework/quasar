import Vue from 'vue'

import QField from '../field/QField.js'
import QIcon from '../icon/QIcon.js'
import QSpinner from '../spinner/QSpinner.js'

import QItem from '../list/QItem.js'
import QItemSection from '../list/QItemSection.js'

import SelectAutocompleteMixin from './select-filter-mixin.js'
import TransitionMixin from '../../mixins/transition.js'

import ClickOutside from '../../directives/click-outside.js'

import { isDeepEqual } from '../../utils/is.js'
import { stopAndPrevent } from '../../utils/event.js'
import { normalizeToInterval } from '../../utils/format.js'

export default Vue.extend({
  name: 'QSelect',

  mixins: [ QField, SelectAutocompleteMixin, TransitionMixin ],

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

    counter: Boolean,
    maxValues: [Number, String],

    expandBesides: Boolean
  },

  data () {
    return {
      menu: false,
      targetFocused: false,
      optionIndex: -1,
      optionsToShow: 20,
      filter: ''
    }
  },

  watch: {
    menu (show) {
      this.optionIndex = -1
      if (show === true) {
        this.optionsToShow = 20
      }
      document.body[(show === true ? 'add' : 'remove') + 'EventListener']('keydown', this.__onGlobalKeydown)
    }
  },

  computed: {
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
        toggleOption: this.toggleOption
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
        toggleOption: this.toggleOption
      }))
    },

    dropdownArrowIcon () {
      return this.dropdownIcon !== void 0
        ? this.dropdownIcon
        : this.$q.icon.select.dropdownIcon
    }
  },

  methods: {
    toggleOption (opt) {
      if (this.editable !== true || opt === void 0 || opt.disable === true) { return }

      console.log('toggleOption', opt)

      if (this.multiple !== true) {
        if (!isDeepEqual(this.value, opt)) {
          this.$emit('input', opt)
        }

        this.menu = false
        return
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
      console.log('click', this.menu)
      this.$refs.target.focus()
      if (this.menu === true) {
        this.menu = false
      }
      else {
        if (this.$listeners.filter !== void 0) {
          this.__filter(this.filter)
        }
        else {
          this.menu = true
        }
      }
    },

    __onTargetFocus (e) {
      console.log('focus')
      this.targetFocused = true
    },

    __onTargetBlur (e) {
      console.log('blur')
      this.targetFocused = false
    },

    __onTargetKeydown (e) {
      if (e.keyCode === 13) {
        console.log('__onTargetKeydown', this.optionIndex)
        if (this.optionIndex > -1) {
          this.toggleOption(this.options[this.optionIndex])
        }
        else if (this.menu === true) {
          this.menu = false
        }
        else if (this.$listeners.filter !== void 0) {
          this.__filter(this.filter)
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

    __onMenuFocusout () {
      setTimeout(() => {
        const el = document.activeElement
        if (el !== document.body && this.$refs.control.contains(el) === false) {
          this.menu = false
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

    __getControl (h) {
      const child = this.$scopedSlots.selected !== void 0
        ? this.selectedScope.map(scope => this.$scopedSlots.selected(scope))
        : (
          this.$slots.selected !== void 0
            ? this.$slots.selected
            : [
              h('span', {
                domProps: {
                  innerHTML: this.displayValue !== void 0
                    ? this.displayValue
                    : this.selectedString
                }
              })
            ]
        )

      if (this.withFilter === true) {
        child.push(this.__getFilter(h))
      }

      const data = this.editable === true && this.withFilter === false
        ? {
          ref: 'target',
          attrs: { tabindex: 0 },
          on: {
            focus: this.__onTargetFocus,
            blur: this.__onTargetBlur,
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
          focused: scope.focused
        },
        on: {
          click: () => { scope.toggleOption(scope.opt) }
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
              focusout: this.__onMenuFocusout,
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
          ? (this.$slots.loading !== void 0 ? this.$slots.loading : h(QSpinner))
          : null,

        h(QIcon, {
          props: { name: this.dropdownArrowIcon }
        })
      ]
    }
  },

  created () {
    this.fieldClass = 'q-select q-field--auto-height'
  },

  beforeDestroy () {
    document.body.removeEventListener('keydown', this.__onGlobalKeydown)
  }
})
