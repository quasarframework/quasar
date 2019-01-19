<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-center">
      <q-btn push color="teal" label="Refresh" @click="refresh" class="q-my-lg" />
    </div>
    <div class="row justify-center">
      <q-img
        :src="url"
        style="height: 140px; max-width: 150px"
      >
        <div slot="error" class="fit text-h2 bg-red-7 text-white" style="font-size: 1em;">
          Cannot load image
        </div>
      </q-img>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      url: 'https://cdn.quasar-framework.org/img/no-image-src.png'
    }
  },

  methods: {
    refresh () {
      this.url = 'https://cdn.quasar-framework.org/img/no-image-src.png?t=' + Math.random()
    }
  }
}
</script>
