<template>
  <li :class="{active: opened}" @click="toggle()">
    <slot></slot>
  </li>
</template>

<script>
  export default {
    data () {
      return {
        opened: false
      }
    },
    events: {
      closeYourself (item) {
        if (this !== item) {
          this.opened = false
        }
      }
    },
    methods: {
      toggle () {
        this.opened = !this.opened

        if (this.opened) {
          this.$dispatch('closeOtherItems', this)
        }
      }
    }
  }
</script>
