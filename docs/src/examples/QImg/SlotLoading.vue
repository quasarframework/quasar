<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-center">
      <q-btn push color="teal" label="Refresh" @click="refresh" class="q-my-lg" />
    </div>
    <div class="row justify-center">
      <q-img
        :src="url"
        style="height: 140px; max-width: 150px"
        spinner-color="white"
      >
        <div slot="loading" class="text-h2 text-white" style="font-size: 2em; font-variant: small-caps; font-weight: bold;">
          Loading...
        </div>
      </q-img>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      url: 'https://placeimg.com/500/300/nature'
    }
  },

  methods: {
    refresh () {
      this.url = 'https://placeimg.com/500/300/nature?t=' + Math.random()
    }
  }
}
</script>
