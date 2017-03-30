<template>
  <div>
    <div class="layout-padding">
      <p class="caption">Gallery</p>
      <q-gallery :src="gallery"></q-gallery>

      <p class="caption">Gallery Slider</p>
      <q-gallery-slider :src="slider"></q-gallery-slider>

      <p class="caption">Gallery Slider</p>
      <q-gallery-slider :src="slider" horizontal-quick-view></q-gallery-slider>

      <p class="caption">Gallery Slider with Infinite Scroll & Autoplay</p>
      <q-gallery-slider dots infinite autoplay :src="secondSlider"></q-gallery-slider>
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
