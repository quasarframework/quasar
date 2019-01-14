<template>
  <div class="q-layout-padding q-mx-auto">
    <div class="row justify-center">
      <div class="q-gutter-md" style="max-width: 700px">
        <q-btn label="Seamless" flat color="primary" @click="seamless = true" />
        <q-btn label="Layout" flat color="primary" @click="layout = true" />
        <q-btn label="Inception" flat color="primary" @click="inception = true" />
        <q-btn label="Non standard content" flat color="primary" @click="nonStandard = true" />
        <q-btn label="Complex card" flat color="primary" @click="complexCard = true" />
        <q-btn label="Sliders" flat color="primary" @click="sliders = true" />
      </div>
    </div>

    <q-dialog v-model="seamless" seamless position="bottom">
      <q-card style="width: 350px">
        <q-linear-progress :value="0.6" color="pink" />

        <q-card-section class="row items-center no-wrap">
          <div>
            <div class="text-weight-bold">The Walker</div>
            <div class="text-grey">Fitz & The Tantrums</div>
          </div>

          <q-space />

          <q-btn flat round icon="play_arrow" />
          <q-btn flat round icon="pause" />
          <q-btn flat round icon="close" v-close-dialog />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="layout">
      <q-layout view="Lhh lpR fff" container>
        <q-header reveal class="bg-black">
          <q-toolbar>
            <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
            <q-toolbar-title>Header</q-toolbar-title>
            <q-btn flat @click="drawerR = !drawerR" round dense icon="menu" />
            <q-btn flat v-close-dialog round dense icon="close" />
          </q-toolbar>
        </q-header>

        <q-footer reveal class="bg-black text-white">
          <q-toolbar>
            <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
            <q-toolbar-title>Footer</q-toolbar-title>
            <q-btn flat @click="drawerR = !drawerR" round dense icon="menu" />
          </q-toolbar>
        </q-footer>

        <q-drawer v-model="drawer" :width="200" :breakpoint="600">
          <div v-for="n in 50" :key="n">Drawer {{ n }} / 50</div>
        </q-drawer>
        <q-drawer side="right" v-model="drawerR" :width="200" :breakpoint="300">
          <div v-for="n in 50" :key="n">Drawer {{ n }} / 50</div>
        </q-drawer>
        <q-page-container>
          <q-page style="padding-top: 50px" class="bg-yellow">
            <div v-for="n in contentSize" :key="n">My page My page My page My page My page My page My page My page My page {{ n }} / {{ contentSize }}</div>

            <q-page-sticky position="top-left" :offset="[18, 58]">
              <q-btn round color="primary" icon="arrow_back" class="rotate-45" />
            </q-page-sticky>
            <q-page-sticky position="top-right" :offset="[18, 58]">
              <q-btn round color="primary" icon="arrow_upward" class="rotate-45" />
            </q-page-sticky>
            <q-page-sticky position="bottom-left" :offset="[18, 18]">
              <q-btn round color="primary" icon="arrow_forward" class="rotate-135" />
            </q-page-sticky>
            <q-page-sticky position="bottom-right" :offset="[18, 18]">
              <q-btn round color="primary" icon="arrow_forward" class="rotate-45" />
            </q-page-sticky>

            <q-page-sticky position="top" expand class="bg-purple text-white">
              <q-toolbar>
                <q-btn flat round dense icon="map" />
                <q-toolbar-title>Title</q-toolbar-title>
                <q-checkbox dark color="yellow" v-model="moreContent" label="Scroll" />
              </q-toolbar>
            </q-page-sticky>
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>

    <q-dialog v-model="inception">
      <q-card>
        <q-card-section>
          <div class="text-h6">Inception</div>
        </q-card-section>

        <q-card-section>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perferendis laudantium minus earum totam modi laborum illo, corporis fuga saepe animi aliquam ea enim assumenda ut nulla natus aperiam quis. Iste.
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Open another dialog" @click="persistent = true" />
          <q-btn flat label="Close" v-close-dialog />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="nonStandard">
      <q-carousel
        transition-prev="slide-right"
        transition-next="slide-left"
        swipeable
        animated
        v-model="slide"
        control-color="primary"
        navigation-icon="radio_button_unchecked"
        navigation
        padding
        height="200px"
        class="bg-white shadow-1 generic-border-radius"
      >
        <q-carousel-slide :name="1" class="column no-wrap flex-center">
          <q-icon name="style" color="primary" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide :name="2" class="column no-wrap flex-center">
          <q-icon name="live_tv" color="primary" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide :name="3" class="column no-wrap flex-center">
          <q-icon name="layers" color="primary" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide :name="4" class="column no-wrap flex-center">
          <q-icon name="terrain" color="primary" size="56px" />
          <div class="q-mt-md text-center">
            {{ lorem }}
          </div>
        </q-carousel-slide>
      </q-carousel>
    </q-dialog>

    <q-dialog v-model="complexCard">
      <q-card>
        <q-img
          src="https://media-cdn.tripadvisor.com/media/photo-s/0a/47/a8/91/chicken-salad-sandwich.jpg"
         />

        <q-card-section>
          <q-btn
            fab
            color="primary"
            icon="place"
            class="absolute"
            style="top: 0; right: 20px; transform: translateY(-50%);"
          />

          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">Cafe Basilico</div>
            <div class="col-auto text-grey q-pt-md">
              <q-icon name="place" /> 250 ft
            </div>
          </div>

          <q-rating v-model="stars" :max="5" size="32px" />
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle1">$・Italian, Cafe</div>
          <div class="text-subtitle2 text-grey">Small plates, salads & sandwiches in an intimate setting.</div>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn flat round icon="event" v-close-dialog />
          <q-btn flat v-close-dialog>5:30PM</q-btn>
          <q-btn flat v-close-dialog>7:30PM</q-btn>
          <q-btn flat v-close-dialog>9:00PM</q-btn>
          <q-btn flat color="primary" v-close-dialog>Reserve</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="sliders">
      <q-card style="width: 300px" class="q-px-sm q-pb-md">
        <q-card-section>
          <div class="text-h6">Volumes</div>
        </q-card-section>

        <q-item-label header>Media volume</q-item-label>
        <q-item dense>
          <q-item-section avatar>
            <q-icon name="volume_up" />
          </q-item-section>
          <q-item-section>
            <q-slider color="teal" v-model="slideVol" :step="0" />
          </q-item-section>
        </q-item>

        <q-item-label header>Alarm volume</q-item-label>
        <q-item dense>
          <q-item-section avatar>
            <q-icon name="alarm" />
          </q-item-section>
          <q-item-section>
            <q-slider color="teal" v-model="slideAlarm" :step="0" />
          </q-item-section>
        </q-item>

        <q-item-label header>Ring volume</q-item-label>
        <q-item dense>
          <q-item-section avatar>
            <q-icon name="vibration" />
          </q-item-section>
          <q-item-section>
            <q-slider color="teal" v-model="slideVibration" :step="0" />
          </q-item-section>
        </q-item>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  methods: {
    openSpecialPosition (position) {
      this.$q.dialog({
        title: 'Positioned',
        message: `This dialog appears from ${position}.`,
        position
      })
    }
  },

  data () {
    return {
      seamless: false,
      layout: false,
      inception: false,
      nonStandard: false,
      complexCard: false,
      sliders: false,

      maximizedToggle: true,

      address: '',

      moreContent: true,
      drawer: false,
      drawerR: false,

      slide: 1,
      lorem: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus, ratione eum minus fuga, quasi dicta facilis corporis magnam, suscipit at quo nostrum!',

      stars: 3,

      slideVol: 39,
      slideAlarm: 56,
      slideVibration: 63
    }
  },

  computed: {
    contentSize () {
      return this.moreContent ? 150 : 5
    }
  }
}
</script>
