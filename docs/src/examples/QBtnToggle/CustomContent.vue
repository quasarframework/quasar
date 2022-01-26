<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-btn-toggle
        v-model="model"
        push
        glossy
        toggle-color="teal"
        :options="[
          {label: 'One', value: 'one', slot: 'one'},
          {label: 'Two', value: 'two', slot: 'two'},
          {label: 'Three', value: 'three', slot: 'three'}
        ]"
      >
        <template v-slot:one>
          <q-tooltip>One!</q-tooltip>
        </template>

        <template v-slot:two>
          <q-tooltip>Two!</q-tooltip>
        </template>

        <template v-slot:three>
          <q-tooltip>Three!</q-tooltip>
        </template>
      </q-btn-toggle>

      <q-btn-toggle
        v-model="model"
        push
        rounded
        glossy
        toggle-color="purple"
        :options="[
          {value: 'one', slot: 'one'},
          {value: 'two', slot: 'two'},
          {value: 'three', slot: 'three'}
        ]"
      >
        <template v-slot:one>
          <div class="row items-center no-wrap">
            <div class="text-center">
              Pick<br>boat
            </div>
            <q-icon right name="directions_boat" />
          </div>
        </template>

        <template v-slot:two>
          <div class="row items-center no-wrap">
            <div class="text-center">
              Pick<br>car
            </div>
            <q-icon right name="directions_car" />
          </div>
        </template>

        <template v-slot:three>
          <div class="row items-center no-wrap">
            <div class="text-center">
              Pick<br>railway
            </div>
            <q-icon right name="directions_railway" />
          </div>
        </template>
      </q-btn-toggle>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      model: ref('three')
    }
  }
}
</script>
