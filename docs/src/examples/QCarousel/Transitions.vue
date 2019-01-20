<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-center">
      <q-carousel
        v-model="slide"
        swipeable
        animated
        transition-prev="slide-right"
        transition-next="slide-left"
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
        transition-prev="fade"
        transition-next="fade"
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
        transition-prev="slide-down"
        transition-next="slide-up"
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
      slide: 1,
      lorem: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus, ratione eum minus fuga, quasi dicta facilis corporis magnam, suscipit at quo nostrum!'
    }
  },
  methods: {
    onClick (value) {
      this.slide = value
    }
  }
}
</script>
