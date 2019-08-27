<template>
  <div>
    <q-tabs v-model="currentPackage" class="text-primary">
      <q-tab v-for="(packageReleases, packageName) in releases" :label="packageName"
        :name="packageName" :key="packageName" />
    </q-tabs>

    <!-- packages -->
    <q-tab-panels v-model="currentPackage" animated class="packages-container">
      <q-tab-panel v-for="(packageReleases, packageName) in releases"
        :key="packageName" :name="packageName">

        <!-- versions -->
        <q-splitter :value="15" class="release__splitter">
          <template #before>
            <q-scroll-area>
              <q-input v-model="search[packageName]" dense square standout="bg-primary text-white" placeholder="Search..." />
              <q-tabs vertical v-model="currentVersion[packageName]" class="text-primary">
                <q-tab v-for="releaseInfo in packageReleases"
                  :key="releaseInfo.key" :label="releaseInfo.version" :name="releaseInfo.key" />
              </q-tabs>
            </q-scroll-area>
          </template>
          <template #after>
            <q-tab-panels v-model="currentVersion[packageName]" animated class="releases-container">
              <q-tab-panel v-for="releaseInfo in releases[packageName]"
                :key="releaseInfo.key" :name="releaseInfo.key">
                <div class="release__body" v-html="parseMd(releaseInfo.body)"></div>
              </q-tab-panel>
            </q-tab-panels>
          </template>
        </q-splitter>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import markdownIt from 'markdown-it'
const md = markdownIt({ html: true })

export default {
  name: 'QuasarReleases',
  data () {
    return {
      loading: false,
      releases: {
        quasar: [],
        '@quasar/app': [],
        '@quasar/cli': [],
        '@quasar/extras': []
      },
      currentPackage: 'quasar',
      currentVersion: {},
      search: {}
    }
  },
  mounted () {
    this.queryReleases()
  },
  methods: {
    parseMd (text) {
      return md.render(text)
    },
    queryReleases (page = null) {
      const latestVersions = {}
      this.loading = true
      page = page || 1
      const self = this,
        xhr = new XMLHttpRequest()

      xhr.addEventListener('load', function () {
        const releases = JSON.parse(this.responseText)

        if (releases.length === 0) {
          this.loading = false
        }

        let stopQuery = false

        self.errorMessage = null
        for (const release of releases) {
          const vIndex = release.name.indexOf('-v'),
            packageName = release.name === 'v1.0.0' ? 'quasar' : release.name.substring(0, vIndex),
            version = release.name.substring(vIndex + 2)

          if (version.startsWith('0')) {
            stopQuery = true
          }

          if (self.releases[packageName] === void 0) {
            self.releases[packageName] = []
          }

          const releaseInfo = {
            body: release.body,
            prerelease: release.prerelease,
            url: release.html_url,
            createdAt: release.created_at,
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

        self.currentVersion = Object.assign(latestVersions, self.currentVersion)
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

<style lang="stylus">
.release__body h3
  font-size 1.5rem
.release__splitter
  max-height 600px
  & .q-scrollarea
    height 600px
.packages-container .q-tab-panel
  padding 0
.releases-container .q-tab-panel
  padding 16px
</style>
