<template lang="pug">
base-directory-structure(:structure="structure")
</template>

<script>
import BaseDirectoryStructure from '../BaseDirectoryStructure.vue'
import structure from './structure'

export default {
  name: 'AppWebpackDirectoryStructure',

  components: {
    BaseDirectoryStructure
  },

  setup () {
    return {
      structure
    }
  }
}
</script>
