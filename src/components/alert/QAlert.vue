<template>
  <div
    v-if="active"
    class="q-alert row"
    :class="[`bg-${color}`, position ? `fixed-${position}` : '', position ? 'shadow-2' : '']"
  >
    <div class="q-alert-icon flex items-center justify-center">
      <slot name="left">
        <q-icon :name="alertIcon"></q-icon>
      </slot>
    </div>
    <div class="q-alert-content auto self-center">
      <slot></slot>
      <div
        v-if="buttons && buttons.length"
        class="q-alert-actions row items-center justify-between"
      >
        <span
          v-for="btn in buttons"
          :key="btn"
          @click="dismiss(btn.handler)"
          v-html="btn.label"
          class="uppercase"
        ></span>
      </div>
    </div>
    <div
      v-if="dismissible"
      class="q-alert-close self-top"
    >
      <q-icon
        name="close"
        class="cursor-pointer"
        @click="dismiss"
      ></q-icon>
    </div>
  </div>
</template>

<script>
import typeIcon from '../../utils/type-icons'
import { QIcon } from '../icon'

export default {
  name: 'q-alert',
  components: {
    QIcon
  },
  props: {
    value: Boolean,
    color: {
      type: String,
      default: 'negative'
    },
    icon: String,
    dismissible: Boolean,
    buttons: Array,
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
  computed: {
    alertIcon () {
      return typeIcon[this.color] || typeIcon.warning
    }
  },
  methods: {
    show () {
      this.$emit('input', true)
    },
    dismiss () {
      this.$emit('dismiss')
      this.$emit('input', false)
    },
    destroy () {
      this.active = false
      this.$nextTick(this.$destroy)
    }
  }
}
</script>
