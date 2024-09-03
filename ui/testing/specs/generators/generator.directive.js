import readAssociatedJsonFile from '../readAssociatedJsonFile.js'
import {
  testIndent,
  kebabCase,
  getTestValue
} from '../specs.utils.js'

const identifiers = {
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
    testIdToken: 'modifier',
    getTestId: name => `[(modifier)${ name }]`,
    createTestFn: createModifierTest
  }
}

function createValueTest ({
  categoryId,
  jsonEntry,
  ctx
}) {
  const typeList = Array.isArray(jsonEntry.type)
    ? jsonEntry.type
    : [ jsonEntry.type ]

  const valIndent = `${ testIndent }    `
  const testList = typeList.map(type => {
    const val = getTestValue({
      jsonEntry: { ...jsonEntry, type },
      indent: valIndent
    })
    const valExists = val !== 'undefined'

    return `test.todo('as ${ type }', () => {
      const TestComponent = defineComponent({
        template: '<div v-${ kebabCase(ctx.camelCaseName) }${ valExists ? '="val"' : '' } />',
        directives: { ${ ctx.camelCaseName } }${ valExists ? `,
        setup () {
          return {
            val: ${ val }
          }
        }` : '' }
      })

      const wrapper = mount(TestComponent)

      // TODO: test the effect of the value
      expect(wrapper).toBeDefined() // this is here for linting only
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
    test.todo('has effect', () => {
      const TestComponent = defineComponent({
        template: '<div v-${ kebabCase(ctx.camelCaseName) }:...... />',
        directives: { ${ ctx.camelCaseName } }
      })

      const wrapper = mount(TestComponent)

      // TODO: test the effect of the arg
      expect(wrapper).toBeDefined() // this is here for linting only
    })
  })\n`
}

function createModifierTest ({
  name,
  testId,
  jsonEntry,
  ctx
}) {
  const val = jsonEntry.type === 'Boolean'
    ? name
    // example: TouchRepeat > modifiers > [keycode]
    : getTestValue({ jsonEntry, indent: testIndent })

  return `
    describe('${ testId }', () => {
      test.todo('has effect', () => {
        const TestComponent = defineComponent({
          template: '<div v-${ kebabCase(ctx.camelCaseName) }.${ val } />',
          directives: { ${ ctx.camelCaseName } }
        })

        const wrapper = mount(TestComponent)

        // TODO: test the effect of the value
        expect(wrapper).toBeDefined() // this is here for linting only
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
      'import { defineComponent } from \'vue\'',
      '',
      `import ${ ctx.camelCaseName } from './${ ctx.localName }'`
    ].join('\n')
  },
  getGenericTest: ({ ctx }) => {
    return `
  describe('[Generic]', () => {
    test('should not throw error on render', () => {
      const TestComponent = defineComponent({
        template: '<div v-${ kebabCase(ctx.camelCaseName) } />',
        directives: { ${ ctx.camelCaseName } }
      })

      const wrapper = mount(TestComponent)

      expect(wrapper).toBeDefined() // this is here for linting only
    })
  })\n`
  }
}
