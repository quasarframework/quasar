<template>
  <button
    v-ripple.mat
    @click="click"
    class="q-btn row inline items-center justify-center q-focusable q-hoverable"
    :class="{
      disabled: disable || loading,
      'q-btn-outline': outline,
      'q-btn-flat': flat,
      'q-btn-rounded': rounded,
      'q-btn-push': push,
      'q-btn-no-uppercase': noUppercase,
      [shape]: true,
      [size]: true,
      [`bg-${color}`]: color && !flat && !outline,
      [`text-${flat || outline ? color : 'white'}`]: color
    }"
  >
    <div class="q-focus-helper"></div>

    <span class="q-btn-inner row col items-center justify-center">
      <slot v-if="loading" name="loading">
        <q-spinner color="currentColor"></q-spinner>
      </slot>

      <template v-else>
        <q-icon v-if="icon" :name="icon" :class="{'on-left': !round}"></q-icon>
        <slot></slot>
        <q-icon v-if="!round && iconRight" :name="iconRight" class="on-right"></q-icon>
      </template>
    </span>
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
    loader: Boolean,
    noUppercase: {
      type: Boolean,
      default: false
    },
    icon: String,
    iconRight: String,
    round: Boolean,
    outline: Boolean,
    flat: Boolean,
    rounded: Boolean,
    push: Boolean,
    small: Boolean,
    big: Boolean,
    color: String
  },
  data () {
    return {
      loading: this.value || false
    }
  },
  watch: {
    value (val) {
      if (this.loading !== val) {
        this.loading = val
      }
    }
  },
  computed: {
    size () {
      return `q-btn-${this.small ? 'small' : (this.big ? 'big' : 'standard')}`
    },
    shape () {
      return `q-btn-${this.round ? 'round' : 'rectangle'}`
    }
  },
  methods: {
    click (e) {
      this.$el.blur()

      if (this.disable || this.loading) {
        return
      }
      if (this.loader !== false || this.$slots.loading) {
        this.loading = true
        this.$emit('input', true)
      }
      this.$emit('click', e, () => {
        this.loading = false
        this.$emit('input', false)
      })
    }
  }
}
</script>
