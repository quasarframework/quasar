<template>
  <div class="q-pa-md">
    <q-badge color="grey-3" text-color="black" class="q-mb-sm">
      {{ hex }}
    </q-badge>

    <q-color
      v-model="hex"
      default-view="palette"
      :palette="[
        '#019A9D', '#D9B801', '#E8045A', '#B2028A',
        '#2A0449', '#019A9D'
      ]"
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
