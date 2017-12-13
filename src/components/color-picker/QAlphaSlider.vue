<template>
<div
  class="q-alpha-slider non-selectable"
>
  <q-slider :value="alpha" @input="__onInput" :min="0" :max="100" label />
</div>
</template>

<script>
import QSlider from '../slider/QSlider.vue'

export default {
  name: 'q-alpha-slider',
  components: {
    QSlider
  },
  props: {
    value: Number
  },
  computed: {
    alpha () { return this.value }
  },
  methods: {
    __onInput (val) {
      this.$emit('input', val)
      this.$emit('change', val)
    }
  }
}
</script>
