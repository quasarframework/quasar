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
import { date } from 'quasar'
import PackageReleases from './PackageReleases'

const { extractDate } = date

export default {
  name: 'QuasarReleases',

  components: {
    PackageReleases
  },

  data () {
    return {
      loading: true,
      error: false,

      packages: {
        quasar: [],
        '@quasar/app': [],
        '@quasar/cli': [],
        '@quasar/extras': [],
        '@quasar/icongenie': []
      },

      currentPackage: 'quasar',
      versions: {}
    }
  },

  mounted () {
    this.queryReleases()
  },

  methods: {
    queryReleases (page = 1) {
      this.loading = true
      this.error = false

      const latestVersions = {}

      const self = this,
        xhrQuasar = new XMLHttpRequest()

      xhrQuasar.addEventListener('load', function () {
        self.loading = false
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

          if (self.packages[packageName] === void 0) {
            self.packages[packageName] = []
          }

          const releaseInfo = {
            version,
            date: extractDate(release.created_at, 'YYYY-MM-DD').toLocaleDateString(),
            body: release.body,
            label: `${packageName} v${version}`
          }
          self.packages[packageName].push(releaseInfo)

          if (latestVersions[packageName] === void 0) {
            latestVersions[packageName] = releaseInfo.label
          }
        }

        if (!stopQuery) {
          self.queryReleases(page + 1)
        }

        self.versions = Object.assign(latestVersions, self.versions)
        self.$forceUpdate()
      })

      xhrQuasar.addEventListener('error', () => {
        this.error = true
      })

      xhrQuasar.open('GET', `https://api.github.com/repos/quasarframework/quasar/releases?page=${page}&per_page=100`)
      xhrQuasar.send()
    }
  }
}
</script>

<style lang="sass">
.packages-container .q-tab-panel
  padding-right: 0
  padding-top: 0
</style>
