<template>
  <div class="q-stepper-navigation row items-center">
    <slot name="left"></slot>
    <div class="auto"></div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'q-stepper-navigation'
}
</script>
