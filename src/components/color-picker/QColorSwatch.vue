<template>
<div
  class="q-color-swatch non-selectable"
  :style="style"
>
</div>
</template>

<script>
export default {
  name: 'q-color-swatch',
  props: {
    value: Object
  },
  computed: {
    style () {
      return { 'background-color': `rgba(${this.value.rgba.r}, ${this.value.rgba.g}, ${this.value.rgba.b}, ${this.value.rgba.a})` }
    }
  }
}
</script>
