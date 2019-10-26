<template lang="pug">
  .row.items-stretch.q-col-gutter-lg
    .col-12.col-sm-6.row.items-stretch(v-for="(t, index) in tutorials", :key="index")
      tutorial-link(v-bind="t")
  </div>
</template>

<script>
import TutorialLink from './TutorialLink.vue'
import tutorials from './tutorials.js'

export default {
  name: 'TutorialListing',

  components: {
    TutorialLink
  },

  created () {
    this.tutorials = tutorials
  }
}
</script>
