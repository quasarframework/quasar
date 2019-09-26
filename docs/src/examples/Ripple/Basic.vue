<template>
  <div class="q-pa-md row justify-center">
    <div
      v-ripple
      class="relative-position container flex flex-center text-white"
      :class="classes"
    >
      Click/tap me
    </div>
  </div>
</template>

<script>
const colors = [
  'primary', 'amber', 'secondary', 'orange', 'accent',
  'lime', 'cyan', 'purple', 'brown', 'blue'
]

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

<style lang="sass" scoped>
.container
  border-radius: 3px
  cursor: pointer
  transition: background 1.5s
  height: 150px
  width: 80%
  max-width: 500px
</style>
