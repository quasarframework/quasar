const { Octokit } = require('@octokit/core')

const md = require('./md')

const gitFetch = new Octokit({ auth: process.env.TOKEN })
const versionMatchRE = /([\w/\-@]+)[- ]v([\d.\-\w]+)/
const ghLinkRE = /#([\d]+)/g

module.exports = async (packages, versionRE) => {
  const packageNameList = Object.keys(packages)

  async function query (page) {
    const request = `GET /repos/quasarframework/quasar/releases?per_page=100&page=${page}`
    console.log(' Requesting:', request)

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
        body: md.render(release.body)
          .replace(ghLinkRE, '<a href="https://github.com/quasarframework/quasar/issues/$1" class="doc-link" target="_blank">#$1</a>')
      }

      packages[ packageName ].push(releaseInfo)
    }

    if (!stopQuery) {
      await query(page + 1)
    }
  }

  await query(1)

  return packages
}
