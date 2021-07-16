<template lang="pug">
q-card(flat bordered)
  q-card-section.row.no-wrap.items-center(v-if="error")
    q-icon.q-mr-sm(name="warning" size="24px" color="negative")
    div Cannot connect to GitHub. Please try again later.
  q-card-section.row.no-wrap.items-center(v-else-if="loading")
    q-spinner.q-mr-sm(size="24px" color="brand-primary")
    div Loading release notes from GitHub...
  template(v-else)
    q-tabs.text-grey-7(v-model="currentPackage" align="left" active-color="brand-primary" active-bg-color="blue-1" indicator-color="brand-primary")
      q-tab(v-for="(packageReleases, packageName) in packages" :label="packageName" :name="packageName" :key="packageName")
    q-separator
    q-tab-panels.packages-container(v-model="currentPackage" animated)
      q-tab-panel.q-pa-none(v-for="(packageReleases, packageName) in packages" :key="packageName" :name="packageName")
        package-releases(:latest-version="versions[packageName]" :releases="packageReleases")
</template>

<script>
import { ref, onMounted } from 'vue'
import { date } from 'quasar'

import PackageReleases from './PackageReleases'

const { extractDate } = date

export default {
  name: 'QuasarReleases',

  components: {
    PackageReleases
  },

  setup () {
    const packagesDefinitions = {
      quasar: [],
      '@quasar/app': [],
      '@quasar/cli': [],
      '@quasar/extras': [],
      '@quasar/icongenie': []
    }
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
          if (release.name.indexOf('babel-preset-app') > -1) {
            continue
          }

          const [ packageName, version ] = release.name.split('-v')

          if (!version) {
            stopQuery = true
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

    return {
      loading,
      error,
      packages,
      currentPackage,
      versions
    }
  }
}
</script>

<style lang="sass">
.packages-container .q-tab-panel
  padding-right: 0
  padding-top: 0
</style>
