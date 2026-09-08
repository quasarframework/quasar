<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-date
        v-model="date"
        calendar="persian"
        :locale="langFa.date"
        today-btn
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import langFa from 'quasar/lang/fa-IR'

const date = ref('1397/08/12')
</script>
