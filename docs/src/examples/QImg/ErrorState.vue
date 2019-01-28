<template>
  <div class="q-pa-md">
    <q-img
      src="https://cdn.quasar-framework.org/img/non-existent-image-src.png"
      style="height: 140px; max-width: 150px"
    >
      <div slot="error" class="absolute-full flex flex-center bg-negative text-white">
        Cannot load image
      </div>
    </q-img>
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
