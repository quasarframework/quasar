import path from 'node:path'
import { pathToFileURL } from 'node:url'
import fse from 'fs-extra'

const dirnameReplacement = '__quasar_inject_dirname__'
const filenameReplacement = '__quasar_inject_filename__'
const importMetaUrlReplacement = '__quasar_inject_import_meta_url__'

export const quasarEsbuildInjectReplacementsDefine = {
  __dirname: dirnameReplacement,
  __filename: filenameReplacement,
  'import.meta.url': importMetaUrlReplacement
}

export const quasarEsbuildInjectReplacementsPlugin = {
  name: 'quasar:inject-replacements',
  setup (build) {
    build.onLoad({ filter: /\.[cm]?[jt]s$/ }, args => {
      const contents = fse.readFileSync(args.path, 'utf8')

      const prefix = `const ${ dirnameReplacement } = ${ JSON.stringify(path.dirname(args.path)) };`
        + `const ${ filenameReplacement } = ${ JSON.stringify(args.path) };`
        + `const ${ importMetaUrlReplacement } = ${ JSON.stringify(pathToFileURL(args.path).href) };`

      return {
        loader: args.path.endsWith('ts') ? 'ts' : 'js',
        contents: prefix + contents
      }
    })
  }
}
