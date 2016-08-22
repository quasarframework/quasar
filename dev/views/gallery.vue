<template>
  <div>
    <div class="layout-padding">
      <h5>Gallery</h5>
      <quasar-gallery :src="gallery"></quasar-gallery>

      <h5>Gallery Slider</h5>
      <quasar-gallery-slider :src="slider"></quasar-gallery>
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
