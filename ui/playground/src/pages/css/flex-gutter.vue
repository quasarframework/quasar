<template>
  <div class="q-layout-padding q-col-gutter-demo">
    <h1>Default</h1>
    <div class="my-container" v-for="n in ['none', 'xs', 'sm', 'md', 'lg', 'xl']" :key="`q-col-gutter_xy_${n}`">
      <div class="row" :class="`q-col-gutter-${n}`">
        <div class="col-4" v-for="x in 5" :key="x">
          <div class="my-content">
&nbsp;
          </div>
        </div>
      </div>
    </div>

    <h1>Horizontal</h1>
    <div class="my-container" v-for="n in ['none', 'xs', 'sm', 'md', 'lg', 'xl']" :key="`q-col-gutter_x_${n}`">
      <div class="row" :class="`q-col-gutter-x-${n} q-col-gutter-y-sm`">
        <div class="col-4" v-for="x in 5" :key="x">
          <div class="my-content">
&nbsp;
          </div>
        </div>
      </div>
    </div>

    <h1>Vertical</h1>
    <div class="my-container" v-for="n in ['none', 'xs', 'sm', 'md', 'lg', 'xl']" :key="`q-col-gutter_y_${n}`">
      <div class="row" :class="`q-col-gutter-x-sm q-col-gutter-y-${n}`">
        <div class="col-4" v-for="x in 5" :key="x">
          <div class="my-content">
&nbsp;
          </div>
        </div>
      </div>
    </div>

    <h1>Backgrounds test</h1>
    <div class="bg-yellow" style="border: 1px solid transparent;">
      <div class="row q-col-gutter-lg" style="border: 1px solid red;">
        <div class="col-4" v-for="x in 12" :key="x">
          <div class="bg-grey-4">
            Col 4
          </div>
        </div>
      </div>
    </div>

    <h1>QInput example</h1>
    <div>
      <div class="row q-col-gutter-sm">
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

<style lang="sass">
.q-col-gutter-demo
  .my-container + .my-container
    margin-top: 25px
  .my-container
    border: 1px solid rgba(0, 0, 0, .2)
  .my-content
    background: rgba(0, 0, 0, .1)
    border: 1px solid black
</style>
