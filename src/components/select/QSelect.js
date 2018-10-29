import Vue from 'vue'

import QField from '../field/QField.js'
import QMenu from '../menu/QMenu.js'

import QItem from '../list/QItem.js'
import QItemSection from '../list/QItemSection.js'

export default Vue.extend({
  name: 'QSelect',

  mixins: [ QField ],

  props: {
    value: {
      required: true
    },

    multiple: Boolean,

    options: {
      type: Array,
      default: () => []
    },

    optionLabel: {
      type: String,
      default: 'label'
    },
    optionValue: {
      type: String,
      default: 'value'
    },

    counter: Boolean
  },

  computed: {
    innerValue () {
      return this.value === void 0 || this.value === null
        ? false
        : this.value
    },

    selected () {
      if (this.multiple === true) {
        return this.options
          .filter(opt => this.value.includes(opt[this.optionValue]))
          .map(opt => opt[this.optionLabel])
          .join(', ')
      }

      const opt = this.options.find(opt => opt[this.optionValue] === this.value)
      return opt ? opt[this.optionLabel] : ''
    },

    computedCounter () {
      if (this.multiple === true && this.counter === true) {
        return this.value.length
      }
    },

    optionScope () {
      return this.options.map((opt, i) => ({
        index: i,
        opt,
        active: this.multiple === true
          ? this.value.includes(opt[this.optionValue])
          : this.value === opt[this.optionValue],
        click: () => { this.__pick(opt) }
      }))
    }
  },

  methods: {
    __pick (opt) {
      if (this.multiple) {
        const
          value = opt[this.optionValue],
          model = [].concat(this.value),
          index = model.indexOf(value)

        if (index > -1) {
          this.$emit('remove', { index, value: model.splice(index, 1) })
        }
        else {
          this.$emit('add', { index: model.length, value })
          model.push(value)
        }

        this.$emit('input', model)
      }
      else {
        const val = opt[this.optionValue]
        this.value !== val && this.$emit('input', val)
      }
    },

    __onFocus (e) {
      this.focused = true
      this.$emit('focus', e)
    },

    __onBlur (e) {
      this.focused = false
      this.$emit('blur', e)
    },

    __getControl (h) {
      return h('div', {
        staticClass: 'q-field__native row items-center no-wrap',
        domProps: this.$slots.selected === void 0 ? {
          innerHTML: this.selected
        } : null
      }, this.$slots.selected)
    },

    __getOptions (h) {
      const fn = this.$scopedSlots.option || (scope => h(QItem, {
        key: scope.index,
        props: {
          clickable: true,
          active: scope.active
        },
        on: {
          click: scope.click
        }
      }, [
        h(QItemSection, {
          domProps: {
            innerHTML: scope.opt[this.optionLabel]
          }
        })
      ]))

      return this.optionScope.map(fn)
    },

    __getDefaultSlot (h) {
      if (this.editable === false) { return }

      return h(QMenu, {
        props: {
          cover: true,
          autoClose: this.multiple !== true
        },
        on: {
          'before-show': this.__onFocus,
          'before-hide': this.__onBlur
        }
      }, this.__getOptions(h))
    }
  },

  created () {
    this.fieldClass = 'q-select'
  }
})
