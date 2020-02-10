<template>
  <div class="q-ma-md">
    <q-scroll-area
      dark
      class="bg-dark text-white rounded-borders"
      style="height: 200px; max-width: 300px;"
    >
      <div v-for="n in 100" :key="n" class="q-py-sm q-px-md">
        Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.
      </div>
    </q-scroll-area>
  </div>
</template>

<script>
export default {
  computed: {
    thumbStyle () {
      return {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: 0.75
      }
    },

    barStyle () {
      return {
        right: '2px',
        borderRadius: '9px',
        backgroundColor: '#027be3',
        width: '9px',
        opacity: 0.2
      }
    }
  }
}
</script>
