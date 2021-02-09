<template lang="pug">
  q-banner(inline-actions).survey-link
    q-btn(
      type="a"
      href="https://bit.ly/3cTLXsO"
      target="_blank"
      :color="color"
      :text-color="textColor"
      :icon="mdiFileDocumentEditOutline"
      label="Survey results are out!"
      no-caps
    )
</template>

<script>
import { mdiFileDocumentEditOutline } from '@quasar/extras/mdi-v5'

export default {
  name: 'SurveyLink',

  props: {
    color: String,
    textColor: String,
    alignClass: String,
    paddingClass: String
  },

  created () {
    this.mdiFileDocumentEditOutline = mdiFileDocumentEditOutline
  }
}
</script>
