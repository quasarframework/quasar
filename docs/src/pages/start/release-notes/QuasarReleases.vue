<template>
  <q-card flat bordered>
    <q-card-section class="row no-wrap items-center" v-if="error">
      <q-icon class="q-mr-sm" name="warning" size="24px" color="negative" />
      <div>Cannot connect to GitHub. Please try again later.</div>
    </q-card-section>

    <q-card-section class="row no-wrap items-center" v-else-if="loading">
      <q-spinner class="q-mr-sm" size="24px" color="brand-primary" />
      <div>Loading release notes from GitHub...</div>
    </q-card-section>

    <template v-else>
      <q-tabs class="text-grey-7" v-model="currentPackage" no-caps align="left" active-color="brand-primary" indicator-color="brand-primary">
        <q-tab v-for="(_, packageName) in packages" :label="packageName" :name="packageName" :key="packageName" />
      </q-tabs>

      <q-separator />

      <q-tab-panels class="packages-container" v-model="currentPackage" animated>
        <q-tab-panel class="q-pa-none" v-for="(packageReleases, packageName) in packages" :key="packageName" :name="packageName">
          <package-releases :latest-version="versions[packageName]" :releases="packageReleases" />
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

const versionRE = {
  quasar: /^2./,
  '@quasar/app-webpack': /^3./,
  '@quasar/app-vite': /^1./
}

const versionMatchRE = /([\w/\-@]+)[- ]v([\d.\-\w]+)/

const packagesDefinitions = {
  quasar: [],
  '@quasar/app-vite': [],
  '@quasar/app-webpack': [],
  '@quasar/cli': [],
  '@quasar/extras': [],
  '@quasar/icongenie': [],
  '@quasar/vite-plugin': []
}
const packageNameList = Object.keys(packagesDefinitions)
const loading = ref(false)
const error = ref(false)
const packages = ref(packagesDefinitions)
const currentPackage = ref('quasar')
const versions = ref({})

function queryReleases (page = 1) {
  loading.value = true
  error.value = false

  const latestVersions = {}
  const xhrQuasar = new XMLHttpRequest()

  xhrQuasar.addEventListener('load', function () {
    loading.value = false
    const releases = JSON.parse(this.responseText)

    if (releases.length === 0) {
      return
    }

    let stopQuery = false

    for (const release of releases) {
      const matchesList = release.name.split(' ')[ 0 ].match(versionMatchRE)

      if (!matchesList || matchesList.length < 2) {
        continue
      }

      let [ , packageName, version ] = matchesList

      if (packageName === '@quasar/app') {
        packageName = '@quasar/app-webpack'
      }
      else if (packageNameList.includes(packageName) === false) {
        continue
      }

      if (!version) {
        stopQuery = true
        continue
      }

      if (versionRE[ packageName ] !== void 0 && versionRE[ packageName ].test(version) === false) {
        continue
      }

      if (packages.value[ packageName ] === void 0) {
        packages.value[ packageName ] = []
      }

      const releaseInfo = {
        version,
        date: extractDate(release.created_at, 'YYYY-MM-DD').toLocaleDateString(),
        body: release.body,
        label: `${packageName} v${version}`
      }
      packages.value[ packageName ].push(releaseInfo)

      if (latestVersions[ packageName ] === void 0) {
        latestVersions[ packageName ] = releaseInfo.label
      }
    }

    if (!stopQuery) {
      queryReleases(page + 1)
    }

    versions.value = Object.assign(latestVersions, versions.value)
  })

  xhrQuasar.addEventListener('error', () => {
    error.value = true
  })

  xhrQuasar.open('GET', `https://api.github.com/repos/quasarframework/quasar/releases?page=${page}&per_page=100`)
  xhrQuasar.send()
}

onMounted(() => { queryReleases() })
</script>

<style lang="sass">
.packages-container .q-tab-panel
  padding-right: 0
  padding-top: 0
</style>
