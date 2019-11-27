<template>
  <div class="q-pa-md">
    <q-scroll-area
      horizontal
      style="height: 210px; width: 230px;"
      class="bg-grey-1"
    >
      <div class="row no-wrap">
        <div v-for="n in 10" :key="n" style="width: 150px" class="q-pa-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto fuga quae veritatis blanditiis sequi id expedita amet esse aspernatur! Iure, doloribus!
        </div>
      </div>
    </q-scroll-area>
  </div>
</template>
