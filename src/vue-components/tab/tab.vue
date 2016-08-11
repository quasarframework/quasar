<template>
  <div
    class="quasar-tab items-center justify-center"
    :class="{'v-link-active': active, hidden: hidden, disabled: disabled, hideIcon: hide === 'icon', hideLabel: hide === 'label'}"
    @click="activate()"
  >
      <i v-if="icon" class="quasar-tabs-icon">{{icon}}</i>
      <span class="quasar-tab-label">
        <slot></slot>
      </span>
  </div>
</template>

<script>
export default {
  props: ['active', 'hidden', 'disabled', 'hide', 'icon', 'label', 'target'],
  methods: {
    activate () {
      if (this.disabled) {
        return
      }
      this.active = true
    }
  },
  events: {
    blur (tab) {
      if (tab === this) {
        return
      }
      this.active = false
    }
  },
  watch: {
    active (value) {
      if (this.disabled) {
        return
      }
      if (value) {
        this.$dispatch('selected', this, this.$el)
      }
    },
    hidden (value) {
      this.$dispatch('hidden')
    }
  },
  ready () {
    if (this.active && this.target) {
      this.$nextTick(() => {
        this.$dispatch('selected', this, this.$el)
      })
    }
  }
}
</script>
