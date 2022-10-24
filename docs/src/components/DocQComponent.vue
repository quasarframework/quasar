<template lang="pug">
q-card.doc-component(:dark="dark")
  .row
    q-linear-progress(v-if="loadingComponent" :dark="dark" indeterminate)
    component(v-if="!loadingComponent" :is="component" :dark="dark")
</template>

<script>
import { markRaw, onMounted, ref } from 'vue'

const importQComponent = process.env.CLIENT
  ? import.meta.glob('/public/quasar-components/**/*.vue')
  : null

export default {
  name: 'DocQComponent',

  props: {
    file: String,
    dark: Boolean
  },

  setup (props) {
    const component = ref(null)
    const loadingComponent = ref(true)

    process.env.CLIENT && onMounted(() => {
      importQComponent[ `/public/quasar-components/${props.file}.vue` ]()
        .then(comp => {
          component.value = markRaw(comp.default)
          loadingComponent.value = false
        })
    })

    return {
      component,
      loadingComponent
    }
  }
}
</script>
