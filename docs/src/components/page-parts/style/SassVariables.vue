<template lang="pug">
q-card(v-if="ready", flat, bordered)
  doc-code(lang="markup", :code="file")
</template>

<script>
import { ref, onMounted } from 'vue'
import DocCode from '../../DocCode.vue'

export default {
  name: 'SassVariables',

  components: {
    DocCode
  },

  setup () {
    const ready = ref(false)
    const file = ref('')

    onMounted(() => {
      import('!raw-loader!quasar/src/css/variables.sass').then(content => {
        file.value = content.default
        ready.value = true
      })
    })

    return { file, ready }
  }
}
</script>
