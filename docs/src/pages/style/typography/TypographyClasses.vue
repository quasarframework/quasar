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
        { name: 'text-right', description: 'Align text to the right' },
        { name: 'text-left', description: 'Align text to the left' },
        { name: 'text-center', description: 'Align text to the center' },
        { name: 'text-justify', description: 'Text will be justified' },
        { name: 'text-bold', description: 'Text will be in bold' },
        { name: 'text-italic', description: 'Text will be in italic' },
        { name: 'text-no-wrap', description: 'Non wrappable text (applies `white-space: nowrap`)' },
        { name: 'text-strike', description: 'pplies `text-decoration: line-through` ' },
        { name: 'text-uppercase', description: 'Transform text to uppercase' },
        { name: 'text-lowercase', description: 'Transform text to lowercase' },
        { name: 'text-capitalize', description: 'Capitalize first letter of the text' }
      ]
    }
  }
}
</script>
