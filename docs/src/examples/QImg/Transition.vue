<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-center">
      <q-btn push color="teal" label="Refresh" @click="refresh" class="q-my-lg" />
    </div>
    <div class="row justify-center">
      <q-img
        :src="url"
        placeholder-src="https://picsum.photos/500/300/?blur"
        :ratio="16/9"
        spinner-color="white"
        style="max-width: 400px"
        transition="slide-left"
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
