<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-center">
      <q-carousel
        v-model="slide"
        swipeable
        animated
        arrows
        infinite
        navigation
        controls
        control-color="orange-7"
        style="width: 80%;"
        padding
      >
        <q-carousel-slide :name="1" img-src="https://cdn.quasar-framework.org/img/mountains.jpg" />
        <q-carousel-slide :name="2" img-src="https://cdn.quasar-framework.org/img/parallax1.jpg" />
        <q-carousel-slide :name="3" img-src="https://cdn.quasar-framework.org/img/parallax2.jpg" />
        <q-carousel-slide :name="4" img-src="https://cdn.quasar-framework.org/img/quasar.jpg" />
      </q-carousel>
    </div>
    <div class="row justify-center">
      <q-btn label="1" @click="onClick(1)" />
      <q-btn label="2" @click="onClick(2)" />
      <q-btn label="3" @click="onClick(3)" />
      <q-btn label="4" @click="onClick(4)" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      slide: 1
    }
  },
  methods: {
    onClick (value) {
      this.slide = value
    }
  }
}
</script>
