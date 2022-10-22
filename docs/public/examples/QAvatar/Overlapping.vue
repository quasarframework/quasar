<template>
  <div class="q-pa-md q-gutter-sm" style="height: 80px">
    <q-avatar
      v-for="n in 5"
      :key="n"
      size="40px"
      class="overlapping"
      :style="`left: ${n * 25}px`"
    >
      <img :src="`https://cdn.quasar.dev/img/avatar${n + 1}.jpg`">
    </q-avatar>
  </div>
</template>

<style lang="sass" scoped>
.overlapping
  border: 2px solid white
  position: absolute
</style>
