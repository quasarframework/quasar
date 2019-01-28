<template>
  <div class="q-pa-md">
    <q-btn push color="teal" label="Change image" @click="refresh" class="q-mb-md" />

    <div class="q-gutter-sm row items-start">
      <q-img
        :src="url"
        spinner-color="red"
        style="height: 140px; max-width: 150px"
      />

      <q-img
        :src="url"
        spinner-color="primary"
        spinner-size="82px"
        style="height: 140px; max-width: 150px"
      />

      <q-img
        :src="url"
        style="height: 140px; max-width: 150px"
      >
        <div slot="loading" class="text-subtitle1 text-white">
          Loading...
        </div>
      </q-img>

      <q-img
        :src="url"
        style="height: 140px; max-width: 150px"
      >
        <q-spinner-gears slot="loading" color="white" />
      </q-img>

      <q-img
        :src="url"
        style="height: 140px; max-width: 150px"
      >
        <div slot="loading" class="text-yellow">
          <q-spinner-ios slot="loading" />
          <div class="q-mt-md">Loading...</div>
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
