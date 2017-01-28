<template>
  <div class="q-collapsible">
    <div class="item item-link non-selectable item-collapsible" @click="__toggleItem">
      <i class="item-primary" v-if="icon" v-text="icon"></i>
      <img class="item-primary thumbnail" v-if="img" :src="img"></i>
      <img class="item-primary" v-if="avatar" :src="avatar"></i>
      <div class="item-content has-secondary">
        <div>{{ label }}</div>
      </div>
      <i class="item-secondary" :class="{'rotate-180': active}" @click.stop="toggle">keyboard_arrow_down</i>
    </div>
    <q-transition name="slide">
      <div class="q-collapsible-sub-item" v-show="active">
        <slot></slot>
      </div>
    </q-transition>
  </div>
</template>

<script>
import Events from '../../features/events'
const eventName = 'q:collapsible:close'

export default {
  props: {
    opened: Boolean,
    icon: String,
    group: String,
    img: String,
    avatar: String,
    label: String,
    iconToggle: Boolean
  },
  data () {
    return {
      active: this.opened
    }
  },
  watch: {
    opened (value) {
      this.active = value
    },
    active (value) {
      if (value && this.group) {
        Events.$emit(eventName, this)
      }
    }
  },
  methods: {
    toggle () {
      this.active = !this.active
    },
    open () {
      this.active = true
    },
    close () {
      this.active = false
    },
    __toggleItem () {
      if (!this.iconToggle) {
        this.toggle()
      }
    },
    __eventHandler (comp) {
      if (this.group && this !== comp && comp.group === this.group) {
        this.close()
      }
    }
  },
  created () {
    Events.$on(eventName, this.__eventHandler)
  },
  beforeDestroy () {
    Events.$off(eventName, this.__eventHandler)
  }
}
</script>
