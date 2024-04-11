/**
 * !!!
 *  Also update /ui/build/build.api.js if
 *  JSON root props change
 * !!!
 */

import readAssociatedJsonFile from '../readAssociatedJsonFile.js'
import {
  testIndent,
  capitalize,
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
    getTestId: name => `[(prop)${ name }]`,
    createTestFn: createPropTest
  },

  slots: {
    categoryId: '[Slots]',
    getTestId: name => `[(slot)${ name }]`,
    createTestFn: createSlotTest,
    shouldIgnoreEntry: ({ name }) => (
      name === '...' // example: QBtnToggle
      || name[ 0 ] === '[' // example: QEditor
    )
  },

  events: {
    categoryId: '[Events]',
    getTestId: name => `[(event)${ name }]`,
    createTestFn: createEventTest
  },

  methods: {
    categoryId: '[Methods]',
    getTestId: name => `[(method)${ name }]`,
    createTestFn: createMethodTest
  },

  computedProps: {
    categoryId: '[Computed props]',
    getTestId: name => `[(computedProp)${ name }]`,
    createTestFn: createComputedPropTest
  }
}

const quoteRE = /'/g

function getRequiredPropTest ({ mountCall }) {
  return ({ testStrPrefix, val }) => `\n
      test.todo('${ testStrPrefix } has effect', () => {
        const propVal = ${ val }
        ${ mountCall }

        // TODO: test the effect of the prop
        expect(wrapper).toBeDefined() // this is here for linting only
      })`
}

function getNonRequiredPropTest ({ mountCall, pascalName, jsonEntry }) {
  const assignmentCall = getComponentPropAssignment({
    pascalName,
    jsonEntry,
    indent: testIndent
  })

  return ({ testStrPrefix, val }) => `\n
      test.todo('${ testStrPrefix } has effect', async () => {
        ${ mountCall }

        // TODO: write expectations without the prop

        const propVal = ${ val }
        ${ assignmentCall }

        // TODO: test the effect of the prop
      })`
}

function getPropTest ({ name, pascalName, jsonEntry, json, ctx }) {
  const type = filterDefExceptionTypes(jsonEntry.type)
  if (type === void 0) return ''

  const mountCall = getComponentMount({
    ctx,
    json,
    prop: jsonEntry.required === true ? name : null,
    indent: testIndent
  })

  const getPropTestFn = jsonEntry.required === true
    ? getRequiredPropTest({ mountCall })
    : getNonRequiredPropTest({ mountCall, pascalName, jsonEntry })

  // example: QTable > props > selection
  if (jsonEntry.values !== void 0) {
    return jsonEntry.values.map(val => getPropTestFn({
      testStrPrefix: `value ${ val.replace(quoteRE, '"') }`,
      val
    })).join('')
  }

  const typeList = Array.isArray(type)
    ? type // example: QTable > props > virtual-scroll-slice-size
    : [ type ]

  return typeList.map(t => {
    const val = getTestValue({
      jsonEntry: { ...jsonEntry, type: t },
      indent: testIndent
    })

    return getPropTestFn({
      testStrPrefix: `type ${ t }`,
      val
    })
  }).join('')
}

function createPropTest ({
  name,
  pascalName,
  testId,
  jsonEntry,
  json,
  ctx
}) {
  const definedSuffix = jsonEntry.passthrough === true
    ? 'toBeUndefined() // passthrough prop'
    : 'toBeDefined()'

  const propTest = getPropTest({ name, pascalName, jsonEntry, json, ctx })

  return `
    describe('${ testId }', () => {
      test('is defined correctly', () => {
        expect(${ ctx.pascalName }.props.${ pascalName }).${ definedSuffix }
      })${ propTest }
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
  pascalName,
  testId,
  jsonEntry,
  json,
  ctx
}) {
  const [ emitAccessor, propsAccessor ] = pascalName.indexOf(':') === -1
    ? [ `.${ pascalName }`, `.on${ capitalize(pascalName) }` ]
    // example: 'update:modelValue'
    : [ `[ '${ pascalName }' ]`, `.[ 'on${ capitalize(pascalName) }' ]` ]

  const varName = `eventList${ emitAccessor }`
  const paramsTest = jsonEntry.params !== void 0
    ? getEventParamsTest(jsonEntry, `${ varName }[ 0 ]`)
    : `expect(${ varName }[ 0 ]).toHaveLength(0)`

  const [ isDefinedBitwiseOperator, isDefinedSuffix ] = jsonEntry.passthrough === true
    ? [ '&', 'toBe(0) // passthrough event' ]
    : [ '^', 'toBe(1)' ]

  const mountCall = getComponentMount({
    ctx,
    json,
    indent: testIndent
  })

  return `
    describe('${ testId }', () => {
      test('is defined correctly', () => {
        expect(
          ${ ctx.pascalName }.emits?.includes('${ pascalName }')
          ${ isDefinedBitwiseOperator } (${ ctx.pascalName }.props?${ propsAccessor } !== void 0)
        ).${ isDefinedSuffix }
      })

      test.todo('is emitting', () => {
        ${ mountCall }

        // TODO: trigger the event

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('${ pascalName }')
        expect(${ varName }).toHaveLength(1)

        ${ paramsTest }
      })
    })\n`
}

function createMethodTest ({
  pascalName,
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
    ref: `wrapper.vm.${ pascalName }`,
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
  pascalName,
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
    ref: `wrapper.vm.${ pascalName }`,
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
      `import ${ ctx.pascalName } from './${ ctx.localName }'`
    ].join('\n')
  },
  getGenericTest: ({ ctx }) => {
    return `
  describe('[Generic]', () => {
    test('should not throw error on render', () => {
      const wrapper = mount(${ ctx.pascalName })

      expect(
        wrapper.get('div')
      ).toBeDefined()
    })
  })\n`
  }
}
