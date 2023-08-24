<template>
  <div class="q-pa-md">
    <q-scroll-area style="height: 230px; max-width: 300px;">
      <div class="row no-wrap" v-for="r in 4" :key="'r' + r">
        <div v-for="n in 10" :key="n" style="width: 150px" class="q-pa-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto fuga quae veritatis blanditiis sequi id expedita amet esse aspernatur! Iure, doloribus!
        </div>
      </div>
    </q-scroll-area>
  </div>
</template>
