<template>
  <div class="q-input-group" :class="{'inline-opts': inline}">
    <label class="row no-wrap" v-for="(opt, index) in options">
      <component
        :is="component"
        v-model="single ? model : model[index]"
        :val="opt.value"
        :disable="disable"
        :class="color"
      ></component>

      <div class="auto">{{ opt.label }}</div>
    </label>
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
