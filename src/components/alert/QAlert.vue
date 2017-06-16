<template>
  <div :class="containerClass" class="q-alert-container">
    <q-transition
      :name="name"
      :enter="enter"
      :leave="leave"
      :duration="duration"
      @after-leave="__dismissed"
      :appear="appear"
    >
      <div
        v-if="active"
        class="q-alert row no-wrap"
        :class="classes"
      >
        <div class="q-alert-icon row col-auto items-center justify-center">
          <q-icon :name="alertIcon"></q-icon>
        </div>
        <div class="q-alert-content col self-center">
          <slot></slot>
          <div
            v-if="actions && actions.length"
            class="q-alert-actions row items-center"
          >
            <span
              v-for="btn in actions"
              :key="btn"
              @click="dismiss(btn.handler)"
              v-html="btn.label"
              class="uppercase"
            ></span>
          </div>
        </div>
        <div
          v-if="dismissible"
          class="q-alert-close self-top col-auto"
        >
          <q-icon
            name="close"
            class="cursor-pointer"
            @click="dismiss"
          ></q-icon>
        </div>
      </div>
    </q-transition>
  </div>
</template>

<script>
import typeIcon from '../../utils/type-icons'
import { QIcon } from '../icon'
import { QTransition } from '../transition'

export default {
  name: 'q-alert',
  components: {
    QIcon,
    QTransition
  },
  props: {
    value: Boolean,
    duration: Number,
    name: String,
    enter: String,
    leave: String,
    appear: Boolean,
    color: {
      type: String,
      default: 'negative'
    },
    icon: String,
    dismissible: Boolean,
    actions: Array,
    position: {
      type: String,
      validator: v => [
        'top', 'top-right', 'right', 'bottom-right',
        'bottom', 'bottom-left', 'left', 'top-left'
      ].includes(v)
    }
  },
  data () {
    return {
      active: true
    }
  },
  watch: {
    value (v) {
      if (v !== this.active) {
        this.active = v
      }
    }
  },
  computed: {
    alertIcon () {
      return this.icon || typeIcon[this.color] || typeIcon.warning
    },
    containerClass () {
      if (this.position) {
        return `fixed-${this.position} z-alert`
      }
    },
    classes () {
      return `shadow-2 bg-${this.color}`
    }
  },
  methods: {
    __dismissed () {
      this.$emit('dismiss')
      this.__onDismiss && this.__onDismiss()
    },
    dismiss (fn) {
      this.active = false
      this.$emit('input', false)
      if (typeof fn === 'function') {
        this.__onDismiss = fn
      }
    }
  }
}
</script>
