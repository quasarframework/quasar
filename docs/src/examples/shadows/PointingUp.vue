<template>
  <div class="q-pa-md">
    <div
      class="flex inline shadow-box flex-center"
      v-for="n in 24" :key="n"
      :class="`shadow-up-${n}`"
    >
      .shadow-up-{{ n }}
    </div>
  </div>
</template>

<style lang="sass" scoped>
.shadow-box
  width: 90px
  height: 90px
  margin: 25px
  border-radius: 50%
  font-size: 12px
</style>
