<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-toggle v-model="dense" label="Dense QInput" />

      <q-field standout :dense="dense">
        <template #control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field standout label="Label" stack-label :dense="dense">
        <template #control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field
        standout="bg-teal text-white"
        label="Custom standout"
        stack-label
        :dense="dense"
      >
        <template #control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field
        standout
        square
        hint="With perfect square borders"
        :dense="dense"
      >
        <template #control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field standout :dense="dense">
        <template #prepend>
          <q-icon name="event" />
        </template>

        <template #control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field standout :dense="dense">
        <template #control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>

        <template #append>
          <q-avatar>
            <img
              alt="Quasar logo"
              src="https://cdn.quasar.dev/logo-v2/svg/logo.svg"
            />
          </q-avatar>
        </template>
      </q-field>

      <q-field
        standout
        :model-value="text"
        bottom-slots
        label="Label"
        stack-label
        counter
        :dense="dense"
      >
        <template #prepend>
          <q-icon name="place" />
        </template>

        <template #control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>

        <template #append>
          <q-icon name="close" class="cursor-pointer" />
        </template>

        <template #hint> Field hint </template>
      </q-field>

      <q-field
        standout
        :model-value="text"
        bottom-slots
        label="Label"
        stack-label
        counter
        maxlength="12"
        :dense="dense"
      >
        <template #before>
          <q-icon name="flight_takeoff" />
        </template>

        <template #control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>

        <template #append>
          <q-icon v-if="text !== ''" name="close" class="cursor-pointer" />
          <q-icon name="search" />
        </template>

        <template #hint> Field hint </template>
      </q-field>

      <q-field
        standout
        :model-value="text"
        bottom-slots
        label="Label"
        stack-label
        counter
        maxlength="12"
        :dense="dense"
      >
        <template #before>
          <q-avatar>
            <img
              alt="User avatar"
              src="https://cdn.quasar.dev/img/avatar5.jpg"
            />
          </q-avatar>
        </template>

        <template #control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>

        <template #append>
          <q-icon v-if="text !== ''" name="close" class="cursor-pointer" />
          <q-icon name="schedule" />
        </template>

        <template #hint> Field hint </template>

        <template #after>
          <q-btn round dense flat icon="send" />
        </template>
      </q-field>

      <q-field
        standout
        :model-value="text"
        bottom-slots
        label="Label"
        stack-label
        counter
        maxlength="12"
        :dense="dense"
      >
        <template #before>
          <q-icon name="event" />
        </template>

        <template #control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>

        <template #hint> Field hint </template>

        <template #append>
          <q-btn round dense flat icon="add" />
        </template>
      </q-field>

      <q-field standout hint="Disable" :dense="dense" disable>
        <template #control>
          <div class="self-center full-width no-outline">{{ text }}</div>
        </template>
      </q-field>

      <q-field standout hint="Readonly" :dense="dense" readonly>
        <template #control>
          <div class="self-center full-width no-outline">{{ text }}</div>
        </template>
      </q-field>

      <q-field
        standout
        hint="Disable and readonly"
        :dense="dense"
        disable
        readonly
      >
        <template #control>
          <div class="self-center full-width no-outline">{{ text }}</div>
        </template>
      </q-field>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const text = ref('Field content')
const dense = ref(false)
</script>
