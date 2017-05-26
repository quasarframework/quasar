<template>
  <div
    class="q-card"
    :class="{
      'no-border-radius': square,
      'no-shadow': flat,
      row: horizontal,
      column: !horizontal,
      inline: !block
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
    block: Boolean
  }
}
</script>
