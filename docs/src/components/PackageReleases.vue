<template lang="pug">
q-splitter.release__splitter(:value="20")
  template(#before)
    q-scroll-area
      q-tabs.text-primary(vertical v-model="selectedVersion")
        q-tab(v-for="releaseInfo in releases" :key="releaseInfo.key" :label="releaseInfo.version" :name="releaseInfo.key")
  template(#after)
    q-tab-panels.releases-container(v-model="selectedVersion" animated)
      q-tab-panel(v-for="releaseInfo in releases" :key="releaseInfo.key" :name="releaseInfo.key")
        q-scroll-area
          .release__body(v-html="releaseInfo.body")
</template>

<script>
export default {
  data () {
    return {
      selectedVersion: null
    }
  },
  props: {
    version: String,
    releases: {
      type: Array,
      required: true
    }
  },
  watch: {
    version: {
      immediate: true,
      handler (value) {
        this.selectedVersion = value
      }
    }
  }
}
</script>

<style lang="stylus">
.release__splitter .q-scrollarea
  height 600px
.release__body
  white-space pre-line
  margin-top 16px
  & h2, & h3
    font-size 3rem
    padding-left 20px
</style>
