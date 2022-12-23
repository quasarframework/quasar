<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="my-card" flat bordered>
      <img src="https://cdn.quasar.dev/img/parallax2.jpg">

      <q-list>
        <q-item clickable>
          <q-item-section avatar>
            <q-icon color="primary" name="local_bar" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Bar XYZ</q-item-label>
            <q-item-label caption>Have a drink.</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar>
            <q-icon color="red" name="local_gas_station" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Gas Station</q-item-label>
            <q-item-label caption>Fill your gas tank.</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar>
            <q-icon color="amber" name="local_movies" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Cinema XYZ</q-item-label>
            <q-item-label caption>Watch a movie.</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <q-card class="my-card" flat bordered>
      <img src="https://cdn.quasar.dev/img/mountains.jpg">

      <q-card-actions align="right">
        <q-btn flat round color="red" icon="favorite" />
        <q-btn flat round color="teal" icon="bookmark" />
        <q-btn flat round color="primary" icon="share" />
      </q-card-actions>
    </q-card>

    <q-card class="my-card" flat bordered>
      <q-card-section>
        <div class="text-h6 q-mb-xs">Our Changing Planet</div>
        <div class="row no-wrap items-center">
          <q-rating size="18px" v-model="stars" :max="5" color="primary" />
          <span class="text-caption text-grey q-ml-sm">4.2 (551)</span>
        </div>
      </q-card-section>

      <img src="https://cdn.quasar.dev/img/mountains.jpg">
    </q-card>

    <q-card class="my-card" flat bordered>
      <q-img src="https://cdn.quasar.dev/img/chicken-salad.jpg" />

      <q-card-section>
        <q-btn
          fab
          color="primary"
          icon="place"
          class="absolute"
          style="top: 0; right: 12px; transform: translateY(-50%);"
        />

        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">
            Cafe Basilico
          </div>
          <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
            <q-icon name="place" />
            250 ft
          </div>
        </div>

        <q-rating v-model="stars" :max="5" size="32px" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-subtitle1">
          $・Italian, Cafe
        </div>
        <div class="text-caption text-grey">
          Small plates, salads & sandwiches in an intimate setting.
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-btn flat round icon="event" />
        <q-btn flat color="primary">
          Reserve
        </q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      stars: ref(4)
    }
  }
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 300px
</style>
