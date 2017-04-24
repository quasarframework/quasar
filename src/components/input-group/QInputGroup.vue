<template>
  <div class="q-input-group small-gutter" :class="{'inline-opts': inline}">
    <div v-for="(opt, index) in options" class="no-wrap">
      <label class="row inline">
        <component
          :is="component"
          v-model="model"
          :val="opt.value"
          :disable="disable"
          :class="color"
          @focus="$emit('focus')"
          @blur="$emit('blur')"
        ></component>

        <span>{{ opt.label }}</span>
      </label>
    </div>
  </div>
</template>

<script>
import { QRadio } from '../radio'
import { QCheckbox } from '../checkbox'
import { QToggle } from '../toggle'

export default {
  name: 'q-input-group',
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
    inline: Boolean,
    disable: Boolean
  },
  created () {
    const isArray = Array.isArray(this.value)
    if (this.type === 'radio') {
      if (isArray) {
        console.error('q-radio: model should not be array')
      }
    }
    else if (!isArray) {
      console.error('q-radio: model should be array')
    }
  },
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
    }
  }
}
</script>
