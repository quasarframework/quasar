<template lang="pug">
  q-dialog(ref="dialog" @hide="onDialogHide")
    q-card
      q-card-section
        q-tabs(v-model="tab")
          q-tab(v-for="example in docsMeta.examples" :key="example.example" :name="example.example" :label="example.title")
        q-tab-panels(v-model="tab" animated)
          q-tab-panel(v-for="example in docsMeta.examples" :key="example.example" :name="example.example")
            div
              span {{ example.description }}
              doc-example(:file="example.example")
</template>

<script>

export default {
  name: 'DocExamplesDialog',
  props: {
    docsMeta: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      tab: this.docsMeta.examples[0].example
    }
  },

  methods: {
    show () {
      this.$refs.dialog.show()
    },

    hide () {
      this.$refs.dialog.hide()
    },

    onDialogHide () {
      this.$emit('hide')
    }
  }
}
</script>
