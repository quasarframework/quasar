<template>
<div
  class="q-hue-slider non-selectable"
>
  <q-slider :value="hue" @input="__onInput" :min="0" :max="360" label />
</div>
</template>

<script>
import QSlider from '../slider/QSlider.vue'

export default {
  name: 'q-hue-slider',
  components: {
    QSlider
  },
  props: {
    value: Number
  },
  computed: {
    hue () { return this.value }
  },
  methods: {
    __onInput (val) {
      this.$emit('input', val)
      this.$emit('change', val)
    }
  }
}
</script>
