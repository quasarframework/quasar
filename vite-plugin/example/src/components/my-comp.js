import { h } from "vue";
import { QBtn as Mimi } from "quasar";

export default {
  setup() {
    return () => h(Mimi, { label: "Click me" });
  },
};
