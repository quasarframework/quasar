import { loadAutoImportData } from './auto-import-data.js'
import { importTransformation } from './js-transform.js'

// NodeTypes.ROOT in @vue/compiler-core
const ROOT_NODE_TYPE = 0

// mirror of toValidAssetId() from @vue/compiler-core,
// which generates the identifiers that the codegen references
function toValidAssetId(name, type) {
  return `_${type}_${name.replaceAll(/[^\w]/g, (searchValue, replaceValue) =>
    // oxlint-disable-next-line unicorn/prefer-code-point -- must match Vue's output
    searchValue === '-' ? '_' : name.charCodeAt(replaceValue).toString()
  )}`
}

/**
 * Returns a Vue template compiler nodeTransform which resolves Quasar
 * components and directives at compile time: entries are moved from the
 * transform context's components/directives registries (which would codegen
 * into runtime _resolveComponent()/_resolveDirective() calls) into its
 * imports registry, so the compiler emits direct import statements instead.
 *
 * Compared to the regex-based vueTransform() fallback, the generated code
 * is never post-processed, so source maps remain exact.
 */
export function createQuasarNodeTransform(
  autoImportComponentCase,
  useTreeshaking
) {
  const { importName } = loadAutoImportData()

  const kebabAllowed = autoImportComponentCase !== 'pascal'
  const pascalAllowed = autoImportComponentCase !== 'kebab'

  const getComponentName = tag => {
    const name = importName[tag]
    if (name === void 0) return void 0
    // pascal case tags are identical to their import name, the rest are kebab
    return (tag === name ? pascalAllowed : kebabAllowed) ? name : void 0
  }

  return (node, context) => {
    if (node.type !== ROOT_NODE_TYPE) return

    // exit transforms run innermost-first, so by the time this one is
    // called every element has been fully transformed and the context
    // registries are complete (they are copied onto the root node only
    // after all transforms have run)
    return () => {
      // while in dev mode (no treeshaking), the "quasar" package is aliased
      // to its dev bundle, so all names get accumulated into a SINGLE
      // "import { ... } from 'quasar'" statement (one specifier resolution
      // for Vite's import analysis instead of one per name); when
      // treeshaking, each name imports its own per-file path instead
      const devSpecifierList = []

      const registerImport = (name, assetId) => {
        if (useTreeshaking) {
          context.imports.push({
            exp: assetId,
            path: importTransformation(name)
          })
        } else {
          devSpecifierList.push(`${name} as ${assetId}`)
        }
      }

      for (const tag of context.components) {
        // let self-referencing components resolve at runtime
        if (tag.endsWith('__self')) continue

        const name = getComponentName(tag)
        if (name === void 0) continue

        context.components.delete(tag)
        registerImport(name, toValidAssetId(tag, 'component'))
      }

      for (const dir of context.directives) {
        const name = importName['v-' + dir]
        if (name === void 0) continue

        context.directives.delete(dir)
        registerImport(name, toValidAssetId(dir, 'directive'))
      }

      if (devSpecifierList.length !== 0) {
        context.imports.push({
          exp: `{ ${devSpecifierList.join(', ')} }`,
          path: 'quasar'
        })
      }
    }
  }
}
