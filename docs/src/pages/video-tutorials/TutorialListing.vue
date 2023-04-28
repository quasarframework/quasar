<template>
<div class="row items-stretch q-col-gutter-lg">
  <div class="col-12 col-sm-6 row items-stretch" v-for="(t, index) in tutorials" :key="index">
    <tutorial-link v-bind="t" />
  </div>
</div>
</template>

<script setup>
import TutorialLink from './TutorialLink.vue'
import quasarV1Tutorials from 'assets/tutorials-quasar-v1.js'
import quasarV2Tutorials from 'assets/tutorials-quasar-v2.js'
import vueTutorials from 'assets/tutorials-vue.js'

const props = defineProps({
  which: String
})

const listing = {
  'quasar-v2': quasarV2Tutorials,
  'quasar-v1': quasarV1Tutorials,
  vue: vueTutorials
}

const tutorials = listing[ props.which ]
</script>
