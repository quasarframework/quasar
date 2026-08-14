<template>
  <div class="q-pa-md bg-grey-9 text-white">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <div>
        <q-toggle v-model="readonly" label="Readonly" dark />
        <q-toggle v-model="disable" label="Disable" dark />
      </div>

      <q-field dark :readonly="readonly" :disable="disable">
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" :tabindex="tabindex">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field dark filled :readonly="readonly" :disable="disable">
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" :tabindex="tabindex">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field dark outlined :readonly="readonly" :disable="disable">
        <template v-slot:control>
          <div class="self-center full-width no-outline" :tabindex="tabindex">{{
            text
          }}</div>
        </template>

        <template v-slot:append>
          <q-avatar>
            <img
              alt=""
              src="https://cdn.quasar.dev/logo-v2/svg/logo-dark.svg"
            />
          </q-avatar>
        </template>
      </q-field>

      <q-field
        dark
        standout
        bottom-slots
        :model-value="text"
        label="Label"
        stack-label
        counter
        :readonly="readonly"
        :disable="disable"
      >
        <template v-slot:prepend>
          <q-icon name="place" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" :tabindex="tabindex">{{
            text
          }}</div>
        </template>

        <template v-slot:append>
          <q-icon name="close" @click="text = ''" class="cursor-pointer" />
        </template>

        <template v-slot:hint> Field hint </template>
      </q-field>

      <q-field dark borderless :readonly="readonly" :disable="disable">
        <template v-slot:control>
          <div class="self-center full-width no-outline" :tabindex="tabindex">{{
            text
          }}</div>
        </template>

        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-field>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const text = ref('Field content')
const readonly = ref(false)
const disable = ref(false)
const tabindex = computed(() => (disable.value || readonly.value ? -1 : 0))
</script>
