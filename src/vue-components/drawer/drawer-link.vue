<template>
  <div class="item item-link drawer-closer">
    <i v-if="icon">{{icon}}</i>
    <div class="item-content text-truncate">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ['icon']
}
</script>
