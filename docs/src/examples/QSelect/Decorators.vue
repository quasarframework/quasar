<template>
  <div class="q-pa-md">
    <div class="q-pb-lg">
      <q-toggle v-model="dense" label="Dense QSelect" />
      <q-toggle v-model="denseOpts" label="Dense options" />
    </div>

    <div class="q-gutter-md" style="max-width: 300px">
      <q-select
        filled
        v-model="model"
        :options="options"
        label="Label (stacked)"
        stack-label
        :dense="dense"
        :options-dense="denseOpts"
      />

      <q-select
        outlined
        v-model="model"
        :options="options"
        :dense="dense"
        :options-dense="denseOpts"
      >
        <template #prepend>
          <q-icon name="event" />
        </template>
      </q-select>

      <q-select
        standout
        v-model="model"
        :options="options"
        :dense="dense"
        :options-dense="denseOpts"
      >
        <template #append>
          <q-avatar>
            <img
              alt="Quasar logo"
              src="https://cdn.quasar.dev/logo-v2/svg/logo.svg"
            />
          </q-avatar>
        </template>
      </q-select>

      <q-select
        filled
        bottom-slots
        v-model="model"
        :options="options"
        label="Label"
        counter
        :dense="dense"
        :options-dense="denseOpts"
      >
        <template #prepend>
          <q-icon name="place" @click.stop.prevent />
        </template>
        <template #append>
          <q-icon
            name="close"
            @click.stop.prevent="model = ''"
            class="cursor-pointer"
          />
        </template>

        <template #hint> Field hint </template>
      </q-select>

      <q-select
        rounded
        outlined
        bottom-slots
        v-model="model"
        :options="options"
        label="Label"
        counter
        maxlength="12"
        :dense="dense"
        :options-dense="denseOpts"
      >
        <template #before>
          <q-icon name="flight_takeoff" />
        </template>

        <template #append>
          <q-icon
            v-if="model !== ''"
            name="close"
            @click.stop.prevent="model = ''"
            class="cursor-pointer"
          />
          <q-icon name="search" @click.stop.prevent />
        </template>

        <template #hint> Field hint </template>
      </q-select>

      <q-select
        filled
        bottom-slots
        v-model="model"
        :options="options"
        label="Label"
        counter
        maxlength="12"
        :dense="dense"
        :options-dense="denseOpts"
      >
        <template #before>
          <q-avatar>
            <img
              alt="User avatar"
              src="https://cdn.quasar.dev/img/avatar5.jpg"
            />
          </q-avatar>
        </template>

        <template #append>
          <q-icon
            v-if="model !== ''"
            name="close"
            @click.stop.prevent="model = ''"
            class="cursor-pointer"
          />
          <q-icon name="schedule" @click.stop.prevent />
        </template>

        <template #hint> Field hint </template>

        <template #after>
          <q-btn round dense flat icon="send" />
        </template>
      </q-select>

      <q-select
        filled
        bottom-slots
        v-model="model"
        :options="options"
        label="Label"
        counter
        maxlength="12"
        :dense="dense"
        :options-dense="denseOpts"
      >
        <template #before>
          <q-icon name="event" />
        </template>

        <template #hint> Field hint </template>

        <template #append>
          <q-btn round dense flat icon="add" @click.stop.prevent />
        </template>
      </q-select>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
const options = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']
const dense = ref(false)
const denseOpts = ref(false)
</script>
