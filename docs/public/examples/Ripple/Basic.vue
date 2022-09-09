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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const colors = [
  'primary', 'amber', 'secondary', 'orange', 'accent',
  'lime', 'cyan', 'purple', 'brown', 'blue'
]

export default {
  setup () {
    const color = ref(colors[ 0 ])
    const index = ref(0)

    let timer

    onMounted(() => {
      timer = setInterval(() => {
        index.value = (index.value + 1) % colors.length
        color.value = colors[ index.value ]
      }, 3000)
    })

    onBeforeUnmount(() => {
      clearTimeout(timer)
    })

    return {
      color,
      index,
      classes: computed(() => `bg-${color.value}`)
    }
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
