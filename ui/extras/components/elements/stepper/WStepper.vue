<template lang="pug">
  q-stepper(v-bind="$props" ref="stepper__" :flat="flat" v-bubble.input :class="{ 'hide-header-navigation': hideHeaderNavigation }")
    template(v-slot)
      slot
    template(v-slot:message)
      w-linear-progress(v-if="hideHeaderNavigation" :value="progress__")
      slot(name="message")
    template(v-slot:navigation)
      slot(name="navigation")
</template>

<script>
import { QStepper } from "quasar";

export default {
  name: "WStepper",
  mixins: [ QStepper ],
  props: {
    flat: {
      type: Boolean,
      default: true,
    },
    hideHeaderNavigation: {
      type: Boolean,
      default: true,
    },
    steps: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      mounted__: false,
    };
  },
  mounted() {
    this.mounted__ = true;
  },
  methods: {
    next() {
      this.$refs.stepper__.next();
    },
    previous() {
      this.$refs.stepper__.previous();
    },
    __getPanelIndex(name) {
      return this.$refs.stepper__.__getPanelIndex(name);
    },
  },
  computed: {
    progress__() {
      return (this.value - 1) / this.panelsCount;
    },
    panelsCount() {
      return this.mounted__ ? this.$refs.stepper__.panels.length : 1;
    },
  },
};
</script>

