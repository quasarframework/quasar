export const testIndent = '        '

const pascalRegex = /((-|\.)\w)/g
const kebabRegex = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g
const ignoreKeyRE = /\.\.\./
const newlineRE = /\n/g

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

export function capitalize (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
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
      const list = getObjectList({
        keyList: Object.keys(jsonEntry.definition),
        getValue: key => getTestValue({
          jsonEntry: jsonEntry.definition[ key ],
          indent: keyIndent
        }),
        indent
      })

      return `[ ${ list } ]`
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
      return getObjectList({
        keyList: Object.keys(jsonEntry.definition),
        getValue: key => getTestValue({
          jsonEntry: jsonEntry.definition[ key ],
          indent: keyIndent
        }),
        indent
      })
    },
    createExpectCall: ({ jsonEntry, ref }) => {
      if (jsonEntry.definition === void 0) {
        return `expect(${ ref }).toBeTypeOf('object')`
      }

      const keyList = Object.keys(jsonEntry.definition)
      if (keyList.length === 1) {
        const [ localKey ] = keyList

        if (localKey === '...self') {
          // could be anything, not only Object
          return getTypeTest({
            jsonEntry: jsonEntry.definition[ localKey ],
            ref
          })
        }

        if (localKey === '...key') {
          return `expect(${ ref }).$objectValues(${ getExpectMatcher(jsonEntry.definition[ localKey ]) })`
        }
      }

      return `expect(${ ref }).toStrictEqual(${ getExpectMatcher(jsonEntry) })`
    },
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
    expectMatcher: 'expect.any(SubmitEvent)'
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

function getObjectList ({ keyList, getValue, indent }) {
  const codeLines = []
  const commentLines = []

  keyList.forEach(key => {
    if (ignoreKeyRE.test(key) === true) {
      commentLines.push(`// ${ key }`)
    }
    else {
      codeLines.push(`${ key }: ${ getValue(key) }`)
    }
  })

  const separator = `,\n${ indent }  `
  const listSeparator = codeLines.length !== 0 && commentLines.length !== 0
    ? `\n${ indent }  `
    : ''

  return (
    `{\n${ indent }  `
    + codeLines.join(separator)
    + listSeparator
    + commentLines.join(separator)
    + `\n${ indent }}`
  )
}

const mountInnerIndent = `${ testIndent }    `
export function getComponentMount ({ ctx, json, prop = null, slot = null }) {
  const target = {}
  const props = Object.keys(json.props || [])
    .filter(propName => prop === propName || json.props[ propName ].required === true)

  if (props.length !== 0) {
    target.props = props.reduce((acc, propName) => {
      const jsonEntry = json.props[ propName ]
      const pascalName = pascalCase(propName)

      acc[ pascalName ] = prop === propName
        ? 'propVal'
        : getTestValue({
          jsonEntry,
          indent: mountInnerIndent
        })

      if (jsonEntry.sync === true) {
        acc[ `'onUpdate:${ pascalName }'` ] = prop === propName
          ? 'val => { propVal = val }'
          : '(_val) => {}'
      }

      return acc
    }, {})
  }

  if (slot !== null) {
    const { name, slotFn } = slot
    const nameAsObjKey = name.indexOf('-') === -1
      ? name
      : `'${ name }'` // example: 'navigation-icon'

    target.slots = {
      [ nameAsObjKey ]: slotFn.replace(
        newlineRE,
        `\n${ mountInnerIndent }`
      )
    }
  }

  const keyList = Object.keys(target)

  if (keyList.length === 0) {
    return `const wrapper = mount(${ ctx.pascalName })`
  }

  const innerIndent = `${ testIndent }  `
  const mountOpts = getObjectList({
    keyList,
    getValue: key => {
      const acc = target[ key ]
      return getObjectList({
        keyList: Object.keys(acc),
        getValue: innerKey => acc[ innerKey ],
        indent: innerIndent
      })
    },
    indent: testIndent
  })

  return `const wrapper = mount(${ ctx.pascalName }, ${ mountOpts })`
}

function getExpectMatcher (jsonEntry, indent = testIndent) {
  const innerIndent = indent + '  '

  if (jsonEntry.values !== void 0) {
    const lines = jsonEntry.values.join(`,\n${ innerIndent }`)
    return `expect.$any([\n${ innerIndent }${ lines }\n${ indent }])`
  }

  if (Array.isArray(jsonEntry.type) === false) {
    if (jsonEntry.type === 'Object') {
      if (jsonEntry.definition !== void 0) {
        const keyList = Object.keys(jsonEntry.definition)

        if (keyList.length === 1) {
          const [ localKey ] = keyList

          if (localKey === '...self') {
            // could be anything, not only Object
            return getExpectMatcher(
              jsonEntry.definition[ localKey ],
              indent
            )
          }

          if (localKey === '...key') {
            const target = jsonEntry.definition[ localKey ].definition

            // example: QUploader > slots > header
            if (target === void 0) {
              return getExpectMatcher(
                jsonEntry.definition[ localKey ],
                indent
              )
            }

            const list = getObjectList({
              keyList: Object.keys(target),
              getValue: key => getExpectMatcher(
                target[ key ],
                innerIndent
              ),
              indent
            })

            return `expect.$objectValues(${ list })`
          }
        }

        return getObjectList({
          keyList,
          getValue: key => getExpectMatcher(
            jsonEntry.definition[ key ],
            innerIndent
          ),
          indent
        })
      }
    }
    else if (jsonEntry.type === 'Array') {
      if (jsonEntry.definition !== void 0) {
        const { definition } = jsonEntry
        const keyList = Object.keys(definition)

        const list = getObjectList({
          keyList,
          getValue: key => getExpectMatcher(
            definition[ key ],
            innerIndent
          ),
          indent
        })

        return `expect.$arrayValues(${ list })`
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
      if (valueRegex.test(val) === true) {
        return val
      }
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
