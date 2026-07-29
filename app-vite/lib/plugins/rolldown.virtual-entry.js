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

  return {
    name: 'quasar:virtual-entry',

    resolveId(source) {
      return source === inputFile ? inputFile : null
    },

    load(id) {
      return id === inputFile ? code : null
    }
  }
}
