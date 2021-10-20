<template>
  <q-page class="bg-h-dark text-white relative-position">

    <section class="q-px-lg">
      <div class="row justify-end socials q-pa-md">
        <q-btn flat :icon="fabGithub" color="h-primary" class="socials-item" />
        <q-btn flat icon="message" color="h-primary" class="socials-item" />
        <q-btn flat icon="forum" color="h-primary" class="socials-item" />
        <q-btn flat :icon="fabTwitter" color="h-primary" class="socials-item" />
        <q-btn
          flat
          :icon="fabFacebookSquare"
          color="h-primary"
          class="socials-item"
        />
      </div>
    </section>

    <section>
      <div class="row flex flex-center q-mt-xl">
        <div class="col-6 column items-center text-center about">
          <div class="about-img">
            <div class="bg-red" style="height: 250px; width: 250px;">
              QUASAR logo 😀
            </div>
          </div>

          <div class="q-py-lg text-h-light about__text">
            The open source multi-platform development framework based on Vue.js
            with an enterprise vocation.
          </div>

          <div>
            <q-btn
              color="h-accent"
              label="Take a look across the stars"
              class="shadow-6 h-btn h-btn-primary"
            />
          </div>

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
    </section>

    <section>
      <div class="sponsors row justify-center q-mt-xl q-pt-sm">
        <div class="col-7 column items-center">
          <div class="text-h-primary text-center sponsors-heading">
            Our platform sponsors
          </div>

          <div class="row bg-primary q-my-lg">
            Sponsor Logos 😄
          </div>

          <div class="q-mb-xl">
            <q-btn
              flat
              padding="none"
              label="Full sponsors' list"
              text-color="h-light"
              no-caps
              class="h-btn-underline"
            />
          </div>
        </div>
      </div>
    </section>

    <section></section>
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
.socials {
  &-item {
    padding: 0px;
    font-size: 14px;
    margin-left: 10px;
  }
}

.about {
  &__text {
    font-size: 20px;
    color: rgba(255, 255, 255, 0.54);
    line-height: 1.4;
    letter-spacing: 3.75px;
    font-weight: normal;
  }
}

.h-btn {
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 2.63px;
  color: #fff;
  box-shadow: 0 6px 6px 0 rgba($homepage-primary, 0.28);
  padding: 15px 16px 16px;
  border-radius: 4px;
}

.sponsors-heading {
  font-size: 16px;
  letter-spacing: 3px;
  line-height: 1.38;
  font-weight: normal;
  text-transform: capitalize;
}

.h-btn-underline {
  border-bottom: 1px solid $homepage-light;
  font-size: 16px;
  letter-spacing: 3px;
  line-height: normal;
}
</style>
