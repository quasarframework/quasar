<template>
  <div class="q-layout-padding">
    <p class="caption text-left">
      Standard shadows
    </p>
    <div class="flex inline shadow-box flex-center" v-for="n in 24" :class="['shadow-' + n]" :key="`a-${n}`">
      .shadow-{{ n }}
    </div>
    <p class="caption text-left">
      Shadows pointing up
    </p>
    <div class="flex inline shadow-box flex-center" v-for="n in 24" :class="['shadow-up-' + n]" :key="`b-${n}`">
      .shadow-up-{{ n }}
    </div>
    <p class="caption text-left">
      Inset Shadow on top
    </p>
    <div class="flex inline shadow-box flex-center inset-shadow">
      .inset-shadow
    </div>
    <p class="caption text-left">
      Inset Shadow on bottom
    </p>
    <div class="flex inline shadow-box flex-center inset-shadow-down">
      .inset-shadow-down
    </div>
  </div>
</template>

<style lang="sass">
.shadow-box
  width: 110px
  height: 110px
  margin: 25px
  border-radius: 5px
</style>
