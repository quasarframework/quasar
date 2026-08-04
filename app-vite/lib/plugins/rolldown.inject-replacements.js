import path from 'node:path'
import { pathToFileURL } from 'node:url'

const dirnameReplacement = '__quasar_inject_dirname__'
const filenameReplacement = '__quasar_inject_filename__'
const importMetaUrlReplacement = '__quasar_inject_import_meta_url__'
const importMetaDirnameReplacement = '__quasar_inject_import_meta_dirname__'
const importMetaFilenameReplacement = '__quasar_inject_import_meta_filename__'

export const quasarRolldownInjectReplacementsDefine = {
  __dirname: dirnameReplacement,
  __filename: filenameReplacement,
  'import.meta.url': importMetaUrlReplacement,
  'import.meta.dirname': importMetaDirnameReplacement,
  'import.meta.filename': importMetaFilenameReplacement
}

const fileRE = /\.[cm]?[jt]s$/
const tokenRE = /__dirname|__filename|import\.meta\.(?:url|dirname|filename)/

export function quasarRolldownInjectReplacementsPlugin() {
  return {
    name: 'quasar:inject-replacements',

    transform: {
      // native (Rust-side) filtering; modules without any of the
      // tokens never cross into the JS handler
      filter: {
        id: fileRE,
        code: tokenRE
      },

      handler(code, id) {
        let prefix = ''
        let idPath
        let dirPath

        if (code.includes('__dirname')) {
          dirPath = JSON.stringify(path.dirname(id))
          prefix += `const ${dirnameReplacement} = ${dirPath};\n`
        }

        if (code.includes('__filename')) {
          idPath = JSON.stringify(id)
          prefix += `const ${filenameReplacement} = ${idPath};\n`
        }

        if (code.includes('import.meta.url')) {
          prefix += `const ${importMetaUrlReplacement} = ${JSON.stringify(pathToFileURL(id).href)};\n`
        }
        if (code.includes('import.meta.dirname')) {
          dirPath ??= JSON.stringify(path.dirname(id))
          prefix += `const ${importMetaDirnameReplacement} = ${dirPath};\n`
        }
        if (code.includes('import.meta.filename')) {
          idPath ??= JSON.stringify(id)
          prefix += `const ${importMetaFilenameReplacement} = ${idPath};\n`
        }

        return prefix ? { code: prefix + code } : null
      }
    }
  }
}
