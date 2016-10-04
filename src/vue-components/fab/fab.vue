<template>
  <div
    class="quasar-fab flex inline justify-center"
    :class="{opened: opened, 'with-backdrop': click || backdrop}"
  >
    <div v-if="click || backdrop" class="backdrop" @click="toggle(true)"></div>
    <button class="circular raised" @click="toggle()" :class="type">
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
    type: {
      type: Array,
      default () {
        return ['primary']
      },
      coerce (value) {
        return Array.isArray(value) || typeof value === 'undefined' ? value : value.split(' ')
      }
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
    },
    click: {
      type: Function
    },
    backdrop: {
      type: Boolean,
      coerce: Boolean
    }
  },
  data () {
    return {
      opened: false
    }
  },
  methods: {
    toggle (fromBackdrop) {
      this.opened = !this.opened

      if (!fromBackdrop && this.click && !this.opened) {
        this.click()
        return
      }
    }
  },
  events: {
    closeFAB () {
      this.toggle(true)
    }
  }
}
</script>
