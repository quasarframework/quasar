import Vue from 'vue'

import QField from '../field/QField.js'
import QMenu from '../menu/QMenu.js'
import QIcon from '../icon/QIcon.js'

import QItem from '../list/QItem.js'
import QItemSection from '../list/QItemSection.js'

import SelectAutocompleteMixin from './select-autocomplete-mixin.js'

import { isDeepEqual } from '../../utils/is.js'

export default Vue.extend({
  name: 'QSelect',

  mixins: [ QField, SelectAutocompleteMixin ],

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
      optionsToShow: 20
    }
  },

  computed: {
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
        return this.value.length + (this.maxValues !== void 0 ? ' / ' + this.maxValues : '')
      }
    },

    optionScope () {
      return this.options.slice(0, this.optionsToShow).map((opt, i) => ({
        index: i,
        opt,
        selected: this.__isSelected(opt),
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
      if (opt.disable === true) { return }

      if (this.multiple !== true) {
        if (!isDeepEqual(this.value, opt)) {
          this.$emit('input', opt)
        }

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

    __onFocus (e) {
      this.focused = true
      this.optionsToShow = 20
      this.$emit('focus', e)
    },

    __onBlur (e) {
      this.focused = false
      this.$emit('blur', e)
    },

    __onScroll () {
      if (this.avoidScroll !== true && this.optionsToShow < this.options.length) {
        const el = this.$refs.menu.__portal.$el

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

      if (this.hasInput === true) {
        child.push(this.__getInput(h))
      }

      return h('div', {
        staticClass: 'q-field__native row items-center',
        attrs: { tabindex: this.editable === true ? 0 : null },
        on: this.editable === true ? {
          focus: this.__onFocus,
          blur: this.__onBlur
        } : null
      }, child)
    },

    __getOptions (h) {
      const fn = this.$scopedSlots.option || (scope => h(QItem, {
        key: scope.index,
        props: {
          clickable: true,
          disable: scope.opt.disable,
          dense: this.dense,
          active: scope.selected
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

    __getDefaultSlot (h) {
      if (
        this.editable === false ||
        (this.noOptions === true && this.$slots['no-option'] === void 0)
      ) {
        return
      }

      return h(QMenu, {
        ref: 'menu',
        props: {
          [this.expandBesides === true || this.noOptions === true || this.filter !== void 0 ? 'fit' : 'cover']: true,
          autoClose: this.multiple !== true && this.noOptions !== true
        },
        on: {
          'before-show': this.__onFocus,
          'before-hide': this.__onBlur,
          '&scroll': this.__onScroll
        }
      }, this.noOptions === true ? this.$slots['no-option'] : this.__getOptions(h))
    },

    __getInnerAppend (h) {
      return [
        h(QIcon, {
          props: { name: this.dropdownArrowIcon }
        })
      ]
    }
  },

  created () {
    this.fieldClass = 'q-select q-field--auto-height'
  }
})
