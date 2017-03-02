<template>
  <button
    v-ripple.mat
    @click="__click"
  >
    <spinner
      v-if="spinning"
      :name="spinnerName"
      :size="16"
      class="on-left"
    ></spinner>
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    disable: Boolean,
    spinner: [String, Boolean]
  },
  data () {
    return {
      spinning: false
    }
  },
  computed: {
    spinnerName () {
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
      this.$emit('click', e, done => {
        this.spinning = false
      })
    }
  }
}
</script>
