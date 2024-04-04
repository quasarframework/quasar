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

const typeMap = {
  Number: {
    valueRegex: /^-?\d/,
    createValue: () => '10',
    createExpectCall: ({ ref }) => `expect(${ ref }).toBeTypeOf('number')`,
    expectMatcher: 'expect.any(Number)'
  },

  String: {
    valueRegex: /^'[^']+'$/,
    createValue: () => '\'some-string\'',
    createExpectCall: ({ ref }) => `expect(${ ref }).toBeTypeOf('string')`,
    expectMatcher: 'expect.any(String)'
  },

  Array: {
    valueRegex: /^\[.*\]$/,
    createValue: ({ jsonEntry, indent = testIndent }) => {
      if (jsonEntry.definition === void 0) return '[]'

      const keyIndent = indent + '  '
      const list = Object.keys(jsonEntry.definition)
        .filter(filterSpreadKey)
        .map(key => {
          const val = getTestValue({
            jsonEntry: jsonEntry.definition[ key ],
            indent: keyIndent
          })

          return `\n${ keyIndent }${ key }: ${ val }`
        })

      return `[ {${ list.join(',') }\n${ indent }} ]`
    },
    createExpectCall: ({ jsonEntry, ref }) => (
      jsonEntry.definition === void 0
        ? `expect(Array.isArray(${ ref })).toBe(true)`
        : `expect(${ ref }).$arrayValues(${ getExpectMatcher(jsonEntry) })`
    ),
    expectMatcher: 'expect.any(Array)'
  },

  Object: {
    valueRegex: /^{.*}$/,
    createValue: ({ jsonEntry, indent = testIndent }) => {
      if (jsonEntry.definition === void 0) return '{}'

      const keyIndent = indent + '  '
      const list = Object.keys(jsonEntry.definition)
        .filter(filterSpreadKey)
        .map(key => {
          const val = getTestValue({
            jsonEntry: jsonEntry.definition[ key ],
            indent: keyIndent
          })

          return `\n${ keyIndent }${ key }: ${ val }`
        })

      return `{${ list.join(',') }\n${ indent }}`
    },
    createExpectCall: ({ jsonEntry, ref }) => (
      jsonEntry.definition === void 0
        ? `expect(${ ref }).toBeTypeOf('object')`
        : `expect(${ ref }).toMatchObject(${ getExpectMatcher(jsonEntry) })`
    ),
    expectMatcher: 'expect.any(Object)'
  },

  Boolean: {
    valueRegex: /^(true|false)$/,
    createValue: () => 'true',
    createExpectCall: ({ ref }) => `expect(${ ref }).toBeTypeOf('boolean')`,
    expectMatcher: 'expect.any(Boolean)'
  },

  Function: {
    valueRegex: / => /, // example: "(file) => file.name"
    createValue: ({ jsonEntry, indent = testIndent }) => {
      const callParams = Object.keys(jsonEntry.params || [])
        .map(paramName => `_${ paramName }`)
        .join(', ')

      if (jsonEntry.returns !== void 0) {
        const val = getTestValue({
          jsonEntry: jsonEntry.returns,
          indent
        })

        return `(${ callParams }) => ${ val }`
      }

      return `(${ callParams }) => {}`
    },
    createExpectCall: ({ ref }) => `expect(${ ref }).toBeTypeOf('function')`,
    expectMatcher: 'expect.any(Function)'
  },

  RegExp: {
    valueRegex: /^\/.*\/[gimuy]*$/,
    createValue: () => '/.*/',
    createExpectCall: ({ ref }) => `expect(${ ref }).toBeInstanceOf(RegExp)`,
    expectMatcher: 'expect.any(RegExp)'
  },

  Date: {
    createValue: () => 'new Date()',
    createExpectCall: ({ ref }) => `expect(${ ref }).$any([ expect.any(Date), expect.any(String), expect.any(Number) ])`,
    expectMatcher: 'expect.$any([ expect.any(Date), expect.any(String), expect.any(Number) ])'
  },

  Element: {
    valueRegex: /^document\./,
    createValue: () => 'document.createElement(\'div\')',
    createExpectCall: ({ ref }) => `expect(${ ref }).toBeInstanceOf(Element)`,
    expectMatcher: 'expect.any(Element)'
  },

  Any: {
    createValue: () => '\'any-value\'',
    createExpectCall: ({ ref }) => `expect(${ ref }).toBeDefined()`,
    expectMatcher: 'expect.anything()'
  },

  Event: {
    createValue: () => 'new Event(\'click\')',
    createExpectCall: ({ ref }) => `expect(${ ref }).toBeInstanceOf(Event)`,
    expectMatcher: 'expect.any(Event)'
  },

  SubmitEvent: {
    createValue: () => 'new SubmitEvent(\'submit\')',
    createExpectCall: ({ ref }) => `expect(${ ref }).toBeInstanceOf(SubmitEvent)`,
    expectMatcher: 'expect.any(Event)'
  },

  File: {
    createValue: () => 'new File([], \'file.txt\')',
    createExpectCall: ({ ref }) => `expect(${ ref }).toBeInstanceOf(File)`,
    expectMatcher: 'expect.any(File)'
  },

  'Promise<any>': {
    createValue: () => 'new Promise((_resolve, _reject) => {})',
    createExpectCall: ({ ref }) => `expect(${ ref }).toBeInstanceOf(Promise)`,
    expectMatcher: 'expect.any(Promise)'
  },
  'Promise<void>': {
    createValue: () => 'new Promise((_resolve, _reject) => {})',
    createExpectCall: ({ ref }) => `expect(${ ref }).toBeInstanceOf(Promise)`,
    expectMatcher: 'expect.any(Promise)'
  },
  'Promise<boolean>': {
    createValue: () => 'new Promise((_resolve, _reject) => {})',
    createExpectCall: ({ ref }) => `expect(${ ref }).toBeInstanceOf(Promise)`,
    expectMatcher: 'expect.any(Promise)'
  },
  'Promise<number>': {
    createValue: () => 'new Promise((_resolve, _reject) => {})',
    createExpectCall: ({ ref }) => `expect(${ ref }).toBeInstanceOf(Promise)`,
    expectMatcher: 'expect.any(Promise)'
  },
  'Promise<string>': {
    createValue: () => 'new Promise((_resolve, _reject) => {})',
    createExpectCall: ({ ref }) => `expect(${ ref }).toBeInstanceOf(Promise)`,
    expectMatcher: 'expect.any(Promise)'
  },
  'Promise<object>': {
    createValue: () => 'new Promise((_resolve, _reject) => {})',
    createExpectCall: ({ ref }) => `expect(${ ref }).toBeInstanceOf(Promise)`,
    expectMatcher: 'expect.any(Promise)'
  },

  Error: {
    createValue: () => 'new Error()',
    createExpectCall: ({ ref }) => `expect(${ ref }).toBeInstanceOf(Error)`,
    expectMatcher: 'expect.any(Error)'
  },

  Component: {
    createValue: () => '{ template: \'<div></div>\', props: {}, setup () {} }',
    createExpectCall: ({ ref }) => `expect(${ ref }).toBeTypeOf('object')`,
    expectMatcher: 'expect.any(Object)'
  },

  null: {
    valueRegex: /^null$/,
    createValue: () => 'null',
    createExpectCall: ({ ref }) => `expect(${ ref }).toBeNull()`,
    expectMatcher: 'null'
  },

  undefined: {
    valueRegex: /^undefined$/,
    createValue: () => 'undefined',
    createExpectCall: ({ ref }) => `expect(${ ref }).toBeUndefined()`,
    expectMatcher: 'void 0'
  }
}

export function filterDefExceptionTypes (type) {
  if (Array.isArray(type) === true) {
    const list = type.filter(type => type !== 'FileList')
    return list.length === 1
      ? list[ 0 ]
      : list
  }

  if (type !== 'FileList') return type
}

function getMountRequiredProps (jsonProps, exceptionProp) {
  const acc = []
  const propIndent = `${ testIndent }    `

  Object.keys(jsonProps || []).forEach(prop => {
    if (prop === exceptionProp) return

    const propDef = jsonProps[ prop ]

    if (propDef.required) {
      const pascalName = pascalCase(prop)
      const val = getTestValue({
        jsonEntry: propDef,
        indent: propIndent
      })

      acc.push([ pascalName, val ])

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

function getExpectMatcher (jsonEntry, indent = testIndent) {
  const innerIndent = indent + '  '

  if (jsonEntry.values !== void 0) {
    const lines = jsonEntry.values.join(`,\n${ innerIndent }`)
    return `expect.$any([\n${ innerIndent }${ lines }\n${ indent }])`
  }

  if (Array.isArray(jsonEntry.type) === false) {
    const { type } = jsonEntry

    if (type === 'Object') {
      if (jsonEntry.definition !== void 0) {
        const { definition } = jsonEntry
        const definitionKeys = Object.keys(definition)

        const list = definitionKeys
          .filter(filterSpreadKey)
          .map(key => {
            return `${ key }: ${ getExpectMatcher(definition[ key ], innerIndent) }`
          })

        const expectStr = `{\n${ innerIndent }${ list.join(`,\n${ innerIndent }`) }\n${ indent }}`
        return definitionKeys.length === 1 && definitionKeys[ 0 ] === '...keys'
          ? `expect.$objectValues(${ expectStr })`
          : expectStr
      }
    }
    else if (type === 'Array') {
      if (jsonEntry.definition !== void 0) {
        const { definition } = jsonEntry
        const definitionKeys = Object.keys(definition)

        const list = definitionKeys
          .filter(filterSpreadKey)
          .map(key => {
            return `${ key }: ${ getExpectMatcher(definition[ key ], innerIndent) }`
          })

        const expectStr = `{\n${ innerIndent }${ list.join(`,\n${ innerIndent }`) }\n${ indent }}`
        return `expect.$arrayValues(${ expectStr })`
      }
    }

    if ([ 'Any', 'FileList' ].includes(jsonEntry.type) === true) {
      return 'expect.anything()'
    }

    const target = typeMap[ jsonEntry.type ]
    if (target === void 0) {
      console.error('jsonEntry:', jsonEntry)
      throw new Error(`getExpectMatcher(): unknown type: ${ jsonEntry.type }`)
    }

    return target.expectMatcher
  }

  if (
    jsonEntry.type.includes('Any')
    || jsonEntry.type.includes('FileList')
  ) {
    return 'expect.anything()'
  }

  const lines = jsonEntry.type
    .map(type => getExpectMatcher({ ...jsonEntry, type }, innerIndent))
    .join(`,\n${ innerIndent }`)

  return `expect.$any([\n${ innerIndent }${ lines }\n${ indent }])`
}

export function getTypeTest ({ jsonEntry, ref }) {
  if (jsonEntry.values !== void 0) {
    const localIndent = testIndent + '  '
    return `expect([\n${ localIndent }${ jsonEntry.values.join(`,\n${ localIndent }`) }\n${ testIndent }]).toContain(${ ref })`
  }

  if (Array.isArray(jsonEntry.type) === false) {
    const target = typeMap[ jsonEntry.type ]
    if (target === void 0) {
      console.error('jsonEntry:', jsonEntry)
      throw new Error(`getTypeTest(): unknown type: ${ jsonEntry.type }`)
    }

    return target.createExpectCall({ jsonEntry, ref })
  }

  return `expect(${ ref }).$any([ ${ getExpectMatcher(jsonEntry) } ])`
}

const defTypeTestableValueKeyList = Object.keys(typeMap)
  .filter(key => typeMap[ key ].valueRegex !== void 0)

export function getTestValue ({ jsonEntry, indent = testIndent }) {
  const { type, default: defaultVal, values, examples } = jsonEntry

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
        const { valueRegex } = typeMap[ typeWithRegex ]
        for (const val of valuesList) {
          if (valueRegex.test(val) === true) {
            return val
          }
        }
      }

      break
    }

    const target = typeMap[ typeBeingTested ]

    if (target?.valueRegex === void 0) continue
    const { valueRegex } = target

    for (const val of valuesList) {
      if (valueRegex.test(val) === true)
        return val
    }
  }

  for (const fallbackType of typeList) {
    if (fallbackType === 'FileList') continue
    const fallback = typeMap[ fallbackType ]

    if (fallback === void 0) {
      console.error('jsonEntry:', jsonEntry)
      throw new Error(`getTestValue() -> Unknown type: ${ fallbackType }`)
    }

    return fallback.createValue({ jsonEntry, indent })
  }

  console.error('jsonEntry:', jsonEntry)
  throw new Error(`getTestValue() -> Cannot handle any of type(s): ${ typeList }`)
}

export function getFunctionCallTest ({ jsonEntry, ref, indent = testIndent }) {
  const paramIndent = indent + '  '
  let callParams = Object.keys(jsonEntry.params || [])
    .map(paramName => {
      const val = getTestValue({
        jsonEntry: jsonEntry.params[ paramName ],
        indent: paramIndent
      })

      return `\n${ paramIndent }${ val }`
    })
    .join(',')

  if (callParams.length !== 0) {
    callParams += `\n${ indent }`
  }

  const callRef = `${ ref }(${ callParams })`

  if (jsonEntry.returns) {
    const returnTypeTest = getTypeTest({
      jsonEntry: jsonEntry.returns,
      ref: callRef
    })

    return `${ returnTypeTest }`
  }

  return `expect(${ callRef }).toBeUndefined()`
}
