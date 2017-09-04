<template>
  <div class="layout-padding">
    <q-editor
      v-model="model"
      :toolbar="[
        ['bold', 'italic', 'underline', 'strike', 'h1', 'paragraph'],
        ['subscript', 'superscript'],
        ['quote', 'bullet', 'number', 'outdent', 'indent'],
        [['paragraph', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']], ['hr', 'removeFormat'],
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
