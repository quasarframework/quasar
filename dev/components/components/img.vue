<template>
  <div class="q-layout-padding">
    <div class="q-gutter-lg row items-start">
      <q-img
        src="statics/image-src.png"
        srcset="statics/image-1x.png 300w, statics/image-2x.png 2x,
          statics/image-3x.png 3x, statics/image-4x.png 4x"
        style="height: 280px; max-width: 300px"
      >
        <div class="absolute-bottom text-body1 text-center">
          With srcset
        </div>
      </q-img>

      <q-img
        src="statics/image-src.png"
        srcset="statics/image-1x.png 400w, statics/image-2x.png 800w,
          statics/image-3x.png 1200w, statics/image-4x.png 1600w"
        sizes="(max-width: 400px) 400w,
          (min-width: 400px) and (max-width: 800px) 800w,
          (min-width: 800px) and (max-width: 1200px) 1200w,
          (min-width: 1200px) 1600w"
        style="height: 280px; max-width: 300px"
      >
        <div class="absolute-bottom text-body1 text-center">
          With srcset & sizes
        </div>
      </q-img>
    </div>

    <q-btn push color="teal" label="Refresh" @click="refresh" class="q-my-lg" />

    <div class="q-gutter-lg row items-start">

      <q-img
        :src="url"
        alt="Image"
        height="100px"
        style="max-width: 400px"
      >
        <div slot="loading" class="text-h2 text-white">
          Loading...
        </div>
      </q-img>

      <q-img
        :src="url"
        placeholder-src="https://picsum.photos/500/300/?blur"
        :ratio="16/9"
        spinner-color="white"
        style="max-width: 400px"
      >
        <div class="absolute-bottom text-subtitle1 text-center q-pa-xs">
          Caption
        </div>
      </q-img>

      <q-img
        :src="url"
        placeholder-src="https://picsum.photos/500/300/?blur"
        :ratio="16/9"
        spinner-color="white"
        style="max-width: 400px"
        transition="q-transition--slide-x"
      />

      <q-img
        :src="url"
        basic
        placeholder-src="https://picsum.photos/500/300/?blur"
        ratio="1"
        class="generic-border-radius"
        style="max-width: 225px"
      />

      <q-img
        :src="url"
        placeholder-src="https://picsum.photos/500/300/?blur"
        ratio="1"
        spinner-color="white"
        style="max-width: 225px"
      >
        <q-spinner-facebook slot="loading" color="white" />
      </q-img>

      <q-img
        src="https://picsum.photos/300/300/"
        basic
        placeholder-src="https://picsum.photos/500/300/?blur"
        contain
        style="max-width: 400px; height: 200px"
      >
        <div class="absolute-bottom text-body1 text-center">
          Contain
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
