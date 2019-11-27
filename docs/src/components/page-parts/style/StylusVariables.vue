<template lang="pug">
q-card(v-if="ready", flat, bordered)
  doc-code(lang="markup") {{ file }}
</template>

<script>
import DocCode from '../../DocCode.vue'

export default {
  name: 'StylusVariables',

  components: {
    DocCode
  },

  data () {
    return {
      ready: false
    }
  },

  mounted () {
    import(`!raw-loader!quasar/src/css/variables.styl`).then(file => {
      this.file = file.default
      this.ready = true
    })
  }
}
</script>
