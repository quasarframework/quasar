<template>
  <div class="q-option-group group" :class="{'q-option-group-inline-opts': inline}">
    <div v-for="(opt, index) in options">
      <component
        :is="component"
        v-model="model"
        :val="opt.value"
        :disable="disable"
        :label="opt.label"
        :left-label="leftLabel"
        :color="opt.color || color"
        :checked-icon="opt.checkedIcon"
        :unchecked-icon="opt.uncheckedIcon"
        @focus="__onFocus"
        @blur="__onBlur"
        @change="__onChange"
      ></component>
    </div>
  </div>
</template>

<script>
import { QRadio } from '../radio'
import { QCheckbox } from '../checkbox'
import { QToggle } from '../toggle'

export default {
  name: 'q-option-group',
  components: {
    QRadio,
    QCheckbox,
    QToggle
  },
  props: {
    value: {
      required: true
    },
    type: {
      default: 'radio',
      validator (val) {
        return ['radio', 'checkbox', 'toggle'].includes(val)
      }
    },
    color: String,
    options: {
      type: Array,
      validator (opts) {
        return opts.every(opt => 'value' in opt && 'label' in opt)
      }
    },
    leftLabel: Boolean,
    inline: Boolean,
    disable: Boolean
  },
  inject: ['__field'],
  computed: {
    component () {
      return `q-${this.type}`
    },
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    length () {
      return this.value
        ? (this.type === 'radio' ? 1 : this.value.length)
        : 0
    }
  },
  methods: {
    __onChange () {
      this.$nextTick(() => {
        this.$emit('change', this.model)
      })
    },
    __onFocus () {
      this.$emit('focus')
    },
    __onBlur () {
      this.$emit('blur')
    }
  },
  created () {
    const isArray = Array.isArray(this.value)
    if (this.type === 'radio') {
      if (isArray) {
        console.error('q-option-group: model should not be array')
      }
    }
    else if (!isArray) {
      console.error('q-option-group: model should be array in your case')
    }
    if (this.__field) {
      this.field = this.__field
      this.field.__registerInput(this, true)
    }
  },
  beforeDestroy () {
    if (this.__field) {
      this.field.__unregisterInput()
    }
  }
}
</script>
