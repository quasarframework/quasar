<template>
  <div class="q-pa-md q-gutter-sm">
    <q-card>
      <q-img src="https://cdn.quasar-framework.org/img/donuts.png" />

      <q-card-section>
        <q-btn
          fab
          color="primary"
          icon="place"
          class="absolute"
          style="top: 0; right: 12px; transform: translateY(-50%);"
        />

        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">Cafe Basilico</div>
          <div class="col-auto text-grey-8 q-pt-md">
            <q-icon name="place" /> 250 ft
          </div>
        </div>

        <q-rating v-model="stars" :max="5" size="32px" />
      </q-card-section>

      <q-card-section>
        <div class="text-subtitle1">$・Italian, Cafe</div>
        <div class="text-subtitle2 text-grey">
          Small plates, salads & sandwiches in an intimate setting.
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-btn flat round icon="event" />
        <q-btn flat>5:30 PM</q-btn>
        <q-btn flat>7:30 PM</q-btn>
        <q-btn flat>9:00 PM</q-btn>
        <q-btn flat color="primary">Reserve</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tab: 'one',
      stars: 3
    }
  }
}
</script>
