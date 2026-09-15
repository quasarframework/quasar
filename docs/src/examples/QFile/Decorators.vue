<template>
  <div class="q-pa-md">
    <div class="q-gutter-md" style="max-width: 300px">
      <q-file filled v-model="model" label="Label (stacked)" stack-label />

      <q-file outlined v-model="model">
        <template #prepend>
          <q-icon name="attach_file" />
        </template>
      </q-file>

      <q-file standout v-model="model">
        <template #append>
          <q-avatar>
            <img
              alt="Quasar logo"
              src="https://cdn.quasar.dev/logo-v2/svg/logo.svg"
            />
          </q-avatar>
        </template>
      </q-file>

      <q-file filled bottom-slots v-model="model" label="Label" counter>
        <template #prepend>
          <q-icon name="cloud_upload" @click.stop.prevent />
        </template>
        <template #append>
          <q-icon
            name="close"
            @click.stop.prevent="model = null"
            class="cursor-pointer"
          />
        </template>

        <template #hint> Field hint </template>
      </q-file>

      <q-file
        rounded
        outlined
        bottom-slots
        v-model="model"
        label="Label"
        counter
        max-files="12"
      >
        <template #before>
          <q-icon name="attachment" />
        </template>

        <template #append>
          <q-icon
            v-if="model !== null"
            name="close"
            @click.stop.prevent="model = null"
            class="cursor-pointer"
          />
          <q-icon name="search" @click.stop.prevent />
        </template>

        <template #hint> Field hint </template>
      </q-file>

      <q-file
        filled
        bottom-slots
        v-model="model"
        label="Label"
        counter
        max-files="12"
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
            v-if="model !== null"
            name="close"
            @click.stop.prevent="model = null"
            class="cursor-pointer"
          />
          <q-icon name="create_new_folder" @click.stop.prevent />
        </template>

        <template #hint> Field hint </template>

        <template #after>
          <q-btn round dense flat icon="send" />
        </template>
      </q-file>

      <q-file
        filled
        bottom-slots
        v-model="model"
        label="Label"
        counter
        max-files="12"
      >
        <template #before>
          <q-icon name="folder_open" />
        </template>

        <template #hint> Field hint </template>

        <template #append>
          <q-btn round dense flat icon="add" @click.stop.prevent />
        </template>
      </q-file>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
</script>
