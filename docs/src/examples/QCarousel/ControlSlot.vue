<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-center">
      <q-carousel
        v-model="slide"
        swipeable
        animated
        navigation
        control-color="amber"
        navigation-icon="favorite"
        style="width: 80%;"
      >
      <q-carousel-slide :name="1" img-src="https://cdn.quasar-framework.org/img/mountains.jpg" />
      <q-carousel-slide :name="2" img-src="https://cdn.quasar-framework.org/img/parallax1.jpg" />
      <q-carousel-slide :name="3" img-src="https://cdn.quasar-framework.org/img/parallax2.jpg" />
      <q-carousel-slide :name="4" img-src="https://cdn.quasar-framework.org/img/quasar.jpg" />
      <q-carousel-slide :name="5" img-src="https://cdn.quasar-framework.org/img/mountains.jpg" />
      <q-carousel-slide :name="6" img-src="https://cdn.quasar-framework.org/img/parallax1.jpg" />
      <q-carousel-slide :name="7" img-src="https://cdn.quasar-framework.org/img/parallax2.jpg" />
      <q-carousel-slide :name="8" img-src="https://cdn.quasar-framework.org/img/quasar.jpg" />
      <q-carousel-slide :name="9" img-src="https://cdn.quasar-framework.org/img/mountains.jpg" />
      <q-carousel-slide :name="10" img-src="https://cdn.quasar-framework.org/img/parallax1.jpg" />
      <q-carousel-slide :name="11" img-src="https://cdn.quasar-framework.org/img/parallax2.jpg" />
      <q-carousel-slide :name="12" img-src="https://cdn.quasar-framework.org/img/quasar.jpg" />

      <q-carousel-control
        slot="control"
        position="bottom"
        :offset="[0, 0]">
        <q-linear-progress :value="(slide - 1) / 11" height="6px" stripe color="orange-7" />
      </q-carousel-control>

      </q-carousel>

    </div>
    <div class="row justify-center">
      <q-carousel
        v-model="slide"
        swipeable
        animated
        navigation
        control-color="amber"
        navigation-icon="favorite"
        style="width: 80%;"
      >
      <q-carousel-slide :name="1" img-src="https://cdn.quasar-framework.org/img/mountains.jpg" />
      <q-carousel-slide :name="2" img-src="https://cdn.quasar-framework.org/img/parallax1.jpg" />
      <q-carousel-slide :name="3" img-src="https://cdn.quasar-framework.org/img/parallax2.jpg" />
      <q-carousel-slide :name="4" img-src="https://cdn.quasar-framework.org/img/quasar.jpg" />
      <q-carousel-slide :name="5" img-src="https://cdn.quasar-framework.org/img/mountains.jpg" />
      <q-carousel-slide :name="6" img-src="https://cdn.quasar-framework.org/img/parallax1.jpg" />
      <q-carousel-slide :name="7" img-src="https://cdn.quasar-framework.org/img/parallax2.jpg" />
      <q-carousel-slide :name="8" img-src="https://cdn.quasar-framework.org/img/quasar.jpg" />
      <q-carousel-slide :name="9" img-src="https://cdn.quasar-framework.org/img/mountains.jpg" />
      <q-carousel-slide :name="10" img-src="https://cdn.quasar-framework.org/img/parallax1.jpg" />
      <q-carousel-slide :name="11" img-src="https://cdn.quasar-framework.org/img/parallax2.jpg" />
      <q-carousel-slide :name="12" img-src="https://cdn.quasar-framework.org/img/quasar.jpg" />

      <q-carousel-control
        slot="control"
        position="top"
        :offset="[0, 0]">
        <q-linear-progress :value="(slide - 1) / 11" height="6px" stripe color="red-7" />
      </q-carousel-control>

      </q-carousel>

    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      slide: 3
    }
  }
}
</script>
