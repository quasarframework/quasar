<template>
  <h3>Only Custom Component and Imports</h3>

  <div>
    <custom-component />
  </div>
</template>

<script setup>
import { QBtn, Notify } from "quasar";
import CustomComponent from './custom-component.js';

console.log(QBtn);
console.log('Notify', Notify);
</script>
