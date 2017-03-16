<template>
  <button
    v-ripple.mat
    @click="__click"
    class="q-btn"
    :class="{circular: circular}"
  >
    <spinner
      v-if="spinning"
      :name="spinnerName"
      :size="16"
    ></spinner>

    <i v-if="icon && !spinning" class="on-left">{{ icon }}</i>
    <slot v-if="(circular && !spinning) || !circular"></slot>
    <i v-if="iconRight && !circular && !spinning" class="on-right">{{ iconRight }}</i>
  </button>
</template>

<script>
export default {
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
