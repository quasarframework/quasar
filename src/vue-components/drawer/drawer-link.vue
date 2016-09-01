<template>
  <div class="item item-link drawer-closer">
    <i v-if="icon" class="item-primary">{{icon}}</i>
    <div class="item-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ['icon']
}
</script>
