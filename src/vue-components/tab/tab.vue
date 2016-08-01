<template>
  <div
    class="tab items-center justify-center"
    :class="{active: active, hidden: hidden, disabled: disabled, hideIcon: hide === 'icon', hideLabel: hide === 'label'}"
    @click="activate()"
  >
      <i v-if="icon" class="tabs-icon">{{icon}}</i>
      <span class="tabs-label"><slot></slot></span>
  </div>
</template>

<script>
export default {
  props: ['active', 'hidden', 'disabled', 'hide', 'icon', 'label', 'target'],
  methods: {
    activate: function() {
      if (this.disabled) {
        return
      }
      this.active = true
    }
  },
  events: {
    blur: function(tab) {
      if (tab === this) {
        return
      }
      this.active = false
    }
  },
  watch: {
    active: function(value) {
      if (this.disabled) {
        return
      }
      if (value) {
        this.$dispatch('selected', this, $(this.$el))
      }
    },
    hidden: function(value) {
      this.$dispatch('hidden');
    }
  }
}
</script>
