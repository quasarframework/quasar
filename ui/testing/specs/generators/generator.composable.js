import { readAstJson, getImportStatement } from '../astParser.js'
import { testIndent } from '../specs.utils.js'

import { createVariableTest, createClassTest } from './generator.generic.js'

const identifiers = {
  variables: {
    categoryId: '[Variables]',
    testIdToken: 'variable',
    getTestId: name => `[(variable)${ name }]`,
    createTestFn: createVariableTest
  },

  classes: {
    categoryId: '[Classes]',
    testIdToken: 'class',
    getTestId: name => `[(class)${ name }]`,
    createTestFn: createClassTest
  },

  functions: {
    categoryId: '[Functions]',
    testIdToken: 'function',
    getTestId: name => `[(function)${ name }]`,
    createTestFn: createFunctionTest
  }
}

const useRE = /use[A-Z]/
const withComponentHostRE = /import \{.+(on[A-Za-z]+|getCurrentInstance|inject|provide).+\} from 'vue'/

function getFnTests (jsonEntry, json) {
  /**
   * Update getFileHeader if you change the following "if"
   */
  if (
    // we need a host component for the composables
    json.componentHost === true
    // and this is a composable function
    && useRE.test(jsonEntry.accessor)
  ) {
    const lint = jsonEntry.params
      ? `// eslint-disable-next-line no-undef\n${ testIndent }      `
      : ''

    return `test.todo('can be used in a Vue Component', () => {
        const wrapper = mount(
          defineComponent({
            template: '<div />',
            setup () {
              ${ lint }const result = ${ jsonEntry.accessor }(${ jsonEntry.params })
              return { result }
            }
          })
        )

        // TODO: test the outcome
        expect(wrapper).toBeDefined() // this is here for lint only
      })`
  }

  const lint = jsonEntry.params
    ? `// eslint-disable-next-line no-undef\n${ testIndent }`
    : ''

  return `test.todo('has correct return value', () => {
        ${ lint }const result = ${ jsonEntry.accessor }(${ jsonEntry.params })
        expect(result).toBeDefined()
      })`
}

function createFunctionTest ({ testId, jsonEntry, json }) {
  return `
    describe('${ testId }', () => {
      ${ getFnTests(jsonEntry, json) }
    })\n`
}

export default {
  identifiers,
  getJson: ctx => ({
    ...readAstJson(ctx),
    componentHost: withComponentHostRE.test(ctx.targetContent)
  }),
  getFileHeader: ({ ctx, json }) => {
    /**
     * Update getFnTest if you change the following:
     */
    const needsMount = (
      json.componentHost === true
      && json.functions !== void 0
      && Object.keys(json.functions).some(
        key => useRE.test(json.functions[ key ].accessor)
      )
    )

    const acc = [
      'import { describe, test, expect } from \'vitest\''
    ]

    if (needsMount === true) {
      acc.push(
        'import { mount } from \'@vue/test-utils\'',
        'import { defineComponent } from \'vue\''
      )
    }

    acc.push(
      '',
      getImportStatement({ ctx, json })
    )

    return acc.join('\n')
  }
}
