<template>
  <div class="q-pa-md q-gutter-sm">
    <q-banner rounded class="bg-grey-3">
      <img
        slot="avatar"
        src="https://cdn.quasar-framework.org/img/mountains.jpg"
        style="width: 100px; height: 64px"
      >

      Could not retrieve travel data.
      <q-btn slot="action" flat label="Retry" />
    </q-banner>
  </div>
</template>
