<template>
  <div class="layout-padding">
    <q-editor
      v-model="model"
      :toolbar="[
        ['bold', 'italic', 'underline', 'strike', 'h1', 'p'],
        ['link', 'print', 'subscript', 'superscript'],
        ['quote', 'bullet', 'number', 'outdent', 'indent'],
        [['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7']],
        [['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']], ['hr', 'removeFormat'],
        ['undo', 'redo']
      ]"
    >
      <q-editor-btn push cmd="bold" />
      <q-editor-btn push cmd="bold" icon="map" toggle-color="red" />
      <q-editor-btn push cmd="bold" icon="map" label="Bold" toggle-color="yellow" />
    </q-editor>

    <p class="caption bg-yellow">Model</p>
    <span>{{ model }}</span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: ''
    }
  }
}
</script>
