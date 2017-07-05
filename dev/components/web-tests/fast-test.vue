<template>
  <div>
    <q-btn @click="handleClick">True</q-btn>
    <q-btn @click="handleClick2">False</q-btn>
    <q-btn @click="handleClick3">0 delay</q-btn>
  </div>
</template>

<script>
  import {
    QBtn,
    debounce
  } from 'quasar'

  export default {
    methods: {
      handleClick: debounce(function () {
        console.log('tClick handled')
      }, 1000, true),
      handleClick2: debounce(function () {
        console.log('fClick handled')
      }, 1000, false),
      handleClick3: debounce(function () {
        console.log('fClick handled')
      }, 0, true)
    },

    components: {
      QBtn
    }
  }
</script>
