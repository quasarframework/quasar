<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row">

      <q-btn color="primary" label="Flip">
        <q-tooltip
          transition-show="flip-right"
          transition-hide="flip-left"
        >
          Here I am!
        </q-tooltip>
      </q-btn>

      <q-btn color="primary" label="Scale Menu">
        <q-tooltip
          transition-show="scale"
          transition-hide="scale"
        >
          Here I am!
        </q-tooltip>
      </q-btn>

      <q-btn color="primary" label="Rotate">
        <q-tooltip
          transition-show="rotate"
          transition-hide="rotate"
        >
          Here I am!
        </q-tooltip>
      </q-btn>

    </div>
  </div>
</template>
