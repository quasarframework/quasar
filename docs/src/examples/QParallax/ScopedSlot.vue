<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-center">

      <p v-for="n in 3" :key="n" class="par-text">{{ n }} {{ lorem }}</p>

    <q-parallax class="q-mt-xl">
      <img slot="media" src="https://cdn.quasar-framework.org/img/parallax2.jpg">

      <div
        slot="content"
        slot-scope="scope"
        class="absolute column items-center"
        :style="{
          opacity: 0.45 + (1 - scope.percentScrolled) * 0.55,
          top: (scope.percentScrolled * 60) + '%',
          left: 0,
          right: 0
        }"
      >
        <img src="https://cdn.quasar-framework.org/img/quasar-logo.png" style="width: 150px; height: 150px">
        <div class="text-h3 text-white text-center">Quasar Framework</div>
        <div class="text-h6 text-grey-3 text-center">Scoped slot</div>
      </div>
    </q-parallax>

      <p v-for="n in 3" :key="'height-1-' + n" class="par-text">{{ n }} {{ lorem }}</p>

      <q-parallax
      >
        <video slot="media" poster="https://cdn.quasar-framework.org/img/polina.jpg" autoplay loop muted>
          <source type="video/webm" src="https://cdn.quasar-framework.org/img/polina.webm">
          <source type="video/mp4" src="https://cdn.quasar-framework.org/img/polina.mp4">
        </video>

        <div
          slot="content"
          slot-scope="scope"
          class="absolute column items-center"
          :style="{
            opacity: 0.45 + (1 - scope.percentScrolled) * 0.55,
            top: (scope.percentScrolled * 60) + '%',
            left: 0,
            right: 0
          }"
        >
          <img src="https://cdn.quasar-framework.org/img/quasar-logo.png" style="width: 150px; height: 150px">
          <div class="text-h3 text-white text-center">Quasar Framework</div>
          <div class="text-h6 text-grey-3 text-center">Scoped slot on Video</div>
        </div>
      </q-parallax>

      <p v-for="n in 3" :key="'height-2-' + n" class="par-text">{{ n }} {{ lorem }}</p>

    </div>
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
