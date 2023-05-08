<template>
  <div>
    <my-comp />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { QBtn as Bibi } from "quasar";
import MyComp from "./my-comp.js";

console.log(Bibi);
export default defineComponent({
  name: "IndexPage",
  components: {
    MyComp
  }
});
</script>
