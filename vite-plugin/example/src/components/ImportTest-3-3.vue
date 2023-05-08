<template>
  <div>
    <my-comp />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { QBtn } from "quasar";
import MyComp from "./my-comp.js";

console.log(QBtn);
export default defineComponent({
  name: "IndexPage",
  components: {
    MyComp
  }
});
</script>
