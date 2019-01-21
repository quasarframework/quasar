<template>
  <div class="q-pa-md q-gutter-md">

    <p v-for="n in 3" :key="n" class="par-text">{{ n }} {{ lorem }}</p>

    <q-parallax
      :speed="0.75"
    >
      <img slot="media" src="https://cdn.quasar-framework.org/img/parallax1.jpg">
      <h1 class="text-white">Docks</h1>
    </q-parallax>

    <p v-for="n in 3" :key="'speed-1-' + n" class="par-text">{{ n }} {{ lorem }}</p>

    <q-parallax
      :speed="0.5"
    >
      <video slot="media" poster="https://cdn.quasar-framework.org/img/polina.jpg" autoplay loop muted>
        <source type="video/webm" src="https://cdn.quasar-framework.org/img/polina.webm">
        <source type="video/mp4" src="https://cdn.quasar-framework.org/img/polina.mp4">
      </video>

      <h1 class="text-white">Video</h1>
    </q-parallax>

    <p v-for="n in 3" :key="'speed-2-' + n" class="par-text">{{ n }} {{ lorem }}</p>

  </div>
</template>

<script>
export default {
  data () {
    return {
      imgSrc: 'https://cdn.quasar-framework.org/img/parallax1.jpg',
      lorem: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    }
  }
}
</script>
