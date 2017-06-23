<template>
  <button
    v-ripple.mat="!isDisabled"
    @click="click"
    class="q-btn row inline items-center justify-center q-focusable q-hoverable relative-position"
    :class="classes"
  >
    <div class="q-focus-helper"></div>
    <div
      v-if="loading && hasPercentage"
      class="q-btn-progress absolute-full"
      :class="{'q-btn-dark-progress': darkPercentage}"
      :style="{width: width}"
    ></div>

    <span class="q-btn-inner row col items-center justify-center">
      <slot v-if="loading" name="loading">
        <q-spinner></q-spinner>
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
import { between } from '../../utils/format'

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
    noCaps: {
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
    color: String,
    glossy: Boolean,

    loader: Boolean,
    percentage: Number,
    darkPercentage: Boolean
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
    },
    hasPercentage () {
      return this.percentage !== void 0
    },
    width () {
      return `${between(this.percentage, 0, 100)}%`
    },
    isDisabled () {
      return this.disable || this.loading
    },
    classes () {
      const cls = [this.shape, this.size]

      if (this.flat) {
        cls.push('q-btn-flat')
      }
      else if (this.outline) {
        cls.push('q-btn-outline')
      }
      else if (this.push) {
        cls.push('q-btn-push')
      }

      this.isDisabled && cls.push('disabled')
      this.noCaps && cls.push('q-btn-no-uppercase')
      this.rounded && cls.push('q-btn-rounded')
      this.glossy && cls.push('glossy')

      if (this.color) {
        if (this.flat || this.outline) {
          cls.push(`text-${this.color}`)
        }
        else {
          cls.push(`bg-${this.color}`)
          cls.push(`text-white`)
        }
      }

      return cls
    }
  },
  methods: {
    click (e) {
      this.$el.blur()

      if (this.isDisabled) {
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
