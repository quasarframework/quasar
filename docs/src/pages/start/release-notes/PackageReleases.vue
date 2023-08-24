<template>
  <div>
    <q-input class="header-toolbar q-px-md" v-model="search" dense square borderless color="white" placeholder="Search..." clearable>
      <template #prepend>
        <q-icon :name="mdiMagnify" />
      </template>
    </q-input>

    <q-separator />

    <q-splitter class="release__splitter" :model-value="20" :limits="[14, 90]">
      <template #before>
        <q-scroll-area>
          <q-tabs class="header-tabs" vertical v-model="selectedVersion" active-color="brand-primary" indicator-color="brand-primary">
            <q-tab v-for="releaseInfo in filteredReleases" class="header-btn" :key="releaseInfo.version" :name="releaseInfo.version" no-caps>
              <div class="release__tab-label q-pt-xs">{{ releaseInfo.version }}</div>
              <div class="release__tab-date q-pb-xs">{{ releaseInfo.date }}</div>
            </q-tab>
          </q-tabs>
        </q-scroll-area>
      </template>

      <template #after>
        <q-tab-panels class="releases-container" v-model="selectedVersion" animated transition-prev="slide-down" transition-next="slide-up">
          <q-tab-panel class="q-pa-none" v-for="releaseInfo in filteredReleases" :key="releaseInfo.version" :name="releaseInfo.version">
            <q-scroll-area>
              <div class="release__body q-pa-md" v-html="currentReleaseBody" />
            </q-scroll-area>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { mdiMagnify } from '@quasar/extras/mdi-v6'

const props = defineProps(['releases'])

const search = ref('')
const selectedVersion = ref(getLatestVersion())

watch(
  () => props.releases,
  () => { selectedVersion.value = getLatestVersion() }
)

function getLatestVersion () {
  return props.releases[ 0 ].version
}

const filteredReleases = computed(() => {
  if (search.value) {
    const val = search.value.toLowerCase()
    return props.releases.filter(release => (
      release.version.indexOf(val) !== -1 ||
      release.body.toLowerCase().indexOf(val) !== -1
    ))
  }

  return props.releases
})

const currentReleaseBody = computed(() => {
  const { body } = props.releases.find(r => r.version === selectedVersion.value)
  return body
})
</script>

<style lang="sass">
.release__splitter .q-scrollarea
  height: 600px

.release__tab-label
  font-size: $font-size
  font-weight: 700
  line-height: ($font-size + 3px)
.release__tab-date
  font-size: ($font-size - 3px)
  line-height: ($font-size + 3px)

.release__body
  h1, h2, h3, h4, h5, h6
    padding: 0
    margin: .7em 0 .5em
    line-height: 1.1em
    color: $brand-primary
    &:first-child
      margin-top: 0
  h1
    font-size: ($font-size + 18px)
  h2
    font-size: ($font-size + 14px)
  h3
    font-size: ($font-size + 10px)
  h4
    font-size: ($font-size + 6px)
  h5
    font-size: ($font-size + 4px)
  h6
    font-size: ($font-size + 2px)

  table
    white-space: normal
    border: 1px solid $separator-color
    border-radius: $generic-border-radius
    width: 100%
    max-width: 100%
    border-collapse: separate
    border-spacing: 0
    th, td
      text-align: left
      padding: 8px 16px
    th
      font-weight: 700
      letter-spacing: $letter-spacing-brand
      border-bottom: 1px solid $separator-color
    tr:not(:first-child) td
      border-top: 1px solid $separator-color

body.body--dark .release__body
  table
    &, th, tr:not(:first-child) td
      border-color: $separator-dark-color
</style>
