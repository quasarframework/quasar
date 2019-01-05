<template lang="pug">
q-page(padding)
  p Bash
  code-markup(lang="bash")
    | $ quasar dev -m ssr
    | # some comment
    | $ quasar build
</template>

<script>
import CodeMarkup from 'components/CodeMarkup.vue'

export default {
  name: 'Components',
  meta: {
    title: 'Components'
  },
  components: {
    CodeMarkup
  }
}
</script>
