<template>
  <div class="column absolute-full">
    <slot name="header"></slot>
    <slot v-if="$q.theme !== 'ios'" name="navigation"></slot>

    <div class="auto scroll">
      <slot></slot>
    </div>

    <slot name="footer"></slot>
    <slot v-if="$q.theme === 'ios'" name="navigation"></slot>
  </div>
</template>

<script>
export default {
  name: 'q-modal-layout'
}
</script>
