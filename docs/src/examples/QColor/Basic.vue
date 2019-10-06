<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-color v-model="hex" inline class="my-picker" />
    <q-color v-model="hexa" inline class="my-picker" />
    <q-color v-model="rgb" inline class="my-picker" />
    <q-color v-model="rgba" inline class="my-picker" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      hex: '#FF00FF',
      hexa: '#FF00FFCC',
      rgb: 'rgb(0,0,0)',
      rgba: 'rgba(255,0,255,0.8)'
    }
  }
}
</script>

<style lang="sass" scoped>
.my-picker
  max-width: 250px
</style>
