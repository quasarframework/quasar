<template lang="pug">
q-splitter.release__splitter(:value="15")
  template(#before)
    q-scroll-area
      q-input(v-model="search" dense square standout="bg-primary text-white" placeholder="Search...")
      q-tabs.text-primary(vertical v-model="selectedVersion")
        q-tab(v-for="releaseInfo in filteredReleases" :key="releaseInfo.key" :label="releaseInfo.version" :name="releaseInfo.key")
  template(#after)
    q-tab-panels.releases-container(v-model="selectedVersion" animated)
      q-tab-panel(v-for="releaseInfo in filteredReleases" :key="releaseInfo.key" :name="releaseInfo.key")
        q-scroll-area
          .release__body(v-html="parseMd(releaseInfo.body)")
</template>

<script>
import markdownIt from 'markdown-it'
const md = markdownIt({ html: true })

export default {
  data () {
    return {
      search: '',
      selectedVersion: null
    }
  },
  computed: {
    filteredReleases () {
      return this.search
        ? this.releases.filter(release => release.body.toLowerCase().includes(this.search))
        : this.releases
    }
  },
  props: {
    version: String,
    releases: {
      type: Array,
      required: true
    }
  },
  methods: {
    parseMd (text) {
      if (this.search) {
        text = text.replace(new RegExp(`(${this.search})`, 'ig'), `<span class="bg-accent text-white">$1</span>`)
      }
      return md.render(text)
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
.releases-container .q-tab-panel
  padding 16px
.release__body h2, .release__body h3
  font-size 3rem
  padding-left 20px
</style>
