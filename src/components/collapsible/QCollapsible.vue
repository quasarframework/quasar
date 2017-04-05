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

    <q-slide-transition>
      <div v-show="active">
        <div class="q-collapsible-sub-item" :class="{menu: menu}">
          <slot></slot>
        </div>
      </div>
    </q-slide-transition>
  </div>
</template>

<script>
import { QItem } from '../item'
import { QIcon } from '../icon'
import { QSlideTransition } from '../slide-transition'
import Ripple from '../../directives/ripple'
import Events from '../../features/events'

const eventName = 'q:collapsible:close'

export default {
  name: 'q-collapsible',
  components: {
    QItem,
    QIcon,
    QSlideTransition
  },
  directives: {
    Ripple
  },
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
    active (val) {
      if (val && this.group) {
        Events.$emit(eventName, this)
      }

      this.$emit(val ? 'open' : 'close')
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
