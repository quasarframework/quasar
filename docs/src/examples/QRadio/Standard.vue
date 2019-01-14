<template>
  <div>
    <div class="q-pa-sm">
      <q-radio v-model="shape" val="line" label="Line" />
      <q-radio v-model="shape" val="rectangle" label="Rectangle" />
      <q-radio v-model="shape" val="ellipse" label="Ellipse" />
      <q-radio v-model="shape" val="polygon" label="Polygon" />
    </div>
    <div class="q-px-sm">
      Your selection is: <strong>{{ shape }}</strong>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QRadioStandard',

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
