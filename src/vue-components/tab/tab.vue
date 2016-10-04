<template>
  <div
    class="quasar-tab items-center justify-center"
    :class="{'v-link-active': active, hidden: hidden, disabled: disable, hideIcon: hide === 'icon', hideLabel: hide === 'label'}"
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
  props: ['active', 'hidden', 'disable', 'hide', 'icon', 'label', 'target'],
  methods: {
    activate () {
      if (this.disable) {
        return
      }
      this.active = true
    },
    setTargetVisibility (visible) {
      if (this.targetElement) {
        this.targetElement.style.display = visible ? '' : 'none'
      }
    }
  },
  computed: {
    targetElement () {
      // if no target
      if (!this.target) {
        return
      }

      return document.querySelector(this.target)
    }
  },
  events: {
    tabSelected (tab) {
      let targetIsMe = tab === this

      if (!targetIsMe) {
        this.active = false
      }

      this.setTargetVisibility(tab === this)
    }
  },
  watch: {
    active (value) {
      if (this.disable) {
        return
      }
      if (value) {
        this.$dispatch('selected', this)
      }
    },
    hidden (value) {
      this.$dispatch('hidden')
    },
    target (value, oldValue) {
      if (oldValue) {
        let oldTab = document.querySelector(oldValue)
        if (oldTab) {
          oldTab.style.display = 'none'
        }
      }
      this.$nextTick(() => {
        this.setTargetVisibility(this.active)
      })
    },
    '$route' (value) {
      this.$nextTick(() => {
        if (this.$el.classList.contains('v-link-active')) {
          this.$dispatch('selected', this)
        }
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.active && this.target || this.$el.classList.contains('v-link-active')) {
        this.$nextTick(() => {
          this.$dispatch('selected', this)
        })
      }
      else {
        this.setTargetVisibility(false)
      }
    })
  }
}
</script>
