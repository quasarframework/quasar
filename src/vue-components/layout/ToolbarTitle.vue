<template>
  <div class="toolbar-content">
    <div
      class="toolbar-title"
      :class="['padding-' + padding]"
    >
      <div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    padding: {
      type: Number,
      default: 1
    }
  }
}
</script>
