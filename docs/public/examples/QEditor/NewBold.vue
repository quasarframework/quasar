<template>
  <div class="q-pa-md q-gutter-sm">
    <q-editor
      v-model="editor"
      :definitions="{
        bold: {label: 'Bold', icon: null, tip: 'My bold tooltip'}
      }"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      editor: ref('Here we are overriding the <b>bold</b> command to include a label instead of an icon and also changing its tooltip.')
    }
  }
}
</script>
