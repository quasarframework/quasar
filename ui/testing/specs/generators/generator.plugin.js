// if (json.injection) { // Quasar plugin only
//   has.content = true
//   output += `  describe.todo('Plugin injection', () => {\n`
//   output += `    test('(injection): ${ json.injection }', () => {\n`
//   output += `      //\n`
//   output += `    })\n`
//   output += `  })\n`
// }

const identifiers = {}

export default {
  identifiers,
  getJson: ctx => ctx.json,
  getFileHeader: ({ ctx }) => {
    return [
      'import { mount } from \'@vue/test-utils\'',
      'import { describe, test, expect } from \'vitest\'',
      '',
      `import ${ ctx.pascalName } from './${ ctx.localName }'`
    ].join('\n')
  }
}
