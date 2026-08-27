<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row">
      <q-select
        filled
        v-model="model"
        hover
        label="Hover to open"
        :options="stringOptions"
        style="width: 250px"
      />

      <q-select
        filled
        v-model="model"
        hover
        :hover-delay="300"
        :hover-hide-delay="600"
        label="With delays"
        :options="stringOptions"
        style="width: 250px"
      />

      <q-select
        filled
        v-model="model"
        hover
        use-input
        input-debounce="0"
        label="With filtering"
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
</template>

<script setup>
import { ref } from 'vue'

const stringOptions = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']

const model = ref(null)
const options = ref(stringOptions)

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
