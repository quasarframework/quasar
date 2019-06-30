<template lang="pug">
  q-page.flex.flex-center(padding)
    q-btn(
      icon="code"
      label="Source code"
      no-caps
      push
      color="white"
      text-color="primary"
      type="a"
      :href="sourceLink"
      target="_blank"
    )
</template>

<script>
export default {
  name: 'LayoutGalleryPage',

  meta () {
    return {
      title: this.$route.meta.title + ' Layout | Quasar Framework'
    }
  },

  created () {
    this.sourceLink = this.$route.meta.sourceLink
  }
}
</script>
