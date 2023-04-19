<template>
  <div class="q-pa-md" style="max-width: 400px">
    <div class="q-gutter-x-xs q-gutter-y-lg">
      <q-btn color="purple" label="Button" v-for="n in 10" :key="n" />
    </div>
  </div>
</template>
