<template>
  <div class="q-pa-md">
    <q-parallax>
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
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" style="width: 150px; height: 150px">
          <div class="text-h3 text-white text-center">Quasar Framework</div>
          <div class="text-h6 text-grey-3 text-center">
            v{{ $q.version }}
          </div>
        </div>
      </template>
    </q-parallax>
  </div>
</template>
