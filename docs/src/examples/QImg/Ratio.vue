<template>
  <div class="q-pa-md">
    <div class="q-col-gutter-md row items-start">
      <div class="col-4">
        Ratio: 16/9
        <q-img
          src="https://placeimg.com/500/300/nature"
          :ratio="16/9"
        />
      </div>

      <div class="col-4">
        Ratio: 1
        <q-img
          src="https://placeimg.com/500/300/nature"
          :ratio="1"
        />
      </div>

      <div class="col-4">
        Ratio: 4/3
        <q-img
          src="https://placeimg.com/500/300/nature"
          :ratio="4/3"
        />
      </div>
    </div>
  </div>
</template>
