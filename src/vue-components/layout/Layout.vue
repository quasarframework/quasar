<template>
  <div class="layout">
    <div class="layout-header">
      <slot name="header"></slot>
      <slot v-if="$q.theme !== 'ios'" name="navigation"></slot>
    </div>

    <div class="layout-content">
      <slot></slot>
    </div>

    <div class="layout-footer">
      <slot name="footer"></slot>
      <slot v-if="$q.theme === 'ios'" name="navigation"></slot>
    </div>
  </div>
</template>

<script>
export default {}
</script>
