<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-date v-model="date" calendar="persian" :locale="locale" today-btn />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Not needed if the Lang is already set to it;
// Importing here just for the demonstration purposes
import langFa from 'quasar/lang/fa-IR'

// Again, for demonstration purposes only:
// the digits formatter is a root-level key of the language pack,
// so the ad-hoc locale has to carry it along with the date strings
const locale = {
  ...langFa.date,
  formatNumber: langFa.formatNumber
}

const date = ref('1397/08/12')
</script>
