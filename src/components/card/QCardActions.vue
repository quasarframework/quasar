<template>
  <div
    class="q-card-actions"
    :class="classes"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'q-card-actions',
  props: {
    vertical: Boolean,
    align: {
      type: String,
      default: 'start',
      validator: v => ['start', 'center', 'end', 'around'].includes(v)
    }
  },
  computed: {
    classes () {
      return [
        `q-card-actions-${this.vertical ? 'vert column justify-start' : 'horiz row'}`,
        `${this.vertical ? 'items' : 'justify'}-${this.align}`
      ]
    }
  }
}
</script>
