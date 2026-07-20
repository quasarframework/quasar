<template>
  <div class="q-pa-md column items-center">
    <div
      v-ripple:purple
      class="relative-position container bg-grey-3 text-black flex flex-center"
    >
      Purple colored ripple
    </div>

    <div
      v-ripple="{ color: 'yellow' }"
      class="relative-position container bg-cyan text-white flex flex-center q-mt-sm"
      style="height: 50px"
    >
      Yellow colored ripple
    </div>

    <div
      v-ripple
      class="relative-position container bg-purple text-yellow flex flex-center q-mt-sm"
      style="height: 50px"
    >
      Inheriting text color
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
