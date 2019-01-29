<template>
  <div class="q-pa-md">
    <div
      style="width: 200px; height: 70px;"
      class="bg-secondary text-white rounded-borders non-selectable row flex-center"
    >
      One second delay
      <q-tooltip :delay="1000" :offset="[0, 10]">Quasar Rulz!</q-tooltip>
    </div>
  </div>
</template>
