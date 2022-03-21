<template>
  <div class="q-pa-md">
    <div class="q-gutter-md" style="max-width: 300px">
      <q-responsive :ratio="16/9">
        <div class="rounded-borders bg-primary text-white flex flex-center">
          Ratio 16:9
        </div>
      </q-responsive>

      <q-responsive :ratio="1">
        <div class="rounded-borders bg-primary text-white flex flex-center">
          Ratio 1:1
        </div>
      </q-responsive>
    </div>
  </div>
</template>
