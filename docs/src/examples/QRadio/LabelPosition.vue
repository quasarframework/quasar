<template>
  <div>
    <div class="q-pa-sm">
      <q-radio left-label v-model="shape" val="line" label="Line" />
      <q-radio left-label v-model="shape" val="rectangle" label="Rectangle" />
      <q-radio left-label v-model="shape" val="ellipse" label="Ellipse" />
      <q-radio left-label v-model="shape" val="polygon" label="Polygon" />
    </div>
    <div class="q-px-sm">
      Your selection is: <strong>{{ shape }}</strong>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QRadioLabelPosition',

  data () {
    return {
      shape: 'line'
    }
  }
}
</script>

<style lang="stylus" scoped>
.q-radio
  margin 5px
</style>
