<template>
  <div class="item item-link drawer-closer" v-link.delay="to" v-ripple>
    <i v-if="icon" class="item-primary">{{icon}}</i>
    <div class="item-content">
      <div>
        <slot></slot>
      </div>
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
