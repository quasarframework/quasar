<template>
  <q-page class="bg-lp-dark text-white relative-position">

    <div class="row justify-end q-pa-sm q-mx-lg">
      <q-btn :icon="fabGithub" flat color="lp-primary" round size="md"/>
      <q-btn color="lp-primary" flat icon="message" round size="md"/>
      <q-btn color="lp-primary" flat icon="forum" round size="md"/>
      <q-btn :icon="fabTwitter" color="lp-primary" flat round size="md"/>
      <q-btn :icon="fabFacebookSquare" color="lp-primary" flat round size="md"/>
    </div>

    <div class="row flex-center q-mt-xl">
      <div class="col-6 column items-center text-center about">
        <div class="about-img">
          <div class="bg-red" style="height: 250px; width: 250px;">
            QUASAR logo 😀
          </div>
        </div>

        <div class="q-py-lg text-lp-light text-size-20">
          The open source multi-platform development framework based on Vue.js
          with an enterprise vocation.
        </div>

        <q-btn
          color="lp-accent"
          label="Take a look across the stars"
          padding="md"
          class="text-size-14 text-bold shadow-bottom-small"
        />

        <div class="q-mt-lg">
          <q-btn
            flat
            round
            icon="arrow_downward"
            class="text-white"
            size="lg"
            padding="none"
          />
        </div>
      </div>
    </div>

    <div>
      <div class="text-lp-primary text-center text-size-16 text-capitalize">
        Our platform sponsors
      </div>
      <div class="sponsors row justify-center q-mt-xl q-pt-sm">
        <div class="col-7 column items-center">
          <div class="row bg-primary q-my-lg">
            Sponsor Logos 😄
          </div>
            <q-btn
              flat
              padding="none"
              text-color="lp-light"
              no-caps
              class="text-size-16"
            ><span class="text-underline lp-btn-underline">Sponsor's list</span></q-btn>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import {
  fabGithub,
  fabTwitter,
  fabFacebookSquare
} from '@quasar/extras/fontawesome-v5'

export default defineComponent({
  name: 'Index',
  setup () {
    return {
      fabGithub,
      fabTwitter,
      fabFacebookSquare
    }
  }
})
</script>

<style scoped lang="scss">
.lp-btn-underline {
  border-bottom: 1px solid $lp-light;
}
</style>
