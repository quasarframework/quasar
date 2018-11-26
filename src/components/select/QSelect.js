import Vue from 'vue'

import QField from '../field/QField.js'
import QMenu from '../menu/QMenu.js'
import QIcon from '../icon/QIcon.js'

import QItem from '../list/QItem.js'
import QItemSection from '../list/QItemSection.js'

import { isDeepEqual } from '../../utils/is.js'

export default Vue.extend({
  name: 'QSelect',

  mixins: [ QField ],

  props: {
    value: {
      required: true
    },

    useObject: Boolean,
    multiple: Boolean,

    displayValue: [String, Number],
    dropdownIcon: String,

    options: {
      type: Array,
      default: () => []
    },

    optionLabel: {
      type: [Function, String],
      default: 'label'
    },
    optionValue: {
      type: [Function, String],
      default: 'value'
    },

    counter: Boolean,
    maxValues: [Number, String],

    expandBesides: Boolean
  },

  data () {
    return {
      optionsToShow: 20,
      innerValue: this.__getInnerValue(this.options)
    }
  },

  watch: {
    value (v) {
      if (this.avoidValueWatcher === true) {
        this.avoidValueWatcher = false
      }
      else {
        this.innerValue = this.__getInnerValue(this.options)
      }
    },

    options (opts) {
      this.innerValue = this.__getInnerValue(opts)
    }
  },

  computed: {
    selected () {
      const filter = this.innerValue
        .map(opt => this.__getOptionLabel(opt))

      return this.multiple === true
        ? filter.join(', ')
        : (filter[0] !== void 0 ? filter[0] : '')
    },

    computedCounter () {
      if (this.multiple === true && this.counter === true) {
        return this.value.length + (this.maxValues !== void 0 ? ' / ' + this.maxValues : '')
      }
    },

    selectedScope () {
      return this.innerValue.map((opt, i) => ({
        index: i,
        opt,
        selected: this.__isSelected(opt),
        remove: () => { this.toggleOption(opt) }
      }))
    },

    optionScope () {
      return this.options.slice(0, this.optionsToShow).map((opt, i) => ({
        index: i,
        opt,
        selected: this.__isSelected(opt),
        click: () => { this.toggleOption(opt) }
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

      const val = this.__getOptionValue(opt)

      if (this.multiple === true) {
        const
          model = [].concat(this.value),
          index = model.findIndex(v => isDeepEqual(v, val))

        if (index > -1) {
          this.$emit('remove', { index, value: model.splice(index, 1) })
          this.innerValue = this.innerValue.filter(v => v !== opt)
        }
        else {
          if (this.maxValues !== void 0 && model.length >= this.maxValues) {
            return
          }

          this.$emit('add', { index: model.length, value: opt })
          model.push(val)
          this.innerValue.push(opt)
        }

        this.avoidValueWatcher = true
        this.$emit('input', model)
      }
      else if (!isDeepEqual(this.value, val)) {
        this.innerValue = this.__getInnerValue(this.options, val)
        this.avoidValueWatcher = true
        this.$emit('input', val)
      }
    },

    __getInnerValue (opts, value = this.value) {
      if (value === void 0 || value === null) {
        return []
      }

      if (this.multiple === true) {
        const optValue = opts.map(opt => this.__getOptionValue(opt))
        return value.map(val => opts.find((opt, i) => isDeepEqual(optValue[i], val)))
          .filter(v => v !== void 0)
      }

      const res = opts.find(opt => isDeepEqual(this.__getOptionValue(opt), value))
      return res !== void 0 ? [ res ] : []
    },

    __getOptionValue (opt) {
      if (this.useObject === true) {
        return opt
      }

      const prop = this.optionValue
      return typeof prop === 'function'
        ? prop(opt)
        : opt[prop]
    },

    __getOptionLabel (opt) {
      const prop = this.optionLabel
      return typeof prop === 'function'
        ? prop(opt)
        : opt[prop]
    },

    __isSelected (opt) {
      return this.innerValue.includes(opt)
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
        : (this.$slots.selected !== void 0 ? this.$slots.selected : this.displayValue || void 0)

      return h('div', {
        staticClass: 'q-field__native row items-center',
        attrs: { tabindex: this.editable === true ? 0 : null },
        on: this.editable === true ? {
          focus: this.__onFocus,
          blur: this.__onBlur
        } : null,
        domProps: child === void 0 ? {
          innerHTML: this.selected
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
          click: scope.click
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
      if (this.editable === false) { return }

      return h(QMenu, {
        ref: 'menu',
        props: {
          [this.expandBesides === true ? 'fit' : 'cover']: true,
          autoClose: this.multiple !== true
        },
        on: {
          'before-show': this.__onFocus,
          'before-hide': this.__onBlur,
          '&scroll': this.__onScroll
        }
      }, this.__getOptions(h))
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
