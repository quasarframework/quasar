import path from 'node:path'

const escapeRE = str => str.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`)

export function quasarRolldownVirtualEntry({
  inputFile,
  targetFile,
  beforeImportCode
}) {
  const importPath = path
    .relative(path.dirname(inputFile), targetFile)
    .replaceAll('\\', '/')

  const bootstrapFile = `\0quasar:virtual-entry-bootstrap:${inputFile}`

  /**
   * Static ESM imports evaluate dependencies before the importing module's
   * body, and in source order. Bootstrap code therefore gets a module of its
   * own, so that it still runs before the target while both are imported
   * statically.
   *
   * A dynamic import would give the same ordering, but it makes Rolldown defer
   * the whole target graph into async module initializers, which deadlock when
   * the app has circular imports.
   */
  const code =
    beforeImportCode === void 0
      ? `import './${importPath}'`
      : `import ${JSON.stringify(bootstrapFile)}\nimport './${importPath}'`

  // native (Rust-side) filtering: only the virtual entry and its bootstrap
  // module reach the JS handlers
  const idRE = new RegExp(
    `^(${escapeRE(inputFile)}|${escapeRE(bootstrapFile)})$`
  )

  return {
    name: 'quasar:virtual-entry',

    resolveId: {
      filter: { id: idRE },

      handler(source) {
        return source === inputFile || source === bootstrapFile ? source : null
      }
    },

    load: {
      filter: { id: idRE },

      handler(id) {
        if (id === inputFile) return code
        if (id === bootstrapFile) {
          return { code: beforeImportCode, moduleSideEffects: 'no-treeshake' }
        }
        return null
      }
    }
  }
}
