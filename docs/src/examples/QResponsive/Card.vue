<template>
  <div class="q-pa-md">
    <div class="row items-start q-gutter-md">
      <q-responsive :ratio="16/9" class="col">
        <q-card class="column">
          <q-img class="col" src="https://cdn.quasar.dev/img/parallax2.jpg" />

          <q-card-section>
            <div>Ratio 16:9</div>
          </q-card-section>
        </q-card>
      </q-responsive>

      <q-responsive :ratio="1" class="col">
        <q-card class="column">
          <q-img class="col" src="https://cdn.quasar.dev/img/parallax1.jpg" />

          <q-card-section>
            <div>Ratio 1:1</div>
          </q-card-section>
        </q-card>
      </q-responsive>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      slide: ref(1)
    }
  }
}
</script>
