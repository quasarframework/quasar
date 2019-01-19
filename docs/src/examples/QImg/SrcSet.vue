<template>
  <div class="q-pa-md q-gutter-sm">
    <div class="row justify-center">
      <q-btn push color="teal" label="Refresh" @click="refresh" class="q-my-lg" />
    </div>
    <div class="row justify-center">
      <q-img
        :src="url"
        srcset="https://cdn.quasar-framework.org/img/image-1x.png 1x, https://cdn.quasar-framework.org/img/image-2x.png 2x,
          https://cdn.quasar-framework.org/img/image-3x.png 3x, https://cdn.quasar-framework.org/img/image-4x.png 4x"
        style="height: 280px; max-width: 300px"
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
