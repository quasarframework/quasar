// if (json.arg) { // vue directive only
//   has.content = true
//   output += `  describe.todo('Directive arg', () => {\n`
//   output += `    test('arg', () => {\n`
//   output += `      //\n`
//   output += `    })\n`
//   output += `  })\n`
// }

// if (json.value) { // vue directive only
//   has.content = true
//   output += `  describe.todo('Directive value', () => {\n`
//   output += `    test('value', () => {\n`
//   output += `      //\n`
//   output += `    })\n`
//   output += `  })\n`
// }

// if (json.modifiers) { // vue directive only
//   has.content = true
//   output += `  describe.todo('Directive modifiers', () => {\n`
//   Object.keys(json.modifiers).forEach((modifier, index) => {
//     output += `${ index !== 0 ? '\n' : '' }    test('(modifier): ${ modifier }', () => {\n`
//     output += `      //\n`
//     output += `    })\n`
//   })
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
