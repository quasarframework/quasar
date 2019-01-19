<template>
  <div class="q-pa-md">
    <p>Standard shadows</p>
    <div class="flex inline shadow-box flex-center" v-for="n in 24" :key="`a-${n}`" :class="['shadow-' + n]">.shadow-{{ n }}</div>
    <p>Shadows pointing up</p>
    <div class="flex inline shadow-box flex-center" v-for="n in 24" :key="`b-${n}`" :class="['shadow-up-' + n]">.shadow-up-{{ n }}</div>
    <p>Inset Shadow</p>
    <div class="flex inline shadow-box flex-center inset-shadow doc-inset-shadow">.inset-shadow</div>
  </div>
</template>

<style lang="stylus">
@import '~quasar-variables'

.shadow-box
  width 90px
  height 90px
  margin 25px
  border-radius 50%
  font-size 12px
.doc-inset-shadow
  border 1px solid $grey-3
</style>
