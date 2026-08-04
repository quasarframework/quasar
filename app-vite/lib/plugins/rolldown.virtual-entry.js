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

  // native (Rust-side) filtering: only the virtual entry itself
  // reaches the JS handlers
  const inputFileRE = new RegExp(
    `^${inputFile.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`)}$`
  )

  return {
    name: 'quasar:virtual-entry',

    resolveId: {
      filter: { id: inputFileRE },

      handler(source) {
        return source === inputFile ? inputFile : null
      }
    },

    load: {
      filter: { id: inputFileRE },

      handler(id) {
        return id === inputFile ? code : null
      }
    }
  }
}
