<template>
  <div class="q-pa-md q-gutter-sm">
    <q-banner rounded class="bg-grey-3">
      <template v-slot:avatar>
        <img
          src="https://cdn.quasar.dev/img/mountains.jpg"
          style="width: 100px; height: 64px"
        >
      </template>

      Could not retrieve travel data.
      <template v-slot:action>
        <q-btn flat label="Retry" />
      </template>
    </q-banner>
  </div>
</template>
