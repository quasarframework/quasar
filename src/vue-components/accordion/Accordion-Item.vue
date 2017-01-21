<template>
  <div class="q-accordion-item">
    <div class="item item-link non-selectable item-collapsible" @click="__toggleItem()">
      <i class="item-primary" v-if="icon" v-text="icon"></i>
      <img class="item-primary thumbnail" v-if="img" :src="img"></i>
      <img class="item-primary" v-if="avatar" :src="avatar"></i>
      <div class="item-content has-secondary">
        <div>{{ label }}</div>
      </div>
      <i class="item-secondary" :class="{'rotate-180': active}" @click.stop="toggle()">keyboard_arrow_down</i>
    </div>
    <q-transition name="slide">
      <div class="q-accordion-sub-item" v-show="active">
        <slot></slot>
      </div>
    </q-transition>
  </div>
</template>

<script>
export default {
  props: {
    opened: Boolean,
    icon: String,
    img: String,
    avatar: String,
    label: String,
    iconToggle: Boolean
  },
  data () {
    return {
      active: this.opened,
      element: -1
    }
  },
  watch: {
    opened (value) {
      this.active = value
    }
  },
  methods: {
    toggle () {
      this.active = !this.active
      this.$parent.config.currentElement = this.element
      this.$parent.toggle()
    },
    open () {
      this.active = true
      this.$parent.config.currentElement = this.element
      this.$parent.open()
    },
    close () {
      this.active = false
      this.$parent.config.currentElement = this.element
      this.$parent.close()
    },
    __toggleItem () {
      if (!this.iconToggle) {
        this.toggle()
      }
    }
  }
}
</script>
