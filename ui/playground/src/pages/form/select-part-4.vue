<template>
  <div class="q-layout-padding">
    <div class="q-pa-md">
      <div>Last KeyUp event key: {{ outputup }}</div>
      <div>Last KeyDown event key: {{ outputdown }}</div>
      <div>Model: {{ model }}</div>
      <div class="q-gutter-md row">
        <q-select
          @keyup="mykeyup"
          @keydown="mykeydown"
          filled
          v-model="model"
          use-input
          input-debounce="0"
          label="Simple filter"
          :options="options"
          @filter="filterFn"
          style="width: 250px"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </div>

    <div class="q-pa-md">
      <div class="q-gutter-md row">
        <q-select
          filled
          v-model="model"
          use-input
          input-debounce="0"
          label="Styled input - string"
          :options="options"
          @filter="filterFn"
          style="width: 250px"
          input-class="text-green text-right"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          filled
          v-model="model"
          use-input
          input-debounce="0"
          label="Styled input - array"
          :options="options"
          @filter="filterFn"
          style="width: 250px"
          :input-class="['text-green', 'text-right']"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          filled
          v-model="model"
          use-input
          input-debounce="0"
          label="Styled input - object"
          :options="options"
          @filter="filterFn"
          style="width: 250px"
          :input-class="{ 'text-green': true, 'text-right': true }"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const stringOptions = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']

const model = ref(null)
const options = ref(stringOptions)
const outputup = ref('n/a')
const outputdown = ref('n/a')

function mykeyup(e) {
  console.log('keyup', e)
  outputup.value = e.key
}
function mykeydown(e) {
  console.log('keydown', e)
  outputdown.value = e.key
}
function filterFn(val, update) {
  if (val === '') {
    update(() => {
      options.value = stringOptions
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    options.value = stringOptions.filter(v => v.toLowerCase().includes(needle))
  })
}
</script>
