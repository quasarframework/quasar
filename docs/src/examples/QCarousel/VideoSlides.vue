<template>
  <div class="q-pa-md q-gutter-sm">
    <q-carousel
      animated
      v-model="slide"
      infinite
    >
      <q-carousel-slide name="soft-jazz">
        <q-video
          class="absolute-full"
          src="https://www.youtube.com/embed/k3_tw44QsZQ"
        />
      </q-carousel-slide>

      <q-carousel-slide name="Rihanna">
        <q-video
          class="absolute-full"
          src="https://www.youtube.com/embed/kOkQ4T5WO9E"
        />
      </q-carousel-slide>

      <q-carousel-slide name="chill-mix">
        <q-video
          class="absolute-full"
          src="https://www.youtube.com/embed/rQLhZlI6aTM"
        />
      </q-carousel-slide>
    </q-carousel>

    <div class="row justify-center">
      <q-btn-toggle
        glossy
        v-model="slide"
        :options="[
          { label: 'Soft Jazz', value: 'soft-jazz' },
          { label: 'Rihanna', value: 'Rihanna' },
          { label: 'Chill Mix', value: 'chill-mix' }
        ]"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      slide: 'Rihanna'
    }
  }
}
</script>
