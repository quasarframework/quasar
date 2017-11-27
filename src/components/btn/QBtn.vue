<template>
  <button
    v-ripple.mat="hasRipple"
    @click="click"
    class="q-btn row inline flex-center q-focusable q-hoverable relative-position"
    :class="classes"
  >
    <div class="desktop-only q-focus-helper"></div>
    <div
      v-if="loading && hasPercentage"
      class="q-btn-progress absolute-full"
      :class="{'q-btn-dark-progress': darkPercentage}"
      :style="{width: width}"
    ></div>

    <span
      class="q-btn-inner row col flex-center"
      :class="{'no-wrap': noWrap, 'text-no-wrap': noWrap}"
    >
      <slot v-if="loading" name="loading">
        <q-spinner></q-spinner>
      </slot>

      <template v-else>
        <q-icon v-if="icon" :name="icon" :class="{'on-left': label && !round}"></q-icon>
        <span v-if="label && !round">{{ label }}</span>
        <slot></slot>
        <q-icon v-if="!round && iconRight" :name="iconRight" class="on-right"></q-icon>
      </template>
    </span>
  </button>
</template>

<script>
import BtnMixin from './btn-mixin'
import { QSpinner } from '../spinner'
import { between } from '../../utils/format'

export default {
  name: 'q-btn',
  mixins: [BtnMixin],
  components: {
    QSpinner
  },
  props: {
    value: Boolean,
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
    hasPercentage () {
      return this.percentage !== void 0
    },
    width () {
      return `${between(this.percentage, 0, 100)}%`
    },
    hasRipple () {
      return !this.noRipple && !this.isDisabled
    }
  },
  methods: {
    click (e) {
      this.$el.blur()

      if (this.isDisabled) {
        return
      }

      const trigger = () => {
        if (this.loader !== false || this.$slots.loading) {
          this.loading = true
          this.$emit('input', true)
        }
        this.$emit('click', e, () => {
          this.loading = false
          this.$emit('input', false)
        })
      }

      if (__THEME__ !== 'ios' && this.noRipple) {
        trigger()
      }
      else {
        this.timer = setTimeout(trigger, 350)
      }
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>
