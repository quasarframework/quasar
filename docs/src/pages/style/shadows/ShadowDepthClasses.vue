<template>
<div>
    <DocTable :rows="classes" />
  </div>
</template>

<script>
import DocTable from 'src/components/DocTable.vue'

export default {
  components: {
    DocTable
  },
  data () {
    return {
      classes: [
        { name: 'shadow-up-1', description: 'Set a depth of 1' },
        { name: 'shadow-up-2', description: 'Set a depth of 2' },
        { name: 'shadow-up-N', description: 'Where `N` is an integer from 1 to 24.' }
      ]
    }
  }
}
</script>
