<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">

      <q-btn label="Hover me" color="primary">
        <q-tooltip>
          Some text as content of Tooltip
        </q-tooltip>
      </q-btn>

      <div
        class="inline bg-amber rounded-borders cursor-pointer"
        style="max-width: 300px"
      >
        <div class="fit flex flex-center text-center non-selectable q-pa-md">
          I am groot!<br>(Hover me!)
        </div>

        <q-tooltip>
          I am groot!
        </q-tooltip>
      </div>

    </div>
  </div>
</template>
