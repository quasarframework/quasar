<template>
  <div>
    <q-btn label="Click me" />
    <q-icon name="map" />
    <my-comp />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import MyComp from "./my-comp.js";

export default defineComponent({
  name: "IndexPage",
  components: {
    MyComp
  }
});
</script>
