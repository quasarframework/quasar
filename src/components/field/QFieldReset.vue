<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'q-field-reset',
  data () {
    return {}
  },
  provide () {
    return {
      __field: undefined
    }
  }
}
</script>
