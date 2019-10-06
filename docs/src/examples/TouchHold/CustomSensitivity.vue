<template>
  <div class="q-pa-md row justify-center">
    <q-card
      v-touch-hold:600:12:15.mouse="handleHold"
      class="custom-area cursor-pointer bg-purple text-white shadow-2 relative-position row flex-center"
    >
      <div v-if="info" class="custom-info">
        <pre>{{ info }}</pre>
      </div>
      <div v-else class="text-center">
        Sensitivity: 12px for touch events and 15px for mouse events.
      </div>
    </q-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      info: null
    }
  },

  methods: {
    handleHold ({ evt, ...info }) {
      this.info = info

      // native Javascript event
      // console.log(evt)
    }
  }
}
</script>

<style lang="sass" scoped>
.custom-area
  width: 90%
  height: 200px
  border-radius: 3px
  padding: 8px

.custom-info pre
  width: 190px
  font-size: 12px
</style>
