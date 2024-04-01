import readAssociatedJsonFile from '../readAssociatedJsonFile.js'
import {
  getDefTesting,
  testIndent,
  kebabCase
} from '../specs.utils.js'

const identifiers = {
  quasarConfOptions: {
    categoryId: '[QuasarConfOptions]',
    createTestFn: createQuasarConfOptions
  },

  value: {
    categoryId: '[Value]',
    createTestFn: createValueTest
  },

  arg: {
    categoryId: '[Argument]',
    createTestFn: createArgTest
  },

  modifiers: {
    categoryId: '[Modifiers]',
    getTestId: name => `[(modifier)${ name }]`,
    createTestFn: createModifierTest
  }
}

function createQuasarConfOptions ({ categoryId, _jsonEntry, _ctx }) {
  // TODO: implement
  return `
  describe('${ categoryId }', () => {
    test('definition', () => {
      //
    })
  })\n`
}

function createValueTest ({
  categoryId,
  jsonEntry,
  ctx
}) {
  const typeList = Array.isArray(jsonEntry.type)
    ? jsonEntry.type
    : [ jsonEntry.type ]

  const valIndent = `${ testIndent }      `
  const testList = typeList.map(type => {
    const { createValue } = getDefTesting({ ...jsonEntry, type })
    const value = createValue(valIndent)
    const exists = value !== 'undefined'

    return `test('as ${ type }', () => {
      const TestComponent = defineComponent({
        template: '<div v-${ kebabCase(ctx.pascalName) }${ exists ? '="val"' : '' }></div>',
        directives: { ${ ctx.pascalName } }${ exists ? `
        setup () {
          return {
            val: ${ value }
          }
        }` : '' }
      })

      const wrapper = mount(TestComponent)

      // TODO: test the effect of the value
    })`
  })

  return `
  describe('${ categoryId }', () => {
    ${ testList.join('\n\n    ') }
  })\n`
}

function createArgTest ({
  categoryId,
  ctx
}) {
  return `
  describe('${ categoryId }', () => {
    test('has effect', () => {
      const TestComponent = defineComponent({
        template: '<div v-${ kebabCase(ctx.pascalName) }:......></div>',
        directives: { ${ ctx.pascalName } }
      })

      const wrapper = mount(TestComponent)

      // TODO: test the effect of the arg
    })
  })\n`
}

function createModifierTest ({
  name,
  testId,
  jsonEntry,
  ctx
}) {
  const value = jsonEntry.type === 'Boolean'
    ? name
    // example: TouchRepeat > modifiers > [keycode]
    : getDefTesting(jsonEntry).createValue()

  return `
    describe('${ testId }', () => {
      test('has effect', () => {
        const TestComponent = defineComponent({
          template: '<div v-${ kebabCase(ctx.pascalName) }.${ value }></div>',
          directives: { ${ ctx.pascalName } }
        })

        const wrapper = mount(TestComponent)

        // TODO: test the effect of the value
      })
    })\n`
}

export default {
  identifiers,
  getJson: readAssociatedJsonFile,
  getFileHeader: ({ ctx }) => {
    return [
      'import { mount } from \'@vue/test-utils\'',
      'import { describe, test, expect } from \'vitest\'',
      '',
      `import ${ ctx.pascalName } from './${ ctx.localName }'`
    ].join('\n')
  }
}
