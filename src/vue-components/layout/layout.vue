<template>
  <div class="layout">
    <div class="layout-header">
      <slot name="header"></slot>
    </div>

    <slot name="navigation"></slot>

    <div class="layout-content">
      <slot></slot>
    </div>

    <div class="layout-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {}
</script>
