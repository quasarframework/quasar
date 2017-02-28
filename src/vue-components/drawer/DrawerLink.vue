<template>
  <div class="item link drawer-closer" v-link.delay="to" v-ripple.mat>
    <div v-if="icon" class="item-primary"><i>{{icon}}</i></div>
    <div class="item-content text">
      <div class="ellipsis">
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
