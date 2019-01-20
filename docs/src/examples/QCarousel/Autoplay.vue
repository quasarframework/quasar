<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-center">
      <q-carousel
        v-model="slide"
        swipeable
        animated
        transition-prev="slide-right"
        transition-next="slide-left"
        control-color="primary"
        infinite
        :autoplay="2500"
        height="200px"
        class="bg-white shadow-1 generic-border-radius"
      >
        <q-carousel-slide
          :name="1"
          class="column no-wrap flex-center"
        >
          <q-icon name="style" color="primary" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide
          :name="2"
          class="column no-wrap flex-center"
        >
          <q-icon name="live_tv" color="primary" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide
          :name="3"
          class="column no-wrap flex-center"
        >
          <q-icon name="layers" color="primary" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide
          :name="4"
          class="column no-wrap flex-center"
        >
          <q-icon name="terrain" color="primary" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>
    <div class="row justify-center">
      <q-carousel
        v-model="slide"
        swipeable
        animated
        transition-prev="slide-up"
        transition-next="slide-down"
        control-color="primary"
        infinite
        :autoplay="2500"
        height="200px"
        class="bg-white shadow-1 generic-border-radius"
      >
        <q-carousel-slide
          :name="1"
          class="column no-wrap flex-center"
        >
          <q-icon name="style" color="primary" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide
          :name="2"
          class="column no-wrap flex-center"
        >
          <q-icon name="live_tv" color="primary" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide
          :name="3"
          class="column no-wrap flex-center"
        >
          <q-icon name="layers" color="primary" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide
          :name="4"
          class="column no-wrap flex-center"
        >
          <q-icon name="terrain" color="primary" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      slide: 1,
      lorem: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus, ratione eum minus fuga, quasi dicta facilis corporis magnam, suscipit at quo nostrum!'
    }
  }
}
</script>
