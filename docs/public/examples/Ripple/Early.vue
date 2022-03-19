<template>
  <div class="q-pa-md column items-center">
    <div
      v-ripple.early
      class="relative-position container bg-grey-3 text-black flex flex-center"
    >
      I have ripple triggering early
    </div>

    <div
      v-ripple="{ early: true }"
      class="relative-position container bg-cyan text-white flex flex-center q-mt-sm"
      style="height: 50px"
    >
      I too have ripple triggering early
    </div>
  </div>
</template>

<style lang="sass" scoped>
.container
  border-radius: 3px
  cursor: pointer
  height: 50px
  width: 80%
  max-width: 500px
</style>
