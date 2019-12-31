<template lang="pug">
q-card(flat bordered)
  div(v-if="errorMessage") {{ errorMessage }}
  q-tabs.text-primary(v-model="currentPackage" align="left")
    q-tab(v-for="(packageReleases, packageName) in releases" :label="packageName" :name="packageName" :key="packageName")
  q-separator
  q-tab-panels.packages-container(v-model="currentPackage" animated)
    q-tab-panel.q-pa-none(v-for="(packageReleases, packageName) in releases" :key="packageName" :name="packageName")
      package-releases(:version="initialVersion[packageName]" :releases="packageReleases")
</template>

<script>
import PackageReleases from './PackageReleases'
import { date } from 'quasar'
const { extractDate } = date

export default {
  name: 'QuasarReleases',

  components: {
    PackageReleases
  },

  data () {
    return {
      loading: false,
      errorMessage: '',
      releases: {
        quasar: [],
        '@quasar/app': [],
        '@quasar/cli': [],
        '@quasar/extras': []
      },
      currentPackage: 'quasar',
      initialVersion: {},
      search: {}
    }
  },

  mounted () {
    this.queryReleases()
  },

  methods: {
    queryReleases (page = null) {
      const latestVersions = {}
      this.loading = true
      page = page || 1
      const self = this,
        xhr = new XMLHttpRequest()

      xhr.addEventListener('load', function () {
        const releases = JSON.parse(this.responseText)
        self.errorMessage = null

        if (releases.length === 0) {
          this.loading = false
        }

        let stopQuery = false

        self.errorMessage = null
        for (const release of releases) {
          if (release.name.indexOf('babel-preset-app') > -1) {
            continue
          }

          const vIndex = release.name.indexOf('-v'),
            packageName = [ 'v1.0.0', 'v1.0.0-beta.5' ].includes(release.name)
              ? 'quasar'
              : release.name.substring(0, vIndex),
            version = release.name.substring(vIndex + 2)

          if (version.startsWith('0')) {
            stopQuery = true
            continue
          }

          if (self.releases[packageName] === void 0) {
            self.releases[packageName] = []
          }

          const releaseInfo = {
            body: release.body,
            prerelease: release.prerelease,
            url: release.html_url,
            createdAt: release.created_at,
            formattedCreatedAt: extractDate(release.created_at, 'YYYY-MM-DD').toLocaleDateString(),
            key: `${packageName}v${version}`,
            version
          }
          self.releases[packageName].push(releaseInfo)

          if (latestVersions[packageName] === void 0) {
            latestVersions[packageName] = releaseInfo.key
          }
        }

        if (!stopQuery) {
          self.queryReleases(page + 1)
        }
        self.initialVersion = Object.assign(latestVersions, self.initialVersion)
        self.$forceUpdate()
      })

      xhr.addEventListener('error', () => {
        this.loading = false
        this.errorMessage = 'Cannot connect to GitHub. Please try again later.'
      })

      xhr.open('GET', `https://api.github.com/repos/quasarframework/quasar/releases?page=${page}`)
      xhr.send()
    }
  }
}
</script>

<style lang="sass">
.packages-container .q-tab-panel
  padding-right: 0
  padding-top: 0
</style>
