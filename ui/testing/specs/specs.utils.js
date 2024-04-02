export const testIndent = '        '
const pascalRegex = /((-|\.)\w)/g
const kebabRegex = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g
const ignoreKeyRE = /\.\.\./

export function pascalCase (str) {
  return str.replace(
    pascalRegex,
    text => text.replace(/-|\./, '').toUpperCase()
  )
}

export function kebabCase (str) {
  return str.replace(
    kebabRegex,
    match => '-' + match.toLowerCase()
  ).substring(1)
}

export function plural (num) {
  return num === 1 ? '' : 's'
}

function filterSpreadKey (key) {
  // example -> "...": { desc: "Any other props..." }
  return ignoreKeyRE.test(key) === false
}

const defTypeMap = {
  Number: {
    valueRegex: /^-?\d/,
    createValue: () => () => '10',
    expectType: () => ref => `expect(${ ref }).toBeTypeOf('number')`,
    runtimeValueTest: runtimeValue => (typeof runtimeValue === 'number')
  },

  String: {
    valueRegex: /^'[^']+'$/,
    createValue: () => () => '\'some-string\'',
    expectType: () => ref => `expect(${ ref }).toBeTypeOf('string')`,
    runtimeValueTest: runtimeValue => (typeof runtimeValue === 'string')
  },

  Array: {
    valueRegex: /^\[.*\]$/,
    createValue: def => {
      if (def.definition === void 0) return () => '[]'

      return (indentation = testIndent) => {
        const keyIndent = indentation + '  '
        const list = Object.keys(def.definition)
          .filter(filterSpreadKey)
          .map(key => {
            const { createValue } = getDefTesting(def.definition[ key ])
            return `\n${ keyIndent }${ key }: ${ createValue(keyIndent) }`
          })

        return `[{${ list.join(',') }\n${ indentation }}]`
      }
    },
    expectType: def => (
      def.definition === void 0
        ? ref => `expect(Array.isArray(${ ref })).toBe(true)`
        : ref => `expect(${ ref }).toContainEqual(${ getObjectEqualDef(def.definition, '') })`
    ),
    runtimeValueTest: runtimeValue => Array.isArray(runtimeValue)
  },

  Object: {
    valueRegex: /^{.*}$/,
    createValue: def => {
      if (def.definition === void 0) return () => '{}'

      return (indentation = testIndent) => {
        const keyIndent = indentation + '  '
        const list = Object.keys(def.definition)
          .filter(filterSpreadKey)
          .map(key => {
            const { createValue } = getDefTesting(def.definition[ key ])
            return `\n${ keyIndent }${ key }: ${ createValue(keyIndent) }`
          })

        return `{${ list.join(',') }\n${ indentation }}`
      }
    },
    expectType: def => (
      def.definition === void 0
        ? ref => `expect(${ ref }).toBeTypeOf('object')`
        : ref => `expect(${ ref }).toEqual(${ getObjectEqualDef(def.definition, '') })`
    ),
    runtimeValueTest: runtimeValue => (typeof runtimeValue === 'object')
  },

  Boolean: {
    valueRegex: /^(true|false)$/,
    createValue: () => () => 'true',
    expectType: () => ref => `expect(${ ref }).toBeTypeOf('boolean')`,
    runtimeValueTest: runtimeValue => (typeof runtimeValue === 'boolean')
  },

  Function: {
    valueRegex: / => /, // example: "(file) => file.name"
    createValue: def => getFunctionValue(def),
    expectType: def => (ref, opts = {}) => (
      `expect(${ ref }).toBeTypeOf('function')`
      + (
        opts.withCall === true
          ? getFunctionCallTest(def, ref, testIndent)
          : ''
      )
    ),
    runtimeValueTest: runtimeValue => (typeof runtimeValue === 'function')
  },

  RegExp: {
    valueRegex: /^\/.*\/[gimuy]*$/,
    createValue: () => () => '/.*/',
    expectType: () => ref => `expect(${ ref }).toBeInstanceOf(RegExp)`,
    runtimeValueTest: runtimeValue => (runtimeValue instanceof RegExp)
  },

  Element: {
    valueRegex: /^document\./,
    createValue: () => () => 'document.createElement(\'div\')',
    expectType: () => ref => `expect(${ ref }).toBeInstanceOf(Element)`,
    runtimeValueTest: runtimeValue => (runtimeValue instanceof Element)
  },

  Any: {
    createValue: () => () => '\'any-value\'',
    expectType: () => ref => `expect(${ ref }).not.toBeUndefined()`,
    runtimeValueTest: runtimeValue => (runtimeValue !== void 0)
  },

  Event: {
    createValue: () => () => '{}',
    expectType: () => ref => `expect(${ ref }).toBeTypeOf('object')`,
    runtimeValueTest: runtimeValue => (typeof runtimeValue === 'object')
  },

  File: {
    createValue: () => () => 'new File([], \'file.txt\')',
    expectType: () => ref => `expect(${ ref }).toBeInstanceOf(File)`,
    runtimeValueTest: runtimeValue => (runtimeValue instanceof File)
  },

  'Promise<any>': {
    createValue: () => () => 'new Promise((_resolve, _reject) => {})',
    expectType: () => ref => `expect(${ ref }).toBeInstanceOf(Promise)`,
    runtimeValueTest: runtimeValue => (runtimeValue instanceof Promise)
  },
  'Promise<void>': {
    createValue: () => () => 'new Promise((_resolve, _reject) => {})',
    expectType: () => ref => `expect(${ ref }).toBeInstanceOf(Promise)`,
    runtimeValueTest: runtimeValue => (runtimeValue instanceof Promise)
  },
  'Promise<boolean>': {
    createValue: () => () => 'new Promise((_resolve, _reject) => {})',
    expectType: () => ref => `expect(${ ref }).toBeInstanceOf(Promise)`,
    runtimeValueTest: runtimeValue => (runtimeValue instanceof Promise)
  },
  'Promise<number>': {
    createValue: () => () => 'new Promise((_resolve, _reject) => {})',
    expectType: () => ref => `expect(${ ref }).toBeInstanceOf(Promise)`,
    runtimeValueTest: runtimeValue => (runtimeValue instanceof Promise)
  },
  'Promise<string>': {
    createValue: () => () => 'new Promise((_resolve, _reject) => {})',
    expectType: () => ref => `expect(${ ref }).toBeInstanceOf(Promise)`,
    runtimeValueTest: runtimeValue => (runtimeValue instanceof Promise)
  },
  'Promise<object>': {
    createValue: () => () => 'new Promise((_resolve, _reject) => {})',
    expectType: () => ref => `expect(${ ref }).toBeInstanceOf(Promise)`,
    runtimeValueTest: runtimeValue => (runtimeValue instanceof Promise)
  },

  Error: {
    createValue: () => () => 'new Error()',
    expectType: () => ref => `expect(${ ref }).toBeInstanceOf(Error)`,
    runtimeValueTest: runtimeValue => (runtimeValue instanceof Error)
  },

  Component: {
    createValue: () => () => '{ template: \'<div></div>\', props: {}, setup () {} }',
    expectType: () => ref => `expect(${ ref }).toBeTypeOf('object')`,
    runtimeValueTest: runtimeValue => (typeof runtimeValue === 'object')
  },

  null: {
    valueRegex: /^null$/,
    createValue: () => () => 'null',
    expectType: () => ref => `expect(${ ref }).toBeNull()`,
    runtimeValueTest: runtimeValue => (runtimeValue === null)
  },

  undefined: {
    valueRegex: /^undefined$/,
    createValue: () => () => 'undefined',
    expectType: () => ref => `expect(${ ref }).toBeUndefined()`,
    runtimeValueTest: runtimeValue => (runtimeValue === void 0)
  }
}

const defTypeTestableValueKeyList = Object.keys(defTypeMap)
  .filter(key => defTypeMap[ key ].valueRegex !== void 0)

function getFunctionValue (def) {
  return (indentation = testIndent) => {
    const callParams = Object.keys(def.params || [])
      .map(paramName => `_${ paramName }`)
      .join(', ')

    if (def.returns !== void 0) {
      const { createValue } = getDefTesting(def.returns)
      return `(${ callParams }) => ${ createValue(indentation) }`
    }

    return `(${ callParams }) => {}`
  }
}

function getFunctionCallTest (def, ref, indent) {
  const paramIndent = indent + '  '
  let callParams = Object.keys(def.params || [])
    .map(paramName => {
      const { createValue } = getDefTesting(def.params[ paramName ])
      return `\n${ paramIndent }${ createValue(paramIndent) }`
    })
    .join(',')

  if (callParams.length !== 0) {
    callParams += `\n${ indent }`
  }

  if (def.returns !== void 0) {
    const { expectType } = getDefTesting(def.returns)
    return `\n${ indent }${ expectType(`${ ref }(${ callParams })`) }`
  }

  return `\n${ indent }expect(${ ref }(${ callParams })).toBeUndefined()`
}

const objectEqualDefTypeExceptions = [ 'Any', 'Component', 'FileList' ]

function getObjectEqualDefValueTest (type, target, indent) {
  if (objectEqualDefTypeExceptions.includes(type) === true) {
    return 'expect.anything()'
  }

  if (type === 'Object') {
    const definition = target.definition || target.scope
    if (definition !== void 0) {
      return Object.keys(definition).includes('...key') === true
        ? `expect.$objectWithEachKeyContaining(${ getObjectEqualDef(definition[ '...key' ].definition, indent) })`
        : `expect.objectContaining(${ getObjectEqualDef(definition, indent) })`
    }
  }

  return `expect.any(${ type })`
}

function getObjectEqualDef (definition, localIndent) {
  const list = Object.keys(definition)
    .filter(filterSpreadKey)
    .map(key => {
      const target = definition[ key ]

      const type = Array.isArray(target.type) === true
        ? target.type[ 0 ]
        : target.type

      const valueTest = getObjectEqualDefValueTest(type, target, localIndent + '  ')

      return `\n${ testIndent }${ localIndent }  ${ key }: ${ valueTest }`
    })

  return `{${ list.join(',') }\n${ testIndent }${ localIndent }}`
}

const defTypeExceptionList = [
  'FileList'
]

export function filterDefExceptionTypes (type) {
  if (Array.isArray(type) === true) {
    const list = type.filter(type => defTypeExceptionList.includes(type) === false)
    return list.length === 1
      ? list[ 0 ]
      : list
  }

  if (defTypeExceptionList.includes(type) === false) {
    return type
  }
}

export function getDefTesting (def) {
  const { type, default: defaultVal, values, examples } = def

  const valuesList = [
    ...(defaultVal !== void 0 ? [ defaultVal ] : []),
    ...(values || []),
    ...(examples || [])
    // filter example: "# hard-coded palette", "# right/left"
  ].filter(v => /^# $/.test(v) === false)

  const typeList = Array.isArray(type) === false
    ? [ type ]
    : type

  for (const typeBeingTested of typeList) {
    if (typeBeingTested === 'Any') {
      for (const typeWithRegex of defTypeTestableValueKeyList) {
        const { valueRegex, expectType } = defTypeMap[ typeWithRegex ]
        for (const val of valuesList) {
          if (valueRegex.test(val) === true) {
            return {
              type: typeWithRegex,
              createValue: () => val,
              expectType: expectType(def)
            }
          }
        }
      }

      break
    }

    const target = defTypeMap[ typeBeingTested ]
    if (target?.valueRegex === void 0) continue
    const { valueRegex, expectType } = target

    for (const val of valuesList) {
      if (valueRegex.test(val) === true) {
        return {
          type: typeBeingTested,
          createValue: () => val,
          expectType: expectType(def)
        }
      }
    }
  }

  for (const fallbackType of typeList) {
    if (defTypeExceptionList.includes(fallbackType) === true) continue
    const fallback = defTypeMap[ fallbackType ]

    if (fallback === void 0) {
      console.error('\ndef:', def)
      console.error('specs.utils: getDefTesting() -> Unknown type:', fallbackType)
      console.trace()
      process.exit(1)
    }

    return {
      type: fallbackType,
      createValue: fallback.createValue(def),
      expectType: fallback.expectType(def)
    }
  }

  console.error('\ndef:', def)
  console.error('specs.utils: getDefTesting() -> Cannot handle any of type(s):', typeList)
  console.trace()
  process.exit(1)
}

function getMountRequiredProps (jsonProps, exceptionProp) {
  const acc = []
  const propIndent = `${ testIndent }    `

  Object.keys(jsonProps || []).forEach(prop => {
    if (prop === exceptionProp) return

    const propDef = jsonProps[ prop ]

    if (propDef.required) {
      const pascalName = pascalCase(prop)
      const { createValue } = getDefTesting(propDef)

      acc.push([ pascalName, createValue(propIndent) ])

      if (propDef.sync === true) {
        acc.push([ `'onUpdate:${ pascalName }'`, '(_val) => {}' ])
      }
    }
  })

  return acc
}

function getMountSlot ({ name, slotFn }) {
  const nameAsObjKey = name.indexOf('-') === -1
    ? name
    : `'${ name }'` // example: 'navigation-icon'

  return `\n${ testIndent }  slots: {`
    + `\n${ testIndent }    ${ nameAsObjKey }: ${ slotFn }`
    + `\n${ testIndent }  }`
}

export function getComponentMount ({ ctx, json, prop = null, slot = null }) {
  const requiredProps = getMountRequiredProps(json.props, prop)

  if (prop !== null) {
    const pascalName = pascalCase(prop)
    requiredProps.push([ pascalName, 'propVal' ])
    if (json.props[ prop ].sync === true) {
      requiredProps.push([ `'onUpdate:${ pascalName }'`, 'val => { propVal = val }' ])
    }
  }

  const propList = requiredProps.map(([ prop, testVal ]) => {
    return `${ testIndent }    ${ prop }: ${ testVal }`
  })

  const slotList = slot !== null
    ? getMountSlot(slot)
    : ''

  if (propList.length === 0 && slotList === '') {
    return `const wrapper = mount(${ ctx.pascalName })`
  }

  return `const wrapper = mount(${ ctx.pascalName }, {`
    + (
      propList.length !== 0
        ? (
            `\n${ testIndent }  props: {\n`
            + propList.join(',\n')
            + `\n${ testIndent }  }`
          )
        : ''
    )
    + (propList.length !== 0 && slotList !== '' ? ',' : '')
    + slotList
    + `\n${ testIndent }})`
}

export function getExpectOneOfTypes ({ jsonEntry, ref }) {
  if (Array.isArray(jsonEntry.type) === false) {
    const { expectType } = getDefTesting(jsonEntry)
    return expectType(ref)
  }

  const typeList = jsonEntry.type.map(entry => `'${ entry }'`).join(', ')
  let acc = `expect(${ ref }).$toBeOneOfTypes([ ${ typeList } ])`

  jsonEntry.type.forEach(type => {
    if (type === 'Array') {
      if (jsonEntry.definition === void 0) return
      const expectStr = `expect(${ ref }).toContainEqual(${ getObjectEqualDef(jsonEntry.definition, '') })`
      acc += `\n\n${ testIndent }Array.isArray(${ ref }) && ${ expectStr }`
    }
    else if (type === 'Object') {
      if (jsonEntry.definition === void 0) return
      const expectStr = `expect(${ ref }).toEqual(${ getObjectEqualDef(jsonEntry.definition, '') })`
      acc += `\n\n${ testIndent }typeof ${ ref } === 'object' && ${ expectStr }`
    }
    else if (type === 'Function') {
      const localIndent = testIndent + '  '
      const expectStr = getFunctionCallTest(jsonEntry, ref, localIndent)
      acc += `\n\n${ testIndent }if (typeof ${ ref } === 'function') {${ expectStr }\n${ testIndent }}`
    }
  })

  return acc
}

/**
 * Expect matcher
 * @example: expect(target).$toBeOneOfTypes([ 'RegExp', 'String' ])
 */
export function $toBeOneOfTypes (received, typeOfList) {
  if (
    Array.isArray(typeOfList) === false
    || typeOfList.some(type => typeof type !== 'string')
  ) {
    throw new TypeError('The second argument must be an array of strings!')
  }

  const pass = typeOfList.some(type => defTypeMap[ type ]?.runtimeValueTest(received) === true)

  return {
    pass,
    message: () =>
      `expected ${ this.utils.printReceived(
        received
      ) } to${ this.isNot ? ' not' : '' } be one of types: ${ this.utils.printExpected(
        typeOfList.join(' or ')
      ) }`
  }
}

/**
 * Expect matcher (mainly for asymmetric matching)
 * @example:
 *    expect(target).toEqual(
 *      expect.$objectWithEachKeyContaining({
 *        one: expect.any(Number),
 *        // ...
 *      })
 *    )
 *
 *    expect(target).$objectWithEachKeyContaining({
 *      one: expect.any(Number),
 *      // ...
 *    })
 */
export function $objectWithEachKeyContaining (received, keyObjectMatch) {
  const pass = (
    typeof received === 'object'
    && Object.keys(received).every(key => this.equals(received[ key ], keyObjectMatch))
  )

  return {
    pass,
    message: () =>
      `expected ${ this.utils.printReceived(
        received
      ) } to${ this.isNot ? ' not' : '' }  have each key-value in the form defined by ${ this.utils.printExpected(
        keyObjectMatch
      ) }`
  }
}
