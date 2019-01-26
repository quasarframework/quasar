<template>
  <div class="q-pa-md">
    <q-carousel
      swipeable
      animated
      v-model="slide"
      :autoplay="autoplay"
      ref="carousel"
      infinite
    >
      <q-carousel-slide :name="1" img-src="https://cdn.quasar-framework.org/img/mountains.jpg" />
      <q-carousel-slide :name="2" img-src="https://cdn.quasar-framework.org/img/parallax1.jpg" />
      <q-carousel-slide :name="3" img-src="https://cdn.quasar-framework.org/img/parallax2.jpg" />
      <q-carousel-slide :name="4" img-src="https://cdn.quasar-framework.org/img/quasar.jpg" />

      <q-carousel-control
        slot="control"
        position="top-right"
        :offset="[18, 18]"
        class="text-white"
        style="background: rgba(0, 0, 0, .3); padding: 4px 8px 4px 0; border-radius: 4px"
      >
        <q-toggle dense dark color="orange" v-model="autoplay" label="Auto Play" />
      </q-carousel-control>

      <q-carousel-control
        slot="control"
        position="bottom-right"
        :offset="[18, 18]"
        class="q-gutter-xs"
      >
        <q-btn
          push round dense color="orange" text-color="black" icon="arrow_left"
          @click="$refs.carousel.previous()"
        />
        <q-btn
          push round dense color="orange" text-color="black" icon="arrow_right"
          @click="$refs.carousel.next()"
        />
      </q-carousel-control>
    </q-carousel>
  </div>
</template>

<script>
export default {
  data () {
    return {
      slide: 1,
      autoplay: false
    }
  }
}
</script>
