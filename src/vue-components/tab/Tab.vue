<template>
  <router-link
    v-if="route"
    ref="routerLink"
    :to="route"
    :replace="replace"
    :append="append"
    :exact="exact"
    tag="div"
    class="q-tab items-center justify-center"
    :class="{
      active: isActive,
      hidden: hidden,
      disabled: disable,
      hideIcon: hide === 'icon',
      hideLabel: hide === 'label'
    }"
    @click.stop.prevent="activate()"
  >
    <i v-if="icon" class="q-tabs-icon">{{icon}}</i>
    <span class="q-tab-label">
      <slot></slot>
    </span>
  </router-link>
  <div
    v-else
    class="q-tab items-center justify-center"
    :class="{
      active: isActive,
      hidden: hidden,
      disabled: disable,
      hideIcon: hide === 'icon',
      hideLabel: hide === 'label'
    }"
    @click="activate()"
  >
    <i v-if="icon" class="q-tabs-icon">{{icon}}</i>
    <span class="q-tab-label">
      <slot></slot>
    </span>
  </div>
</template>

<script>
import Utils from '../../utils'

export default {
  props: {
    label: String,
    icon: String,
    disable: Boolean,
    hidden: Boolean,
    hide: {
      type: String,
      default: ''
    },
    name: String,
    route: [String, Object],
    replace: Boolean,
    exact: Boolean,
    append: Boolean
  },
  computed: {
    uid () {
      return this.name || Utils.uid()
    },
    isActive () {
      return this.$parent.activeTab === this.uid
    },
    targetElement () {
      return this.$parent.refs && this.$parent.refs[this.uid]
    }
  },
  watch: {
    isActive (value) {
      this.$emit('selected', value)
      this.setTargetVisibility(value)
    }
  },
  created () {
    if (this.route) {
      this.$watch('$route', () => {
        this.$nextTick(() => {
          this.__selectTabIfRouteMatches()
        })
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.setTargetVisibility(this.isActive)
      if (this.route) {
        this.__selectTabIfRouteMatches()
      }
    })
  },
  methods: {
    activate () {
      if (!this.isActive && !this.disable) {
        if (this.route) {
          this.$refs.routerLink.$el.click()
        }
        else {
          this.$parent.setActiveTab(this.uid)
        }
      }
    },
    deactivate () {
      if (this.isActive && !this.disable) {
        this.$parent.setActiveTab(false)
      }
    },
    setTargetVisibility (visible) {
      if (this.targetElement) {
        this.targetElement.style.display = visible ? '' : 'none'
      }
    },
    __selectTabIfRouteMatches () {
      this.$nextTick(() => {
        if (this.route && this.$refs.routerLink.$el.classList.contains('router-link-active')) {
          this.$parent.setActiveTab(this.uid)
        }
      })
    }
  }
}
</script>
