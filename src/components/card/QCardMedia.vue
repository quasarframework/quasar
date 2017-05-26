<template>
  <div class="q-card-media relative-position">
    <slot></slot>
    <div class="q-card-media-overlay" :class="classes">
      <slot name="overlay"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'q-card-media',
  props: {
    overlayPosition: {
      type: String,
      default: 'bottom',
      validator: v => ['top', 'bottom', 'full'].includes(v)
    }
  },
  computed: {
    classes () {
      return `absolute-${this.overlayPosition}`
    }
  }
}
</script>
