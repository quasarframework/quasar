<template>
  <div class="q-collapsible">
    <slot name="header">
      <q-item
        :link="!iconToggle"
        class="non-selectable item-collapsible"
        @click.native="__toggleItem"
        :icon="icon"
        :img="img"
        :avatar="avatar"
        :letter="letter"
        text
        :no-ripple="iconToggle"
      >
        <q-icon
          slot="secondary"
          :name="arrowIcon"
          class="relative-position cursor-pointer"
          :class="{'rotate-180': active}"
          @click.stop="toggle"
          v-ripple.mat.stop="!iconToggle"
        ></q-icon>

        <slot name="label">
          <div class="ellipsis" v-html="label"></div>
          <div v-if="description" class="ellipsis" v-html="description"></div>
        </slot>
      </q-item>
    </slot>

    <q-transition name="slide">
      <div v-show="active">
        <div class="q-collapsible-sub-item" :class="{menu: menu}">
          <slot></slot>
        </div>
      </div>
    </q-transition>
  </div>
</template>

<script>
const eventName = 'q:collapsible:close'

export default {
  props: {
    opened: Boolean,
    menu: Boolean,
    icon: String,
    group: String,
    img: String,
    avatar: String,
    label: String,
    description: String,
    letter: String,
    iconToggle: Boolean,
    arrowIcon: {
      type: String,
      default: 'keyboard_arrow_down'
    }
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
        this.$q.events.$emit(eventName, this)
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
    this.$q.events.$on(eventName, this.__eventHandler)
  },
  beforeDestroy () {
    this.$q.events.$off(eventName, this.__eventHandler)
  }
}
</script>
