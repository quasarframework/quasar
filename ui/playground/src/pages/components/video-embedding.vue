<template>
  <div>
    <div class="q-layout-padding">
      <p class="caption">
        With Component
      </p>
      <q-video
        src="https://www.youtube.com/embed/k3_tw44QsZQ?rel=0"
      />

      <p class="caption">
        With Component - responsive 16/9
      </p>
      <q-video
        src="https://www.youtube.com/embed/k3_tw44QsZQ?rel=0"
        :ratio="16/9"
      />

      <p class="caption">
        With Component - responsive 4/3
      </p>
      <q-video
        src="https://www.youtube.com/embed/k3_tw44QsZQ?rel=0"
        :ratio="4/3"
      />

      <p class="caption">
        With HTML Markup
      </p>
      <div class="q-video">
        <iframe
          src="https://www.youtube.com/embed/k3_tw44QsZQ?rel=0"
          frameborder="0"
          allowfullscreen
        />
      </div>
    </div>
  </div>
</template>
