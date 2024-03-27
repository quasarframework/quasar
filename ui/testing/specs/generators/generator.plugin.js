// if (json.injection) { // Quasar plugin only
//   has.content = true
//   output += `  describe.todo('Plugin injection', () => {\n`
//   output += `    test('(injection): ${ json.injection }', () => {\n`
//   output += `      //\n`
//   output += `    })\n`
//   output += `  })\n`
// }

const categoryList = []

function generateSection (_ctx, _jsonPath) {
  return ''
}

function createTestFileContent (_ctx) {
  return ''
}

function getMissingTests (_ctx) {
  return null
}

export default {
  categoryList,

  generateSection,
  createTestFileContent,
  getMissingTests
}
