<template>
  <div class="layout-padding gutter-demo">
    <h1>Default</h1>
    <div class="my-container" v-for="n in ['none', 'xs', 'sm', 'md', 'lg', 'xl']" :key="`gutter_xy_${n}`">
      <div class="row" :class="`gutter-${n}`">
        <div class="col-4" v-for="n in 5" :key="n">
          <div class="my-content">&nbsp;</div>
        </div>
      </div>
    </div>

    <h1>Horizontal</h1>
    <div class="my-container" v-for="n in ['none', 'xs', 'sm', 'md', 'lg', 'xl']" :key="`gutter_x_${n}`">
      <div class="row" :class="`gutter-x-${n} gutter-y-sm`">
        <div class="col-4" v-for="n in 5" :key="n">
          <div class="my-content">&nbsp;</div>
        </div>
      </div>
    </div>

    <h1>Vertical</h1>
    <div class="my-container" v-for="n in ['none', 'xs', 'sm', 'md', 'lg', 'xl']" :key="`gutter_y_${n}`">
      <div class="row" :class="`gutter-x-sm gutter-y-${n}`">
        <div class="col-4" v-for="n in 5" :key="n">
          <div class="my-content">&nbsp;</div>
        </div>
      </div>
    </div>

    <h1>QInput example</h1>
    <div>
      <div class="row gutter-sm">
        <div class="col-12">
          <q-input inverted v-model="model" float-label="col-12" />
        </div>
        <div class="col-xs-12 col-sm-6">
          <q-input inverted v-model="model" float-label="col-xs-12 col-sm-6 TOP LEFT" />
        </div>
        <div class="col-xs-12 col-sm-6">
          <q-input inverted v-model="model" float-label="col-xs-12 col-sm-6 TOP RIGHT" />
        </div>
        <div class="col-xs-12 col-sm-6">
          <q-input inverted v-model="model" float-label="col-xs-12 col-sm-6 BOTTOM LEFT" />
        </div>
        <div class="col-xs-12 col-sm-6">
          <q-input inverted v-model="model" float-label="col-xs-12 col-sm-6 BOTTOM RIGHT" />
        </div>
        <div class="col-12">
          <q-input inverted v-model="model" float-label="col-12" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: 'some text'
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
