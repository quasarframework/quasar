<template>
  <div class="q-pa-md">
    <div class="row items-start q-gutter-md">
      <q-responsive :ratio="16/9" class="col">
        <div class="rounded-borders bg-primary text-white flex flex-center">
          Ratio 16:9
        </div>
      </q-responsive>

      <q-responsive :ratio="1" class="col">
        <div class="rounded-borders bg-primary text-white flex flex-center">
          Ratio 1:1
        </div>
      </q-responsive>
    </div>
  </div>
</template>
