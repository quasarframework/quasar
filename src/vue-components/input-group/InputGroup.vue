<template>
  <div class="q-input-group small-gutter" :class="{'inline-opts': inline}">
    <div v-for="(opt, index) in options" class="no-wrap">
      <label class="row inline">
        <q-radio
          v-if="single"
          v-model="model"
          :val="opt.value"
          :disable="disable"
          :class="color"
          @focus="$emit('focus')"
          @blur="$emit('blur')"
        ></q-radio>
        <component
          v-else
          :is="component"
          v-model="model[index]"
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
export default {
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
  computed: {
    single () {
      return this.type === 'radio'
    },
    component () {
      return `q-${this.type}`
    },
    model: {
      get () {
        return this.value
      },
      set (value) {
        if (value !== this.value) {
          this.$emit('input', value)
        }
      }
    }
  }
}
</script>
