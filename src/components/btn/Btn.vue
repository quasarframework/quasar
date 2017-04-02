<template>
  <button
    class="q-btn"
    v-ripple.mat
    @click="__click"
    :class="{circular: circular}"
  >
    <spinner
      v-if="spinning"
      :name="spinnerName"
      :size="16"
    ></spinner>

    <q-icon v-if="icon && !spinning" :name="icon" :class="{'on-left': !circular}"></q-icon>
    <slot v-if="(circular && !spinning) || !circular"></slot>
    <q-icon v-if="iconRight && !circular && !spinning" :name="iconRight" class="on-right"></q-icon>
  </button>
</template>

<script>
import Ripple from '../../directives/ripple'
import { QSpinner } from '../spinner'
import { QIcon } from '../icon'

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
    disable: Boolean,
    spinner: [Boolean, String],
    circular: Boolean,
    icon: String,
    iconRight: String
  },
  data () {
    return {
      spinning: false
    }
  },
  computed: {
    spinnerName () {
      if (this.spinner === '') {
        return 'oval'
      }
      if (this.spinner.length) {
        return this.spinner
      }
    }
  },
  methods: {
    __click (e) {
      if (this.$q.platform.is.desktop) {
        this.$el.blur()
      }
      if (this.disable || this.spinning) {
        return
      }
      if (this.spinner !== false) {
        this.spinning = true
      }
      this.$emit('click', e, () => {
        this.spinning = false
      })
    }
  }
}
</script>
