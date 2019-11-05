<template lang="pug">
  .row.items-stretch.q-col-gutter-lg
    .col-12.col-sm-6.row.items-stretch(v-for="(t, index) in tutorials", :key="index")
      tutorial-link(v-bind="t")
</template>

<script>
import TutorialLink from './TutorialLink.vue'
import quasarTutorials from './quasar-tutorials.js'
import vueTutorials from './vue-tutorials.js'

export default {
  name: 'TutorialListing',

  props: {
    which: String
  },

  components: {
    TutorialLink
  },

  created () {
    this.tutorials = this.which === 'quasar'
      ? quasarTutorials
      : vueTutorials
  }
}
</script>
