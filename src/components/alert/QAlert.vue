<template>
  <div
    v-if="active"
    class="q-alert row"
    :class="`bg-${color}`"
  >
    <div class="q-alert-icon flex items-center justify-center">
      <slot name="left">
        <q-icon :name="alertIcon"></q-icon>
      </slot>
    </div>
    <div class="q-alert-content auto self-center">
      <slot></slot>
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
    dismissible: Boolean
  },
  data () {
    return {
      active: true
    }
  },
  computed: {
    alertIcon () {
      return typeIcon[this.color] || typeIcon.info
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
