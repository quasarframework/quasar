<template lang="pug">
q-splitter.release__splitter(:value="20" :limits="[14, 90]")
  template(#before)
    q-scroll-area
      q-input(v-model="search" dense square standout="bg-primary text-white" placeholder="Highlight..." input-class="text-center" clearable)
      q-tabs.text-primary(vertical v-model="selectedVersion")
        q-tab(v-for="releaseInfo in filteredReleases" :key="releaseInfo.key" :name="releaseInfo.key")
          .q-tab__label {{ releaseInfo.version }}
          small.text-grey-7 {{ releaseInfo.formattedCreatedAt }}
  template(#after)
    q-tab-panels.releases-container(v-model="selectedVersion" animated transition-prev="slide-down" transition-next="slide-up")
      q-tab-panel.q-pa-none(v-for="releaseInfo in filteredReleases" :key="releaseInfo.key" :name="releaseInfo.key")
        q-scroll-area
          .release__body.q-pa-md(v-html="currentReleaseBody")
</template>

<script>
import sanitize from './sanitize'
import parseMdTable from './md-table-parser'

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

      content = content
        .replace(/### ([\S ]+)/g, '<div class="text-h6">$1</div>')
        .replace(/## ([\S ]+)/g, '<div class="text-h5">$1</div>')
        .replace(/# ([\S ]+)g/, '<div class="text-h4">$1</div>')
        .replace(/\*\*([\S ]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\* ([\S ]+)\n/g, '<li>$1</li>')
        .replace(/\*([\S ]+)\*/g, '<em>$1</em>')
        .replace(/```([\S]+)/g, '<code class="doc-code__inner doc-code__inner--prerendered release__code">')
        .replace(/```\n/g, '</code>')
        .replace(/`([\S ]+)`/g, '<code class="doc-token">$1</code>')
        .replace(/#([\d]+)/g, '<a class="doc-link" href="https://github.com/quasarframework/quasar/issues/$1" target="_blank">#$1</a>')
        .replace(/^&gt; ([\S ]+)\n/g, '<div class="release__blockquote">$1</div>')
        .replace(/\[([\S ]+)\]\((\S+)\)/g, '<a class="doc-link" href="$2" target="_blank">$1</a>')

      return content.indexOf('| -') > -1
        ? parseMdTable(content)
        : content
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

<style lang="sass">
.release__splitter .q-scrollarea
  height: 600px
.release__body
  white-space: pre-line
  .q-markup-table
    white-space: normal
.release__blockquote
  background: rgba($primary, .05)
  border: 1px solid $primary
  padding: 4px 8px
  border-radius: $generic-border-radius
.release__code
  padding: 4px
  margin: 8px
</style>
