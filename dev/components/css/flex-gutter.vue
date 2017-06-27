<template>
  <div class="layout-padding gutter-demo">
    <h1>Default</h1>
    <div class="my-container" v-for="n in ['xs', 'sm', 'md', 'lg', 'xl']">
      <div class="row" :class="`${n}-gutter`">
        <div class="col-4" v-for="n in 5">
          <div class="my-content">&nbsp;</div>
        </div>
      </div>
    </div>

    <h1>No vertical gutter</h1>
    <div class="my-container" v-for="n in ['xs', 'sm', 'md', 'lg', 'xl']">
      <div class="row no-vert-gutter" :class="`${n}-gutter`">
        <div class="col-4" v-for="n in 5">
          <div class="my-content">&nbsp;</div>
        </div>
      </div>
    </div>

    <h1>No horizontal gutter</h1>
    <div class="my-container" v-for="n in ['xs', 'sm', 'md', 'lg', 'xl']">
      <div class="row no-horiz-gutter" :class="`${n}-gutter`">
        <div class="col-4" v-for="n in 5">
          <div class="my-content">&nbsp;</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      gigi: 'some text'
    }
  }
}
</script>

<style lang="stylus">
.gutter-demo
  .my-container + .my-container
    margin-top 25px
  .my-container
    border 1px solid rgba(0, 0, 0, .2)
  .my-content
    background rgba(0, 0, 0, .1)
    border 1px solid black
</style>
