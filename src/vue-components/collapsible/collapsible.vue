<template>
  <div class="quasar-collapsible">
    <div class="item item-link non-selectable item-collapsible" @click="toggle()">
      <i class="item-primary" v-if="icon" v-text="icon"></i>
      <img class="item-primary thumbnail" v-if="img" :src="img"></i>
      <img class="item-primary" v-if="avatar" :src="avatar"></i>
      <div class="item-content has-secondary">
        <div>{{ label }}</div>
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
    value: {
      type: Boolean,
      default: false
    },
    icon: String,
    img: String,
    avatar: String,
    label: String
  },
  methods: {
    toggle () {
      this.$emit('input', !this.active)
    }
  }
}
</script>
