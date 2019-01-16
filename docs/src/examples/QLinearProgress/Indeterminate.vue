<template>
  <div class="q-pa-md gutter-md">
    <div class="q-gutter-md q-pa-md">
      Standard:
      <q-linear-progress indeterminate class="q-mb-lg" />
      Secondary:
      <q-linear-progress indeterminate class="q-mb-lg" color="secondary" />
      Deep Orange, Track Color Blue:
      <q-linear-progress indeterminate class="q-mb-lg" color="deep-orange" track-color="blue" />
      Purple 5, Track Color Red:
      <q-linear-progress indeterminate class="q-mb-lg" color="purple-5" track-color="red" />
      Rounded:
      <q-linear-progress indeterminate rounded class="q-mb-lg" />
      Reverse:
      <q-linear-progress indeterminate reverse class="q-mb-lg" />
      <q-card class="bg-grey-10 text-white q-pa-sm">
        Dark:
        <q-linear-progress indeterminate class="q-mb-lg" dark />
      </q-card>
    </div>
  </div>
</template>
