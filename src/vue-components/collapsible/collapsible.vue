<template>
  <div class="quasar-collapsible">
    <div class="item item-link non-selectable cursor-pointer item-collapsible" @click="toggle()">
      <i class="item-primary" v-if="icon" v-text="icon"></i>
      <img class="item-primary thumbnail" v-if="img" :src="img"></i>
      <img class="item-primary" v-if="avatar" :src="avatar"></i>
      <div class="item-content has-secondary">
        {{ label }}
      </div>
      <i class="item-secondary" :class="{'rotate-180': active}">keyboard_arrow_down</i>
    </div>
    <div class="quasar-collapsible-sub-item" v-show="active" transition="slide">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
      twoWay: true,
      coerce: Boolean
    },
    icon: String,
    img: String,
    avatar: String,
    label: String
  },
  methods: {
    toggle () {
      this.active = !this.active
    }
  }
}
</script>
