<template>
  <div class="q-pa-md">
    <q-parallax :height="150">
      <template v-slot:media>
        <video width="720" height="440" poster="https://cdn.quasar-framework.org/img/polina.jpg" autoplay loop muted>
          <source type="video/webm" src="https://cdn.quasar-framework.org/img/polina.webm">
          <source type="video/mp4" src="https://cdn.quasar-framework.org/img/polina.mp4">
        </video>
      </template>

      <h3 class="text-white">Video</h3>
    </q-parallax>
  </div>
</template>
