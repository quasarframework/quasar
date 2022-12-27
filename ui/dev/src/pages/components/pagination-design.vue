<template>
  <div class="column flex-center q-pa-xl">
    <div class="column q-gutter-md">
      <q-pagination
        v-model="currentPage"
        max="5"
      />

      <q-pagination
        v-model="currentPage"
        outline
        text-color="black"
        active-text-color="red"
        gutter="10px"
        max="5"
      />

      <q-pagination
        v-model="currentPage"
        max="5"
        active-text-color="red"
        boundary-links
        direction-links
      />

      <q-pagination
        v-model="currentPage"
        max="5"
        active-design="outline"
        active-text-color="red"
        boundary-links
        direction-links
      />

      <q-pagination
        v-model="currentPage"
        max="5"
        color="orange"
        active-design="push"
        boundary-links
        direction-links
      />

      <q-pagination
        v-model="currentPage"
        max="5"
        color="orange"
        active-design="push"
        active-color="dark"
        boundary-links
        direction-links
      />

      <q-pagination
        v-model="currentPage"
        max="5"
        push
        active-design="unelevated"
        active-color="dark"
        boundary-links
        direction-links
      />

      <q-pagination
        v-model="currentPage"
        max="5"
        outline
        active-design="unelevated"
        boundary-links
        direction-links
      />

      <q-pagination
        v-model="currentPage"
        max="5"
        gutter="md"
        boundary-links
        direction-links
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const currentPage = ref(3)
</script>
