<template>
  <div class="row items-stretch q-col-gutter-lg">
    <div
      class="col-12 col-sm-6 row items-stretch"
      v-for="(t, index) in tutorials"
      :key="index"
    >
      <tutorial-link v-bind="t" />
    </div>
  </div>
</template>

<script setup>
import TutorialLink from './TutorialLink.vue'
import listing from 'assets/tutorials.js'

const props = defineProps({ which: String })
const tutorials = listing[props.which]
</script>
