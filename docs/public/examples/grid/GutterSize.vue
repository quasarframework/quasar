<template>
  <div class="q-pa-md" style="max-width: 500px">
    <p>q-gutter-xs</p>
    <div class="q-gutter-xs">
      <q-btn color="brown" label="Button" v-for="n in 7" :key="`xs-${n}`" />
    </div>

    <p class="q-mt-md">q-gutter-sm</p>
    <div class="q-gutter-sm">
      <q-btn color="teal" label="Button" v-for="n in 7" :key="`sm-${n}`" />
    </div>

    <p class="q-mt-md">q-gutter-md</p>
    <div class="q-gutter-md">
      <q-btn color="accent" label="Button" v-for="n in 7" :key="`md-${n}`" />
    </div>

    <p class="q-mt-md">q-gutter-lg</p>
    <div class="q-gutter-lg">
      <q-btn color="red" label="Button" v-for="n in 7" :key="`lg-${n}`" />
    </div>

    <p class="q-mt-md">q-gutter-xl</p>
    <div class="q-gutter-xl">
      <q-btn color="indigo" label="Button" v-for="n in 7" :key="`xl-${n}`" />
    </div>
  </div>
</template>
