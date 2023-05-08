<template>
  <div>
    <q-btn label="Click me" />
    <q-icon name="map" />
    <my-comp />
  </div>
</template>

<script setup>
import { QBtn } from "quasar";
import MyComp from "./my-comp.js";
console.log(QBtn);
</script>
