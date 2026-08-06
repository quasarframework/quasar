import path from 'node:path'

export function quasarRolldownVirtualEntry({
  inputFile,
  targetFile,
  beforeImportCode
}) {
  const importPath = path
    .relative(path.dirname(inputFile), targetFile)
    .replaceAll('\\', '/')

  /**
   * Static ESM imports evaluate dependencies before the importing module's
   * body. Use a dynamic import when bootstrap code must run before the target,
   * while preserving the existing static import for all other entries.
   */
  const code =
    beforeImportCode === void 0
      ? `import './${importPath}'`
      : `${beforeImportCode}\n\nawait import('./${importPath}')`

  /**
   * Rolldown evaluates native id filters against the forward-slash-normalized
   * module id while matching the pattern verbatim (rolldown repo:
   * crates/rolldown_utils/src/filter_expression.rs), yet the JS handlers
   * receive the raw OS-native id. So the filter regex must accept both
   * separator forms and the handlers must compare against both, otherwise
   * Windows never matches (#18504).
   */
  const posixInputFile = inputFile.replaceAll('\\', '/')
  const isInputFile = id =>
    id === inputFile || id.replaceAll('\\', '/') === posixInputFile

  // native (Rust-side) filtering: only the virtual entry itself
  // reaches the JS handlers
  const inputFileRE = new RegExp(
    `^${posixInputFile
      .split('/')
      .map(segment =>
        segment.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`)
      )
      .join(String.raw`[\\/]`)}$`
  )

  return {
    name: 'quasar:virtual-entry',

    resolveId: {
      filter: { id: inputFileRE },

      handler(source) {
        return isInputFile(source) ? inputFile : null
      }
    },

    load: {
      filter: { id: inputFileRE },

      handler(id) {
        return isInputFile(id) ? code : null
      }
    }
  }
}
