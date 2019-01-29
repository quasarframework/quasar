<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-btn color="primary">
        Hover
        <q-tooltip content-class="bg-indigo" :offset="[10, 10]">
          Here I am!
        </q-tooltip>
      </q-btn>

      <q-btn color="primary">
        Over
        <q-tooltip content-class="bg-red" :offset="[10, 10]">
          Here I am!
        </q-tooltip>
      </q-btn>

      <q-btn color="primary">
        These
        <q-tooltip content-class="bg-purple" content-style="font-size: 16px" :offset="[10, 10]">
          Here I am!
        </q-tooltip>
      </q-btn>

      <q-btn color="primary">
        Buttons
        <q-tooltip content-class="bg-amber text-black shadow-4" :offset="[10, 10]">
          Here I am!
        </q-tooltip>
      </q-btn>
    </div>
  </div>
</template>
