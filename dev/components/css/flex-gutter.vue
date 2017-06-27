<template>
  <div class="layout-padding gutter-demo">
    <div class="container" v-for="n in ['xs', 'sm', 'md', 'lg', 'xl']">
      {{n}}-gutter
      <div class="row" :class="`${n}-gutter`">
        <div class="col-4" v-for="n in 5">
          <div>&nbsp;</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="stylus">
.gutter-demo
  .container
    border 1px solid black
  .container + .container
    margin-top 64px
  .row
    // border 1px solid rgba(0, 0, 0, .3)
    > div > div
      background rgba(0, 0, 0, .3)
</style>
