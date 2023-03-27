<template>
  <div class="q-pa-md column items-center">
    <div
      v-ripple="state"
      class="relative-position container bg-cyan text-black flex flex-center"
    />

    <q-toggle v-model="state" label="Use ripple for container above" class="q-mt-md" />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      state: ref(true)
    }
  }
}
</script>

<style lang="sass" scoped>
.container
  border-radius: 3px
  cursor: pointer
  height: 50px
  width: 80%
  max-width: 500px
</style>
