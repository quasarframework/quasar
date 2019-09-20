<template>
  <div class="q-pa-md">
    <div class=" row items-start q-gutter-md">
      <q-color v-model="hex" dark inline class="my-picker" />
      <q-color v-model="hexa" dark inline class="my-picker" />
      <q-color v-model="rgb" dark inline class="my-picker" />
      <q-color v-model="rgba" dark inline class="my-picker" />
    </div>
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
