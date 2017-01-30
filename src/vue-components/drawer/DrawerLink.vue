<template>
  <div class="item item-link drawer-closer" v-link.delay="to">
    <i v-if="icon" class="item-primary">{{icon}}</i>
    <div class="item-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    icon: String,
    to: {
      type: [Object, String],
      required: true
    }
  }
}
</script>
