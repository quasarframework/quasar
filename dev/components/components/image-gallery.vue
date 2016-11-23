<template>
  <div>
    <div class="layout-padding">
      <h5>Gallery</h5>
      <q-gallery :src="gallery"></q-gallery>

      <h5>Gallery Slider</h5>
      <q-gallery-slider :src="slider"></q-gallery>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      gallery: [
        'statics/mountains.jpg',
        'statics/parallax1.jpg',
        'statics/parallax2.jpg',
        'statics/parallax1.jpg',
        'statics/parallax2.jpg',
        'statics/mountains.jpg'
      ],
      slider: [
        'statics/mountains.jpg',
        'statics/parallax1.jpg',
        'statics/parallax2.jpg',
        'statics/parallax1.jpg',
        'statics/parallax2.jpg',
        'statics/mountains.jpg',
        'statics/mountains.jpg',
        'statics/parallax1.jpg',
        'statics/parallax2.jpg',
        'statics/parallax1.jpg',
        'statics/parallax2.jpg',
        'statics/mountains.jpg',
        'statics/parallax1.jpg',
        'statics/parallax2.jpg',
        'statics/parallax1.jpg',
        'statics/parallax2.jpg',
        'statics/mountains.jpg',
        'statics/parallax1.jpg',
        'statics/parallax2.jpg',
        'statics/parallax1.jpg',
        'statics/parallax2.jpg'
      ]
    }
  }
}
</script>
