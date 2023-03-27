<template>
  <div class="q-ma-md">
    <q-scroll-area
      dark
      class="bg-grey-9 text-white rounded-borders"
      style="height: 200px; max-width: 300px;"
    >
      <div v-for="n in 100" :key="n" class="q-py-sm q-px-md">
        Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.
      </div>
    </q-scroll-area>
  </div>
</template>
