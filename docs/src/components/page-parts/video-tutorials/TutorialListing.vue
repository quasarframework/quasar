<template lang="pug">
.row.items-stretch.q-col-gutter-lg
  .col-12.col-sm-6.row.items-stretch(v-for="(t, index) in tutorials", :key="index")
    tutorial-link(v-bind="t")
</template>

<script>
import TutorialLink from './TutorialLink.vue'
import quasarV1Tutorials from './quasar-v1-tutorials.js'
import quasarV2Tutorials from './quasar-v2-tutorials.js'
import vueTutorials from './vue-tutorials.js'

export default {
  name: 'TutorialListing',

  props: {
    which: String
  },

  components: {
    TutorialLink
  },

  setup (props) {
    const tutorials = {
      'quasar-v2': quasarV2Tutorials,
      'quasar-v1': quasarV1Tutorials,
      vue: vueTutorials
    }
    return {
      tutorials: tutorials[ props.which ]
    }
  }
}
</script>
