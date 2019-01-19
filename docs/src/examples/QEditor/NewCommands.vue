<template>
  <div class="q-pa-md q-gutter-sm">
    <q-editor
      v-model="editor"
      :definitions="{
        save: {
          tip: 'Save your work',
          icon: 'save',
          label: 'Save',
          handler: saveWork
        },
        upload: {
          tip: 'Upload to cloud',
          icon: 'cloud_upload',
          label: 'Upload',
          handler: uploadIt
        }
      }"
      :toolbar="[
        ['bold', 'italic', 'strike', 'underline'],
        ['upload', 'save']
      ]"
    />
  </div>
</template>
<script>
export default {
  data () {
    return {
      editor: 'After you define a new button,' +
        ' you have to make sure to put it in the toolbar too!'
    }
  },
  methods: {
    saveWork () {
      this.$q.notify({
        message: 'Saved your text to local storage',
        color: 'green-4',
        textColor: 'white',
        icon: 'fas fa-check-circle'
      })
    },
    uploadIt () {
      this.$q.notify({
        message: 'Server unavailable. Check connectivity',
        color: 'red-5',
        textColor: 'white',
        icon: 'fas fa-exclamation-triangle'
      })
    }
  }
}
</script>
