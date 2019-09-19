<template>
  <div class="q-pa-md q-gutter-md row justify-center">
    <div
      v-ripple.center
      class="relative-position container bg-grey-3 text-black inline flex flex-center"
    >
      Center
    </div>

    <div
      v-ripple
      class="relative-position container bg-grey-3 text-black inline flex flex-center text-center"
    >
      Touch point<br>(default)
    </div>
  </div>
</template>

<style lang="sass" scoped>
.container
  border-radius: 50%
  cursor: pointer
  width: 150px
  height: 150px
</style>
