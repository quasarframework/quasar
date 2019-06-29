<template lang="pug">
  q-page.flex.flex-center(padding)
    q-btn(
      icon="code"
      label="Source code"
      no-caps
      outline
      color="primary"
      type="a"
      :href="sourceLink"
      target="_blank"
    )
</template>

<script>
export default {
  name: 'LayoutGalleryPage',

  created () {
    this.sourceLink = this.$route.meta.sourceLink
  }
}
</script>
