<template>
  <div>
    <div class="layout-padding">
      <div style="margin: 10px; text-align: center">
        <div class="flex inline shadow-box items-center justify-center inset-shadow">.inset-shadow</div>
        <div class="flex inline shadow-box items-center justify-center" v-for="n in 5" :class="['shadow-' + n]">.shadow-{{n}}</div>
        <div class="flex inline shadow-box items-center justify-center" v-for="n in 5" :class="['shadow-up-' + n]">.shadow-up-{{n}}</div>
      </div>
    </div>
  </div>
</template>

<style lang="styl" scoped>
.shadow-box
  width 100px
  height 100px
  margin 15px
  border-radius 50%
</style>
