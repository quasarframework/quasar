<template lang="pug">
div
  q-input.q-mx-md(v-model="search" dense square borderless color="white" placeholder="Search..." clearable)
    template(#prepend)
      q-icon(:name="mdiMagnify")
  q-separator
  q-splitter.release__splitter(:model-value="20" :limits="[14, 90]")
    template(#before)
      q-scroll-area
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
import { ref, computed, watch } from 'vue'
import { mdiMagnify } from '@quasar/extras/mdi-v5'

import sanitize from './sanitize'
import parseMdTable from './md-table-parser'

export default {
  props: [ 'latestVersion', 'releases' ],

  setup (props) {
    const search = ref('')
    const selectedVersion = ref(props.latestVersion)

    watch(() => props.latestVersion, val => {
      selectedVersion.value = val
    })

    const filteredReleases = computed(() => {
      if (search.value) {
        const val = search.value.toLowerCase()
        return props.releases.filter(
          release => release.body.toLowerCase().indexOf(val) > -1
        )
      }

      return props.releases
    })

    function parse (body) {
      let content = sanitize(body) + '\n'

      if (search.value) {
        content = content.replace(
          new RegExp(`(${search.value})`, 'ig'),
          '<span class="bg-accent text-white">$1</span>'
        )
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

    const currentReleaseBody = computed(() => {
      const release = props.releases.find(r => r.label === selectedVersion.value)
      return release
        ? parse(release.body)
        : ''
    })

    return {
      search,
      selectedVersion,

      filteredReleases,
      currentReleaseBody,

      mdiMagnify
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
