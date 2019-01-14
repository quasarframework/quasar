<template>
  <div>
    <div class="q-pa-sm dark-background">
      <q-radio dark v-model="shape" val="line" label="Line" />
      <q-radio dark v-model="shape" val="rectangle" label="Rectangle" />
      <q-radio dark v-model="shape" val="ellipse" label="Ellipse" />
      <q-radio dark v-model="shape" val="polygon" label="Polygon" />
    </div>
    <div class="q-px-sm" style="background-color: white">
      Your selection is: <strong>{{ shape }}</strong>
    </div>
  </div>

</template>

<script>
export default {
  name: 'QRadioDarkBackground',

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
.dark-background
  background-color black
  color white
</style>
