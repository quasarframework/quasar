<template>
  <div class="q-pa-md">
    <q-badge color="grey-3" text-color="black" class="q-mb-sm">
      {{ hex }}
    </q-badge>

    <q-color
      v-model="hex"
      no-header
      no-footer
      default-view="palette"
      class="my-picker"
    />
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
  max-width: 250px
</style>
