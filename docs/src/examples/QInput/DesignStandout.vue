<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-toggle v-model="dense" label="Dense QInput" />

      <q-input standout v-model="text" :dense="dense" />

      <q-input
        standout="bg-teal text-white"
        v-model="text"
        label="Custom standout"
        :dense="dense"
      />

      <q-input
        standout
        v-model="text"
        label="Label (stacked)"
        stack-label
        :dense="dense"
      />

      <q-input standout v-model="text" label="Label" :dense="dense" />

      <q-input
        standout
        v-model="ph"
        label="Label"
        placeholder="Placeholder"
        hint="With placeholder"
        :dense="dense"
      />

      <q-input
        standout
        v-model="ph"
        placeholder="Placeholder"
        hint="With placeholder"
        :dense="dense"
      />

      <q-input
        standout
        square
        v-model="text"
        hint="With perfect square borders"
        :dense="dense"
      />

      <q-input standout v-model="text" :dense="dense">
        <template #prepend>
          <q-icon name="event" />
        </template>
      </q-input>

      <q-input standout v-model="text" :dense="dense">
        <template #append>
          <q-avatar>
            <img
              alt="Quasar logo"
              src="https://cdn.quasar.dev/logo-v2/svg/logo.svg"
            />
          </q-avatar>
        </template>
      </q-input>

      <q-input
        standout
        bottom-slots
        v-model="text"
        label="Label"
        counter
        :dense="dense"
      >
        <template #prepend>
          <q-icon name="place" />
        </template>
        <template #append>
          <q-icon name="close" @click="text = ''" class="cursor-pointer" />
        </template>

        <template #hint> Field hint </template>
      </q-input>

      <q-input
        standout
        bottom-slots
        v-model="text"
        label="Label"
        counter
        maxlength="12"
        :dense="dense"
      >
        <template #before>
          <q-icon name="flight_takeoff" />
        </template>

        <template #append>
          <q-icon
            v-if="text !== ''"
            name="close"
            @click="text = ''"
            class="cursor-pointer"
          />
          <q-icon name="search" />
        </template>

        <template #hint> Field hint </template>
      </q-input>

      <q-input
        standout
        bottom-slots
        v-model="text"
        label="Label"
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

        <template #append>
          <q-icon
            v-if="text !== ''"
            name="close"
            @click="text = ''"
            class="cursor-pointer"
          />
          <q-icon name="schedule" />
        </template>

        <template #hint> Field hint </template>

        <template #after>
          <q-btn round dense flat icon="send" />
        </template>
      </q-input>

      <q-input
        standout
        bottom-slots
        v-model="text"
        label="Label"
        counter
        maxlength="12"
        :dense="dense"
      >
        <template #before>
          <q-icon name="event" />
        </template>

        <template #hint> Field hint </template>

        <template #append>
          <q-btn round dense flat icon="add" />
        </template>
      </q-input>

      <q-input standout v-model="text" hint="Disable" :dense="dense" disable />

      <q-input
        standout
        v-model="text"
        hint="Readonly"
        :dense="dense"
        readonly
      />

      <q-input
        standout
        v-model="text"
        hint="Disable and readonly"
        :dense="dense"
        disable
        readonly
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const text = ref('')
const ph = ref('')
const dense = ref(false)
</script>
