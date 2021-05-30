<template lang="pug">
q-splitter.release__splitter(:value="20" :limits="[14, 90]")
  template(#before)
    q-scroll-area
      q-input(v-model="search" dense square standout color="white" placeholder="Search..." input-class="text-center" clearable)
        template(#append)
          q-icon(:name="mdiMagnify")
      q-tabs.text-grey-7(vertical v-model="selectedVersion"  active-color="brand-primary" active-bg-color="blue-1" indicator-color="brand-primary")
        q-tab(v-for="releaseInfo in filteredReleases" :key="releaseInfo.label" :name="releaseInfo.label")
          .q-tab__label {{ releaseInfo.version }}
          small.text-grey-7 {{ releaseInfo.date }}
  template(#after)
    q-tab-panels.releases-container(v-model="selectedVersion" animated transition-prev="slide-down" transition-next="slide-up")
      q-tab-panel.q-pa-none(v-for="releaseInfo in filteredReleases" :key="releaseInfo.label" :name="releaseInfo.label")
        q-scroll-area
          .release__body.q-pa-md(v-html="currentReleaseBody")
</template>

<script>
import sanitize from './sanitize'
import parseMdTable from './md-table-parser'

import { mdiMagnify } from '@quasar/extras/mdi-v5'

export default {
  created () {
    this.mdiMagnify = mdiMagnify
  },

  props: [ 'latestVersion', 'releases' ],

  data () {
    return {
      search: '',
      selectedVersion: null
    }
  },

  watch: {
    latestVersion: {
      immediate: true,
      handler (value) {
        this.selectedVersion = value
      }
    }
  },

  computed: {
    filteredReleases () {
      if (this.search) {
        const search = this.search.toLowerCase()
        return this.releases.filter(
          release => release.body.toLowerCase().indexOf(search) > -1
        )
      }

      return this.releases
    },

    currentReleaseBody () {
      const release = this.releases.find(r => r.label === this.selectedVersion)
      return release
        ? this.parse(release.body)
        : ''
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
        .replace(/# ([\S ]+)/g, '<div class="text-h4">$1</div>')
        .replace(/\*\*([\S ]*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([\S ]*?)\*/g, '<em>$1</em>')
        .replace(/```([\S]+)/g, '<code class="doc-code__inner doc-code__inner--prerendered release__code">')
        .replace(/```\n/g, '</code>')
        .replace(/`(.*?)`/g, '<code class="doc-token">$1</code>')
        .replace(/#([\d]+)/g, '<a class="doc-link" href="https://github.com/quasarframework/quasar/issues/$1" target="_blank">#$1</a>')
        .replace(/^&gt; ([\S ]+)$/gm, '<div class="release__blockquote">$1</div>')
        .replace(/\[([\S ]*?)\]\((\S*?)\)/g, '<a class="doc-link" href="$2" target="_blank">$1</a>')
        .replace(/^ {2}[-*] ([\S .]+)$/gm, '<li class="q-pl-md">$1</li>')
        .replace(/^[-*] ([\S .]+)$/gm, '<li>$1</li>')
        .replace(/<\/li>[\s\n\r]*<li/g, '</li><li')

      return content.indexOf('| -') > -1
        ? parseMdTable(content)
        : content
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
  background: rgba($brand-primary, .05)
  border: 1px solid $brand-primary
  padding: 4px 8px
  border-radius: $generic-border-radius
.release__code
  padding: 4px
  margin: 8px
</style>
