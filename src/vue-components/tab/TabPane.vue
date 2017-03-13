<template>
  <div v-if="active" class="q-tab-pane">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  },
  inject: ['data'],
  computed: {
    active () {
      return this.data.tabName === this.name
    }
  }
}
</script>
