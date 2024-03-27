// if (/src[\\/]composables/.test(specs.dirAbsolute) === true) {
//   has.content = true
//   has.targetImport = true
//   has.expect = true
//   has.mount = true
//   has.defineComponent = true
//   output += `  test('Renders', () => {\n`
//   output += `    const TestComponent = defineComponent({\n`
//   output += `      template: '<div></div>',\n`
//   output += `      setup (props) {\n`
//   output += `        const result = ${ specs.pascalName }()\n`
//   output += `        return { result }\n`
//   output += `      }\n`
//   output += `    })\n`
//   output += `\n`
//   output += `    const wrapper = mount(TestComponent, {})\n`
//   output += `\n`
//   output += `    expect(wrapper.vm.result).toBeDefined()\n`
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
