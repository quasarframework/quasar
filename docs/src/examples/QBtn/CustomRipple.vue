<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn :ripple="false" color="secondary" label="No ripple" no-caps />
    <q-btn :ripple="{ color: 'yellow' }" color="secondary" label="Yellow ripple" no-caps />
    <q-btn :ripple="{ center: true }" color="secondary" label="Center ripple" no-caps />
  </div>
</template>
