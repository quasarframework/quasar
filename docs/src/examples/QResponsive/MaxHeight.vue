<template>
  <div class="q-pa-md">
    <div class="row items-start q-gutter-md">
      <q-responsive :ratio="4/3" class="col" style="max-height: 100px">
        <q-card class="column" flat bordered>
          <q-img class="col" src="https://cdn.quasar.dev/img/parallax1.jpg" />

          <q-card-section>
            <div>Ratio 4:3, but max height of 100px</div>
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
