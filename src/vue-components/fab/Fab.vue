<template>
  <div
    class="quasar-fab flex inline justify-center"
    :class="{opened}"
  >
    <div class="backdrop animate-fade" @click="toggle(true)"></div>
    <button class="circular raised" @click="toggle()" :class="classNames">
      <i class="quasar-fab-icon">{{icon}}</i>
      <i class="quasar-fab-active-icon">{{activeIcon}}</i>
    </button>
    <div class="quasar-fab-actions flex inline items-center" :class="[direction]">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    classNames: {
      default: 'primary'
    },
    icon: {
      type: String,
      default: 'add'
    },
    activeIcon: {
      type: String,
      default: 'close'
    },
    direction: {
      type: String,
      default: 'right'
    }
  },
  data () {
    return {
      opened: false
    }
  },
  methods: {
    open () {
      this.opened = true
    },
    close (fn) {
      this.opened = false
      if (typeof fn === 'function') {
        fn()
      }
    },
    toggle (fromBackdrop) {
      this.opened = !this.opened

      if (!fromBackdrop && !this.opened) {
        this.$emit('click')
      }
    }
  }
}
</script>
