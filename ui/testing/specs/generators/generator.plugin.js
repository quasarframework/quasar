import readAssociatedJsonFile from '../readAssociatedJsonFile.js'

const identifiers = {}

export default {
  identifiers,
  getJson: readAssociatedJsonFile,
  getFileHeader: ({ ctx }) => {
    return [
      'import { describe, test, expect } from \'vitest\'',
      '',
      `import ${ ctx.pascalName } from './${ ctx.localName }'`
    ].join('\n')
  }
}
