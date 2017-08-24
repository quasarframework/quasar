<template>
  <div>
    <div class="layout-padding">
      <p class="caption">Gallery</p>
      <q-gallery :src="gallery"></q-gallery>

      <p class="caption">Gallery Carousel</p>
      <q-gallery-carousel handle-arrow-keys :src="slider"></q-gallery-carousel>

      <p class="caption">Gallery Carousel</p>
      <q-gallery-carousel :src="slider" horizontal-quick-view></q-gallery-carousel>

      <p class="caption">Gallery Carousel with Infinite Scroll & Autoplay</p>
      <q-gallery-carousel dots infinite autoplay :src="secondSlider"></q-gallery-carousel>
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
        'statics/mountains.jpg',
        'statics/parallax1.jpg',
        'statics/parallax2.jpg',
        'statics/mountains.jpg',
        'statics/parallax1.jpg',
        'statics/parallax2.jpg',
        'statics/mountains.jpg',
        'statics/parallax1.jpg',
        'statics/parallax2.jpg',
        'statics/mountains.jpg',
        'statics/parallax1.jpg',
        'statics/parallax2.jpg',
        'statics/mountains.jpg',
        'statics/parallax1.jpg',
        'statics/parallax2.jpg'
      ],
      secondSlider: [
        'statics/mountains.jpg',
        'statics/parallax1.jpg',
        'statics/parallax2.jpg'
      ]
    }
  }
}
</script>
