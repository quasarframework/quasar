<template>
  <div class="q-pa-md">
    <q-responsive :ratio="16/9" style="width: 500px; max-width: 100%;">
      <q-carousel
        swipeable
        animated
        arrows
        v-model="slide"
        infinite
      >
        <q-carousel-slide :name="1" img-src="https://cdn.quasar.dev/img/mountains.jpg" />
        <q-carousel-slide :name="2" img-src="https://cdn.quasar.dev/img/parallax1.jpg" />
        <q-carousel-slide :name="3" img-src="https://cdn.quasar.dev/img/parallax2.jpg" />
        <q-carousel-slide :name="4" img-src="https://cdn.quasar.dev/img/quasar.jpg" />

        <template v-slot:control>
          <q-carousel-control
            position="bottom"
            :offset="[16, 8]"
            class="text-white text-center rounded-borders"
            style="background: rgba(255, 255, 255, .2); padding: 4px 8px;"
          >
            Ratio 16:9
          </q-carousel-control>
        </template>
      </q-carousel>
    </q-responsive>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      slide: ref(1)
    }
  }
}
</script>
