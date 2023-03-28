<template>
  <q-card flat bordered>
    <q-card-section class="row no-wrap items-center" v-if="error">
      <q-icon class="q-mr-md" name="warning" size="24px" color="negative" />
      <div>Cannot fetch the release notes. Please use the links above instead.</div>
    </q-card-section>

    <q-card-section class="row no-wrap items-center" v-else-if="loading">
      <q-spinner class="q-mr-md" size="24px" color="brand-primary" />
      <div>Loading release notes...</div>
    </q-card-section>

    <template v-else>
      <q-tabs class="header-tabs" v-model="currentPackage" no-caps align="left" active-color="brand-primary" indicator-color="brand-primary">
        <q-tab v-for="packageName in packageList" class="header-btn" :name="packageName" :key="packageName">
          {{ packageName }}
        </q-tab>
      </q-tabs>

      <q-separator />

      <q-tab-panels class="packages-container" v-model="currentPackage" animated>
        <q-tab-panel class="q-pa-none" v-for="(packageReleases, packageName) in packages" :key="packageName" :name="packageName">
          <package-releases :releases="packageReleases" />
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { date } from 'quasar'

import PackageReleases from './PackageReleases.vue'

const { extractDate } = date

const loading = ref(true)
const error = ref(false)

const currentPackage = ref('quasar')
const packages = ref({})
const packageList = ref([])

function queryReleases () {
  fetch('https://cdn.quasar.dev/release-notes/v2.json')
    .then(response => response.json())
    .then(data => {
      const list = Object.keys(data)

      for (const packageName of list) {
        const target = data[ packageName ]
        target.forEach(entry => {
          entry.date = extractDate(entry.date, 'YYYY-MM-DD').toLocaleDateString()
        })
      }

      packages.value = data
      packageList.value = list

      loading.value = false
    })
    .catch(err => {
      console.error(err) // eslint-disable-line
      error.value = true
    })
}

onMounted(() => { queryReleases() })
</script>

<style lang="sass">
</style>
