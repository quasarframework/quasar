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

    process.env.CLIENT && onMounted(() => {
      /**
       * On dev, even if we fetch() the file from node_modules it passes it through
       * sass itself -> and since all .sass files are prepended with this exact file
       * it goes into an infinite loop.
       *
       * So, we avoid all that by using a raw import with import.meta.glob:
       */
      const rawVariables = import.meta.glob('./../../../../node_modules/quasar/src/css/variables.sass', { assert: { type: 'raw' } })
      file.value = rawVariables[ './../../../../node_modules/quasar/src/css/variables.sass' ]
      ready.value = true
    })

    return { file, ready }
  }
}
</script>
