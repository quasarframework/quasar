<template>
  <div class="layout">
    <div class="layout-header">
      <slot name="header"></slot>
      <slot v-if="!ios" name="navigation"></slot>
    </div>

    <div class="layout-content">
      <slot></slot>
    </div>

    <div class="layout-footer">
      <slot v-if="ios" name="navigation"></slot>
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
import { current as theme } from '../../theme'

export default {
  data () {
    return {
      ios: theme === 'ios'
    }
  }
}
</script>
