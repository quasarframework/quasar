<template>
  <div class="q-pa-md">
    <div class="q-col-gutter-md row items-start">
      <div class="col-4">
        Ratio: 16/9
        <q-img
          src="https://picsum.photos/500/300"
          :ratio="16/9"
        />
      </div>

      <div class="col-4">
        Ratio: 1
        <q-img
          src="https://picsum.photos/500/300"
          :ratio="1"
        />
      </div>

      <div class="col-4">
        Ratio: 4/3
        <q-img
          src="https://picsum.photos/500/300"
          :ratio="4/3"
        />
      </div>
    </div>
  </div>
</template>
