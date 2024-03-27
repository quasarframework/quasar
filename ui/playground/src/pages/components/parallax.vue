<template>
  <div class="view-parallax">
    <div class="q-layout-padding">
      <p class="caption">
        Scroll down (best using scrollbar instead of mouse scroll
        if on desktop) to see Parallax in action.
      </p>

      <p v-for="n in 7" :key="n" class="par-text">
        {{ n }} {{ loremipsum }}
      </p>
    </div>

    <q-parallax>
      <template v-slot:media>
        <img src="https://cdn.quasar.dev/img/parallax2.jpg">
      </template>

      <h1 class="text-white">
        Basic
      </h1>
    </q-parallax>

    <div class="q-layout-padding">
      <p v-for="n in 7" :key="n" class="par-text">
        {{ n }} {{ loremipsum }}
      </p>
    </div>

    <q-parallax class="q-mt-xl">
      <template v-slot:media>
        <img src="https://cdn.quasar.dev/img/parallax2.jpg">
      </template>

      <template v-slot:content="scope">
        <div
          class="absolute column items-center"
          :style="{
            opacity: 0.45 + (1 - scope.percentScrolled) * 0.55,
            top: (scope.percentScrolled * 60) + '%',
            left: 0,
            right: 0
          }"
        >
          <img src="https://cdn.quasar.dev/logo-v2/128/logo-dark.png" style="width: 150px; height: 150px">
          <div class="text-h3 text-white text-center">
            Quasar Framework
          </div>
          <div class="text-h6 text-grey-3 text-center">
            Using content slot
          </div>
        </div>
      </template>
    </q-parallax>

    <div class="q-layout-padding">
      <p v-for="n in 7" :key="n" class="par-text">
        {{ n }} {{ loremipsum }}
      </p>
    </div>

    <q-parallax :height="200" class="q-mt-xl">
      <template v-slot:media>
        <video width="720" height="440" poster="http://www.markhillard.com/sandbox/media/polina.jpg" autoplay loop muted>
          <source type="video/webm" src="http://www.markhillard.com/sandbox/media/polina.webm">
          <source type="video/mp4" src="http://www.markhillard.com/sandbox/media/polina.mp4">
        </video>
      </template>

      <h1 class="text-white">
        Video
      </h1>
    </q-parallax>

    <div class="q-layout-padding">
      <p v-for="n in 7" :key="n" class="par-text">
        {{ n }} {{ loremipsum }}
      </p>
    </div>

    <q-toggle v-model="imgSrc" true-value="https://cdn.quasar.dev/img/parallax1.jpg" false-value="https://cdn.quasar.dev/img/mountains.jpg" label="Toggle Image" />
    <q-parallax :src="imgSrc" :height="200">
      <h1 class="text-white">
        Parallax Title
      </h1>
    </q-parallax>

    <div class="q-layout-padding">
      <p v-for="n in 7" :key="n" class="par-text">
        {{ n }} {{ loremipsum }}
      </p>
    </div>

    <q-parallax src="https://cdn.quasar.dev/img/parallax2.jpg">
      <h1 class="text-white">
        Bridge
      </h1>
    </q-parallax>

    <div class="q-layout-padding">
      <p v-for="n in 7" :key="n" class="par-text">
        {{ n }} {{ loremipsum }}
      </p>
    </div>

    <q-parallax src="https://cdn.quasar.dev/img/parallax1.jpg">
      <h1 class="text-white">
        Title
      </h1>
    </q-parallax>

    <div class="q-layout-padding">
      <p v-for="n in 7" :key="n" class="par-text">
        {{ n }} {{ loremipsum }}
      </p>
    </div>

    <q-parallax src="https://cdn.quasar.dev/img/mountains.jpg" :height="200">
      <h1 class="text-white">
        Mountains
      </h1>
    </q-parallax>

    <div class="q-layout-padding">
      <p v-for="n in 7" :key="n" class="par-text">
        {{ n }} {{ loremipsum }}
      </p>
    </div>

    <h3>Parallax (not full width)</h3>
    <div class="row justify-around">
      <div class="col-6">
        <div class="q-layout-padding">
          <p v-for="n in 7" :key="n" class="par-text">
            {{ n }} {{ loremipsum }}
          </p>
        </div>

        <q-parallax :height="200" class="q-mt-xl">
          <template v-slot:media>
            <video width="720" height="440" poster="http://www.markhillard.com/sandbox/media/polina.jpg" autoplay loop muted>
              <source type="video/webm" src="http://www.markhillard.com/sandbox/media/polina.webm">
              <source type="video/mp4" src="http://www.markhillard.com/sandbox/media/polina.mp4">
            </video>
          </template>

          <h1 class="text-white">
            Video
          </h1>
        </q-parallax>

        <div class="q-layout-padding">
          <p v-for="n in 7" :key="n" class="par-text">
            {{ n }} {{ loremipsum }}
          </p>
        </div>
      </div>
    </div>
    <div style="height: 500px;" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      imgSrc: 'https://cdn.quasar.dev/img/parallax1.jpg',
      loremipsum: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    }
  }
}
</script>

<style>
.view-parallax .par-text {
  margin: 5rem 0;
}
</style>
