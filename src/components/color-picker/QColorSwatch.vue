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
      return { 'background-color': `rgba(${this.value.r}, ${this.value.g}, ${this.value.b}, ${this.value.a})` }
    }
  }
}
</script>
