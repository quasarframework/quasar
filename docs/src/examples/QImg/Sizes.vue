<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-center">
      <q-btn push color="teal" label="Refresh" @click="refresh" class="q-my-lg" />
    </div>
    <div class="row justify-center">
      <q-img
        :src="url"
        style="height: 140px; max-width: 150px"
        sizes="(max-width: 320px) 280px, (max-width: 480px) 440px, 800px"
      />
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
