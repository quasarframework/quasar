<template>
  <div class="layout-padding">
    <div style="margin: 10px; text-align: center">
      <h1 class="text-left">Standard shadows</h1>
      <div class="flex inline shadow-box items-center justify-center" v-for="n in 24" :class="['shadow-' + n]">.shadow-{{n}}</div>
      <h1 class="text-left">Shadows pointing up</h1>
      <div class="flex inline shadow-box items-center justify-center" v-for="n in 24" :class="['shadow-up-' + n]">.shadow-up-{{n}}</div>
      <h1 class="text-left">Inset Shadow</h1>
      <div class="flex inline shadow-box items-center justify-center inset-shadow doc-inset-shadow" border="1px solid grey">.inset-shadow</div>
    </div>
  </div>
</template>

<style lang="styl">
.shadow-box
  width 100px
  height 100px
  margin 15px
  border-radius 5px
</style>
