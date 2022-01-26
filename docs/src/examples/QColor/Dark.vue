<template>
  <div class="q-pa-md">
    <div class=" row items-start q-gutter-md">
      <q-color v-model="hex" dark class="my-picker" />
      <q-color v-model="hexa" dark class="my-picker" />
      <q-color v-model="rgb" dark class="my-picker" />
      <q-color v-model="rgba" dark class="my-picker" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      hex: ref('#FF00FF'),
      hexa: ref('#FF00FFCC'),
      rgb: ref('rgb(0,0,0)'),
      rgba: ref('rgba(255,0,255,0.8)')
    }
  }
}
</script>

<style lang="sass" scoped>
.my-picker
  max-width: 250px
</style>
