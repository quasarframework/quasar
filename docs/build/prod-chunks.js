import { join, normalize } from 'node:path'
import { globSync } from 'tinyglobby'

export const codeSplitting = {
  groups: [
    {
      test: /node_modules[\\/](vue|@vue|vue-router)[\\/](.*)\.(m?js|css|sass)$/,
      name: 'v',
      priority: 20
    },

    {
      test: /node_modules[\\/]quasar[\\/](.*)\.(m?js|css|sass)$/,
      name: 'q',
      priority: 20
    },

    {
      // oxlint-disable-next-line no-control-regex
      test: /^\0examples:runtime:/,
      name: id => `${id.slice(id.lastIndexOf(':') + 1)}.r`,
      priority: 10
    },

    {
      // oxlint-disable-next-line no-control-regex
      test: /^\0examples:source:/,
      name: id => `${id.slice(id.lastIndexOf(':') + 1)}.s`,
      priority: 10
    }
  ]
}

/**
 * We're interested in code-splitting the examples by each /src/examples/* folder.
 * We care about both compilation speed and memory usage while compiling.
 * This part could be significantly smaller, but it would not satisfy the above goals.
 *
 * Expensive operations: I/O through globSync()
 * High memory usage: generated import statements string for each .vue file (1k files x 2 statements)
 *
 * We also care about making the service worker as small as possible.
 */
export function examplesVitePlugin(isProd) {
  if (!isProd) return null

  const rootFolder = normalize(join(import.meta.dirname, '../src/examples'))
  const dirList = globSync('*', {
    cwd: rootFolder,
    onlyDirectories: true
  })
  const vueFileList = globSync('**/*.vue', { cwd: rootFolder })

  const exampleIdContentMap = dirList.reduce((acc, dir) => {
    const prefix = dir // eg. 'AppFullscreen/'
    const prefixLen = prefix.length

    // Get all .vue files that start with the current dir prefix
    const files = vueFileList.filter(file => file.startsWith(prefix))
    const exampleId = dir.slice(0, -1) // eg. 'AppFullscreen'

    /**
     * Eg. exampleIdContentMap.AppFullscreen = [ 'Basic', 'Targeted' ]
     *
     *   - exampleId: 'AppFullscreen'
     *   - files: [ 'AppFullscreen/Basic.vue', 'AppFullscreen/Targeted.vue' ]
     */
    acc[exampleId] = files.map(entry => entry.slice(prefixLen, -4))
    return acc
  }, {})

  return {
    name: 'docs:examples',

    resolveId: {
      // rust-side filter: other import specifiers never cross into JS
      filter: { id: /^examples:/ },

      handler(id) {
        if (id.startsWith('examples:')) return '\0' + id
      }
    },

    load: {
      // oxlint-disable-next-line no-control-regex
      filter: { id: /^\0examples:/ },

      handler(id) {
        if (id.startsWith('\0examples')) {
          const exampleId = id.slice(id.lastIndexOf(':') + 1)
          const importModifier = id.includes(':source:') ? '?raw' : ''

          return exampleIdContentMap[exampleId]
            .map(
              entry =>
                `export { default as ${entry} } from ` +
                `'@/examples/${exampleId}/${entry}.vue${importModifier}'`
            )
            .join('\n')
        }
      }
    }
  }
}
