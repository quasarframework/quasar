<template>
  <h3>Only Custom Component with Aliased Imports</h3>

  <div>
    <custom-component />
  </div>
</template>

<script setup>
import { QBtn as Bibi, Notify } from "quasar";
import CustomComponent from './custom-component.js';

console.log(Bibi);
console.log('Notify', Notify);
</script>
