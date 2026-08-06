import path from 'node:path'

const toSeparatorAgnosticSource = posixId =>
  posixId
    .split('/')
    .map(segment => segment.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`))
    .join(String.raw`[\\/]`)

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
   * body, in source order. Bootstrap code therefore gets a module of its own
   * so it still runs before the target while both stay statically imported.
   *
   * A dynamic import would give the same ordering, but it makes Rolldown
   * defer the target graph into (potentially async) module initializers,
   * which can deadlock on circular imports (see PR #18505).
   */
  const code =
    beforeImportCode === void 0
      ? `import './${importPath}'`
      : `import ${JSON.stringify(bootstrapFile)}\nimport './${importPath}'`

  /**
   * Rolldown evaluates native id filters against the forward-slash-normalized
   * module id while matching the pattern verbatim (rolldown repo:
   * crates/rolldown_utils/src/filter_expression.rs), yet the JS handlers
   * receive the raw OS-native id. So the filter regex must accept both
   * separator forms and the handlers must compare against both, otherwise
   * Windows never matches (#18504).
   */
  const posixInputFile = inputFile.replaceAll('\\', '/')
  const posixBootstrapFile = bootstrapFile.replaceAll('\\', '/')

  const isInputFile = id =>
    id === inputFile || id.replaceAll('\\', '/') === posixInputFile
  const isBootstrapFile = id =>
    id === bootstrapFile || id.replaceAll('\\', '/') === posixBootstrapFile

  // native (Rust-side) filtering: only the virtual entry and its
  // bootstrap module reach the JS handlers
  const idRE = new RegExp(
    `^(?:${toSeparatorAgnosticSource(posixInputFile)}|${toSeparatorAgnosticSource(posixBootstrapFile)})$`
  )

  return {
    name: 'quasar:virtual-entry',

    resolveId: {
      filter: { id: idRE },

      handler(source) {
        if (isInputFile(source)) return inputFile
        if (isBootstrapFile(source)) return bootstrapFile
        return null
      }
    },

    load: {
      filter: { id: idRE },

      handler(id) {
        if (isInputFile(id)) return code
        if (isBootstrapFile(id)) {
          return { code: beforeImportCode, moduleSideEffects: 'no-treeshake' }
        }
        return null
      }
    }
  }
}
