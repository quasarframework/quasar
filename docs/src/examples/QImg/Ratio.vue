<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-center">
      <q-btn push color="teal" label="Refresh" @click="refresh" class="q-my-lg" />
    </div>
    <div class="row justify-center">
      Ratio = 16/9
    </div>
    <div class="row justify-center">
      <div class="q-gutter-md" style="width: 50%;">
        <q-img
          :src="url"
          :ratio="16/9"
        />
      </div>
    </div>
    <div class="row justify-center">
      Ratio = 4/3
    </div>
    <div class="row justify-center">
      <div class="q-gutter-md" style="width: 50%;">
        <q-img
          :src="url"
          :ratio="4/3"
        />
      </div>
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
