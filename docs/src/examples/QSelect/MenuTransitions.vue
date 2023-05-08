<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row">
      <q-select
        label="Flip up/down"
        transition-show="flip-up"
        transition-hide="flip-down"
        filled
        v-model="model"
        :options="options"
        style="width: 250px"
      />

      <q-select
        label="Scale"
        transition-show="scale"
        transition-hide="scale"
        filled
        v-model="model"
        :options="options"
        style="width: 250px"
      />

      <q-select
        label="Jump up"
        transition-show="jump-up"
        transition-hide="jump-up"
        filled
        v-model="model"
        :options="options"
        style="width: 250px"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      model: ref(null),
      options: [
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
      ]
    }
  }
}
</script>
