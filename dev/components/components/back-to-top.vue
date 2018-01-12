<template>
  <div class="layout-padding">
    <p class="caption">
      Scroll down <q-icon style="font-size: 3rem" class="animate-bounce" name="keyboard_arrow_down" />
    </p>
    <p class="caption">
      A circular button is set to appear after scrolling 500px.
      <br>
      After another 500px another element will appear on the left.
    </p>

    <q-btn
      color="primary"
      fab
      icon="keyboard_arrow_up"
      v-back-to-top.animate="{offset: 500, duration: 200}"
      class="fixed-bottom-right animate-pop"
      style="margin: 0 15px 15px 0"
    />

    <a
      v-back-to-top.animate="1000"
      class="animate-pop play-backtotop non-selectable"
    >
      Back to top
    </a>

    <p class="caption" v-for="n in 50">Keep scrolling...</p>
  </div>
</template>

<style lang="styl">
.play-backtotop
  color white
  position fixed
  left 0
  top 30%
  padding 15px
  background-color rgba(0, 0, 0, .8)
  border-radius 0 15px 15px 0
</style>
