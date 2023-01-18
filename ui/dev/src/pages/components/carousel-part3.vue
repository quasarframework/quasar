<template>
  <div class="q-pa-md" style="max-width: 600px">
    <div>Counter: {{ counter }}</div>
    <q-carousel
      v-model="slide"
      transition-prev="slide-right"
      transition-next="slide-left"
      swipeable
      animated
      control-color="primary"
      navigation
      padding
      arrows
      height="300px"
      class="bg-grey-1 shadow-2 rounded-borders"
    >
      <q-carousel-slide :name="1" class="column no-wrap">
        <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
          <q-img native-context-menu not-draggable class="rounded-borders col-6 full-height" src="https://cdn.quasar.dev/img/mountains.jpg">
            <div>Description</div>
          </q-img>
          <q-img native-context-menu not-draggable class="rounded-borders col-6 full-height" src="https://cdn.quasar.dev/img/parallax1.jpg">
            <div>
              <q-btn label="Button" color="primary" @click="counter++" />
            </div>
          </q-img>
        </div>
      </q-carousel-slide>
      <q-carousel-slide :name="2" class="column no-wrap">
        <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
          <q-img class="rounded-borders col-6 full-height" src="https://cdn.quasar.dev/img/parallax2.jpg">
            <div>without context menu and draggable</div>
          </q-img>
          <q-img not-draggable class="rounded-borders col-6 full-height" src="https://cdn.quasar.dev/img/quasar.jpg">
            <div>without context menu and not draggable</div>
          </q-img>
        </div>
      </q-carousel-slide>
      <q-carousel-slide :name="3" class="column no-wrap">
        <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
          <q-img native-context-menu class="rounded-borders col-6 full-height" src="https://cdn.quasar.dev/img/cat.jpg">
            <div>with context menu and draggable</div>
          </q-img>
          <q-img native-context-menu not-draggable class="rounded-borders col-6 full-height" src="https://cdn.quasar.dev/img/linux-avatar.png" />
        </div>
      </q-carousel-slide>
      <q-carousel-slide :name="4" class="column no-wrap">
        <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
          <q-img native-context-menu not-draggable class="rounded-borders col-6 full-height" src="https://cdn.quasar.dev/img/material.png" />
          <q-img native-context-menu not-draggable class="rounded-borders col-6 full-height" src="https://cdn.quasar.dev/img/donuts.png" />
        </div>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script>
export default {
  data () {
    return {
      slide: 1,
      counter: 0
    }
  }
}
</script>
