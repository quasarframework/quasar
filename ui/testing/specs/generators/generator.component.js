/**
 * !!!
 *  Also update /ui/build/build.api.js if
 *  JSON root props change
 * !!!
 */

import readAssociatedJsonFile from '../readAssociatedJsonFile.js'
import {
  testIndent,
  kebabCase,
  getComponentMount,
  getComponentPropAssignment,
  filterDefExceptionTypes,
  getTypeTest,
  getTestValue,
  getFunctionCallTest
} from '../specs.utils.js'

const identifiers = {
  props: {
    categoryId: '[Props]',
    testIdToken: 'prop',
    getTestId: name => `[(prop)${ name }]`,
    createTestFn: createPropTest
  },

  slots: {
    categoryId: '[Slots]',
    testIdToken: 'slot',
    getTestId: name => `[(slot)${ name }]`,
    createTestFn: createSlotTest,
    shouldIgnoreEntry: ({ name }) => (
      name === '...' // example: QBtnToggle
      || name[ 0 ] === '[' // example: QEditor
    )
  },

  events: {
    categoryId: '[Events]',
    testIdToken: 'event',
    getTestId: name => `[(event)${ name }]`,
    createTestFn: createEventTest
  },

  methods: {
    categoryId: '[Methods]',
    testIdToken: 'method',
    getTestId: name => `[(method)${ name }]`,
    createTestFn: createMethodTest
  },

  computedProps: {
    categoryId: '[Computed props]',
    testIdToken: 'computedProp',
    getTestId: name => `[(computedProp)${ name }]`,
    createTestFn: createComputedPropTest
  }
}

const quoteRE = /'/g
const propValExceptions = [ 'true', 'false', 'null', 'undefined' ]

function getRequiredPropTest ({ mountCall }) {
  return ({ testStrPrefix, val }) => {
    const assignment = propValExceptions.includes(val)
      ? mountCall.replace(': propVal', `: ${ val }`)
      : `const propVal = ${ val }\n${ testIndent }${ mountCall }`

    return `test.todo('${ testStrPrefix } has effect', () => {
        ${ assignment }

        // TODO: test the effect of the prop
        expect(wrapper).toBeDefined() // this is here for linting only
      })`
  }
}

function getNonRequiredPropTest ({ mountCall, camelCaseName, cls, jsonEntry }) {
  const assignmentCall = getComponentPropAssignment({
    camelCaseName,
    jsonEntry,
    indent: testIndent
  })

  return ({ testStrPrefix, val }) => {
    const { preMount, assignment } = propValExceptions.includes(val)
      ? {
          preMount: '',
          assignment: assignmentCall.replace(': propVal', `: ${ val }`)
        }
      : {
          preMount: `const propVal = ${ val }\n${ testIndent }`,
          assignment: assignmentCall
        }

    return `test.todo('${ testStrPrefix } has effect', async () => {
        ${ preMount }${ mountCall }

        const target = wrapper.get('.${ cls }')

        // TODO: write expectations without the prop
        // (usually negate the effect of the prop)

        ${ assignment }

        // TODO: test the effect of the prop
        expect(target).toBeDefined() // this is here for linting only
      })`
  }
}

function getPropTest ({ name, camelCaseName, jsonEntry, json, ctx }) {
  const mountCall = getComponentMount({
    ctx,
    json,
    prop: jsonEntry.required === true ? name : null,
    indent: testIndent
  })

  const getPropTestFn = jsonEntry.required === true
    ? getRequiredPropTest({ mountCall })
    : getNonRequiredPropTest({
      mountCall,
      camelCaseName,
      cls: kebabCase(ctx.camelCaseName),
      jsonEntry
    })

  // example: QTable > props > selection
  if (jsonEntry.values !== void 0) {
    return jsonEntry.values.map(val => getPropTestFn({
      testStrPrefix: `value ${ val.replace(quoteRE, '"') }`,
      val
    })).join('\n\n      ')
  }

  const typeList = filterDefExceptionTypes(jsonEntry.type)

  return typeList.map(t => {
    const val = getTestValue({
      jsonEntry: { ...jsonEntry, type: t },
      indent: testIndent
    })

    return getPropTestFn({
      testStrPrefix: `type ${ t }`,
      val
    })
  }).join('\n\n      ')
}

function createPropTest ({
  name,
  camelCaseName,
  testId,
  jsonEntry,
  json,
  ctx
}) {
  const propTest = getPropTest({ name, camelCaseName, jsonEntry, json, ctx })

  return `
    describe('${ testId }', () => {
      ${ propTest }
    })\n`
}

function getSlotScope (jsonEntry) {
  if (jsonEntry.scope === void 0) {
    return {
      slotFn: '() => slotContent',
      scopeTests: ''
    }
  }

  const typeTest = getTypeTest({
    jsonEntry: { type: 'Object', definition: jsonEntry.scope },
    ref: 'slotScope',
    indent: testIndent
  })

  return {
    slotFn: 'scope => {\n  slotScope = scope\n  return slotContent\n}',
    scopeTests: `\n\n${ testIndent }${ typeTest }`
  }
}

function createSlotTest ({
  name,
  testId,
  jsonEntry,
  json,
  ctx
}) {
  const { slotFn, scopeTests } = getSlotScope(jsonEntry)
  const mountCall = getComponentMount({
    ctx,
    json,
    slot: { name, slotFn },
    indent: testIndent
  })

  return `
    describe('${ testId }', () => {
      test.todo('renders the content', () => {
        ${
          jsonEntry.scope !== void 0
            ? `let slotScope\n${ testIndent }`
            : ''
        }const slotContent = 'some-slot-content'
        ${ mountCall }

        expect(wrapper.html()).toContain(slotContent)${ scopeTests }
      })
    })\n`
}

function getEventParamsTest (jsonEntry, varName) {
  const params = Object.keys(jsonEntry.params).join(', ')
  const tests = Object.keys(jsonEntry.params).map(paramName => {
    const typeTest = getTypeTest({
      jsonEntry: jsonEntry.params[ paramName ],
      ref: paramName,
      indent: testIndent
    })

    return `\n${ testIndent }${ typeTest }`
  }).join('')

  return `const [ ${ params } ] = ${ varName }${ tests }`
}

function createEventTest ({
  camelCaseName,
  testId,
  jsonEntry,
  json,
  ctx
}) {
  const emitAccessor = camelCaseName.indexOf(':') === -1
    ? `.${ camelCaseName }`
    // example: 'update:modelValue'
    : `[ '${ camelCaseName }' ]`

  const varName = `eventList${ emitAccessor }`
  const paramsTest = jsonEntry.params !== void 0
    ? getEventParamsTest(jsonEntry, `${ varName }[ 0 ]`)
    : `expect(${ varName }[ 0 ]).toHaveLength(0)`

  const mountCall = getComponentMount({
    ctx,
    json,
    indent: testIndent
  })

  return `
    describe('${ testId }', () => {
      test.todo('is emitting', () => {
        ${ mountCall }

        // TODO: trigger the event

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('${ camelCaseName }')
        expect(${ varName }).toHaveLength(1)

        ${ paramsTest }
      })
    })\n`
}

function createMethodTest ({
  camelCaseName,
  testId,
  jsonEntry,
  json,
  ctx
}) {
  const mountCall = getComponentMount({
    ctx,
    json,
    indent: testIndent
  })

  const callTest = getFunctionCallTest({
    jsonEntry: { ...jsonEntry, type: 'Function' },
    ref: `wrapper.vm.${ camelCaseName }`,
    indent: testIndent
  })

  return `
    describe('${ testId }', () => {
      test.todo('should be callable', () => {
        ${ mountCall }

        ${ callTest }

        // TODO: test the effect
      })
    })\n`
}

function createComputedPropTest ({
  camelCaseName,
  testId,
  jsonEntry,
  json,
  ctx
}) {
  const mountCall = getComponentMount({
    ctx,
    json,
    indent: testIndent
  })

  const typeTest = getTypeTest({
    jsonEntry,
    ref: `wrapper.vm.${ camelCaseName }`,
    indent: testIndent
  })

  return `
    describe('${ testId }', () => {
      test.todo('should be exposed', () => {
        ${ mountCall }
        ${ typeTest }
      })
    })\n`
}

export default {
  identifiers,
  getJson: readAssociatedJsonFile,
  getFileHeader: ({ ctx, json }) => {
    const flushPromises = (
      json.props !== void 0
      && Object.keys(json.props).some(name => json.props[ name ].required !== true)
    )
      ? ', flushPromises'
      : ''

    return [
      `import { mount${ flushPromises } } from '@vue/test-utils'`,
      'import { describe, test, expect } from \'vitest\'',
      '',
      `import ${ ctx.camelCaseName } from './${ ctx.localName }'`
    ].join('\n')
  },
  getGenericTest: ({ ctx }) => {
    return `
  describe('[Generic]', () => {
    test('should not throw error on render', () => {
      const wrapper = mount(${ ctx.camelCaseName })

      expect(
        wrapper.get('div')
      ).toBeDefined()
    })
  })\n`
  }
}
