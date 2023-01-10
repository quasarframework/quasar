const { Octokit } = require('@octokit/core')

const md = require('./md')

const gitFetch = new Octokit({ auth: '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' })
const versionMatchRE = /([\w/\-@]+)[- ]v([\d.\-\w]+)/

module.exports = async (packages, versionRE) => {
  const packageNameList = Object.keys(packages)
  const latestVersions = {}

  async function query (page) {
    const request = `GET /repos/quasarframework/quasar/releases?per_page=100&page=${page}`
    console.log('Requesting:', request)

    const response = await gitFetch.request(request)
    const releases = response.data

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

      if (!version) {
        stopQuery = true
        continue
      }

      if (packageName === '@quasar/app') {
        packageName = '@quasar/app-webpack'
      }
      else if (packageNameList.includes(packageName) === false) {
        continue
      }

      if (versionRE[ packageName ] !== void 0 && versionRE[ packageName ].test(version) === false) {
        continue
      }

      if (packages[ packageName ] === void 0) {
        packages[ packageName ] = []
      }

      const releaseInfo = {
        version,
        date: release.created_at,
        body: md.render(release.body),
        label: `${packageName} v${version}`
      }

      packages[ packageName ].push(releaseInfo)

      if (latestVersions[ packageName ] === void 0) {
        latestVersions[ packageName ] = `v${version}`
      }
    }

    if (!stopQuery) {
      await query(page + 1)
    }
  }

  await query(1)

  return {
    packages,
    latestVersions
  }
}
