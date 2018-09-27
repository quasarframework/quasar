<template>
  <div class="docs-ripple row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <p class="caption">
        <span class="desktop-only">Click</span>
        <span class="mobile-only">Tap</span>
        on the area below to see it in action.
      </p>

      <div
        tabindex="0"
        v-ripple
        class="relative-position ripple-example shadow-2"
        :class="classes"
      />

      <br><br>

      <div
        tabindex="0"
        v-ripple.center
        class="relative-position ripple-example ripple-round shadow-2"
        :class="classes"
      />
    </div>
  </div>
</template>

<script>
const colors = ['primary', 'amber', 'secondary', 'orange', 'tertiary', 'lime', 'cyan', 'purple', 'brown', 'blue']

export default {
  data () {
    return {
      color: colors[0],
      index: 0
    }
  },
  computed: {
    classes () {
      return `bg-${this.color}`
    }
  },
  mounted () {
    this.timer = setInterval(() => {
      this.index = (this.index + 1) % colors.length
      this.color = colors[this.index]
    }, 3000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="stylus">
.ripple-example
  height 150px
  border-radius 3px
  cursor pointer
  color white
  transition background 1.5s

.ripple-round
  width 150px
  border-radius 50%
</style>
