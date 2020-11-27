<template>
  <div>
    <q-splitter
      v-model="splitterModel"
      style="height: 300px"
      :limits="[0, 100]"
      before-class="overflow-hidden"
      after-class="overflow-hidden"
      separator-class="bg-black"
    >

      <template v-slot:before>
        <q-img
          src="https://cdn.quasar.dev/img/parallax1.jpg"
          :ratio="16/9"
        />
      </template>

      <template v-slot:after>
        <q-img
          src="https://cdn.quasar.dev/img/parallax1-inverted.jpg"
          :ratio="16/9"
        />
      </template>

    </q-splitter>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      splitterModel: ref(50) // start at 50%
    }
  }
}
</script>
