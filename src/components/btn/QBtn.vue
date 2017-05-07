<template>
  <button
    class="q-btn"
    v-ripple.mat
    @click="click"
    :class="{circular: circular}"
  >
    <slot name="spinner" v-if="spinning">
      <q-spinner color="currentColor" :size="18"></q-spinner>
    </slot>

    <q-icon v-if="icon && !spinning" :name="icon" :class="{'on-left': !circular}"></q-icon>
    <slot v-if="(circular && !spinning) || !circular"></slot>
    <q-icon v-if="iconRight && !circular" :name="iconRight" class="on-right"></q-icon>
  </button>
</template>

<script>
import Ripple from '../../directives/ripple'
import { QIcon } from '../icon'
import { QSpinner } from '../spinner'

export default {
  name: 'q-btn',
  components: {
    QSpinner,
    QIcon
  },
  directives: {
    Ripple
  },
  props: {
    value: Boolean,
    disable: Boolean,
    spinner: Boolean,
    circular: Boolean,
    icon: String,
    iconRight: String
  },
  data () {
    return {
      spinning: this.value || false
    }
  },
  watch: {
    value (val) {
      if (this.spinning !== val) {
        this.spinning = val
      }
    }
  },
  methods: {
    click (e) {
      if (this.$q.platform.is.desktop) {
        this.$el.blur()
      }
      if (this.disable || this.spinning) {
        return
      }
      if (this.spinner !== false || this.$slots.spinner) {
        this.spinning = true
        this.$emit('input', true)
      }
      this.$emit('click', e, () => {
        this.spinning = false
        this.$emit('input', false)
      })
    }
  }
}
</script>
