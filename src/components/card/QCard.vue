<template>
  <div
    class="q-card"
    :class="{
      'no-border-radius': square,
      'no-shadow': flat,
      row: horizontal,
      column: !horizontal,
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
    horizontal: Boolean,
    inline: Boolean
  }
}
</script>
