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
