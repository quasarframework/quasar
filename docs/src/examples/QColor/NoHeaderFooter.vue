<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-color v-model="hex" no-header class="my-picker" />
    <q-color v-model="hex" no-footer class="my-picker" />
    <q-color v-model="hex" no-header no-footer class="my-picker" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      hex: '#FF00FF'
    }
  }
}
</script>

<style lang="sass" scoped>
.my-picker
  width: 250px
</style>
