<template>
  <div class="q-pa-md">
    <div class="row items-start q-gutter-md">
      <q-color
        v-model="color"
        disable
        class="my-picker"
      />

      <q-color
        v-model="color"
        readonly
        class="my-picker"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      color: '#ff00ff'
    }
  }
}
</script>

<style lang="sass" scoped>
.my-picker
  max-width: 250px
</style>
