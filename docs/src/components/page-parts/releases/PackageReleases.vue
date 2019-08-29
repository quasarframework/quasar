<template lang="pug">
q-splitter.release__splitter(:value="20")
  template(#before)
    q-scroll-area
      q-input(v-model="search" dense square standout="bg-primary text-white" placeholder="Search...")
      q-tabs.text-primary(vertical v-model="selectedVersion")
        q-tab(v-for="releaseInfo in filteredReleases" :key="releaseInfo.key" :label="releaseInfo.version" :name="releaseInfo.key")
  template(#after)
    q-tab-panels.releases-container(v-model="selectedVersion" animated)
      q-tab-panel(v-for="releaseInfo in filteredReleases" :key="releaseInfo.key" :name="releaseInfo.key")
        q-scroll-area
          .release__body(v-html="currentReleaseBody")
</template>

<script>
import sanitize from './sanitize'
export default {
  data () {
    return {
      search: '',
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
  computed: {
    filteredReleases () {
      return this.search
        ? this.releases.filter(release => release.body.toLowerCase().includes(this.search))
        : this.releases
    },
    currentReleaseBody () {
      return this.parse(this.releases.find(r => r.key === this.selectedVersion).body)
    }
  },
  methods: {
    parse (body) {
      let content = sanitize(body) + '\n'
      if (this.search) {
        content = content.replace(new RegExp(`(${this.search})`, 'ig'), `<span class="bg-accent text-white">$1</span>`)
      }
      content = content.replace(/#### ([\S ]+)/g, '<h4>$1</h4>')
        .replace(/### ([\S ]+)/g, '<h3>$1</h3>')
        .replace(/## ([\S ]+)/g, '<h2>$1</h2>')
        .replace(/# ([\S ]+)g/, '<h1>$1</h1>')
        .replace(/\*\*([\S ]+)\*\*/g, '<b>$1</b>')
        .replace(/\* ([\S ]+)\n/g, '<li>$1</li>')
      return content
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
  & h2
    font-size 3rem
    margin 0
  & h3
    font-size 2.5rem
    margin 0
</style>
