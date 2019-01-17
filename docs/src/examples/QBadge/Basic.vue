<template>
  <div class="q-pa-md q-gutter-sm">
    <div>
      This blue:
      <q-badge color="blue">
        #4D96F2
      </q-badge>
    </div>
    <div>
      Not blue:
      <q-badge color="orange" text-color="black">
        2
      </q-badge>
    </div>
    <div>
      Also not blue:
      <q-badge color="green-3" text-color="purple-12">
        orange
      </q-badge>
    </div>
    <div>
      Technically blue:
      <q-badge color="blue">
        <q-icon name="fab fa-bluetooth-b" color="white" />
      </q-badge>
    </div>
  </div>
</template>
