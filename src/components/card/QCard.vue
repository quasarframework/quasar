<template>
  <div
    class="q-card column"
    :class="{
      'no-border-radius': square,
      'no-shadow': flat,
      inline: inline
    }"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'q-card',
  props: {
    square: Boolean,
    flat: Boolean,
    inline: Boolean
  }
}
</script>
