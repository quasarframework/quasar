<template>
  <div>
    <div class="q-pa-sm">
      <q-radio v-model="color" val="teal" label="Teal" color="teal" />
      <q-radio v-model="color" val="orange" label="Orange" color="orange" />
      <q-radio v-model="color" val="blue-grey" label="Blue Grey" color="blue-grey" />
      <q-radio v-model="color" val="cyan" label="Cyan" color="cyan" />
    </div>
    <div class="q-px-sm">
      Your selection is: <strong>{{ color }}</strong>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QRadioColoring',

  data () {
    return {
      color: 'cyan'
    }
  }
}
</script>

<style lang="stylus" scoped>
.q-radio
  margin 5px
</style>
