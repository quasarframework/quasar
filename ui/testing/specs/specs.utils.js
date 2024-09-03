export const testIndent = '        '

const ignoreKeyRE = /\.\.\./
const newlineRE = /\n/g

const camelCaseRE = /((-|\.)\w)/g
const camelCaseInnerRE = /-|\./
export function camelCase (str) {
  // assumes kebab case "str"
  return str.replace(
    camelCaseRE,
    text => text.replace(camelCaseInnerRE, '').toUpperCase()
  )
}

const kebabRE = /([a-zA-Z])([A-Z])/g
export function kebabCase (str) {
  // assumes pascal case "str"
  return str.replace(kebabRE, '$1-$2').toLowerCase()
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
    createValue: ({ jsonEntry, indent }) => {
      if (jsonEntry.definition === void 0) return '[]'

      const list = joinObject({
        keyList: Object.keys(jsonEntry.definition),
        getValue: (key, innerIndent) => getTestValue({
          jsonEntry: jsonEntry.definition[ key ],
          indent: innerIndent
        }),
        indent
      })

      return `[ ${ list } ]`
    },
    createExpectCall: ({ jsonEntry, ref, indent }) => {
      if (jsonEntry.definition === void 0) {
        return `expect(Array.isArray(${ ref })).toBe(true)`
      }

      const value = getExpectMatcher({
        jsonEntry,
        indent
      })

      return `expect(${ ref }).$arrayValues(${ value })`
    },
    expectMatcher: 'expect.any(Array)'
  },

  Object: {
    valueRegex: /^{.*}$/,
    createValue: ({ jsonEntry, indent }) => {
      if (jsonEntry.definition === void 0) return '{}'

      return joinObject({
        keyList: Object.keys(jsonEntry.definition),
        getValue: (key, innerIndent) => getTestValue({
          jsonEntry: jsonEntry.definition[ key ],
          indent: innerIndent
        }),
        indent
      })
    },
    createExpectCall: ({ jsonEntry, ref, indent }) => {
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
            ref,
            indent
          })
        }

        if (localKey === '...key') {
          const values = getExpectMatcher({
            jsonEntry: jsonEntry.definition[ localKey ],
            indent
          })

          return `expect(${ ref }).$objectValues(${ values })`
        }
      }

      const value = getExpectMatcher({
        jsonEntry,
        indent
      })

      return `expect(${ ref }).toStrictEqual(${ value })`
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
    createValue: ({ jsonEntry, indent }) => {
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
    expectMatcher: 'undefined'
  }
}

function joinObject ({
  keyList,
  getValue,
  indent
}) {
  const codeLines = []
  const commentLines = []
  const innerIndent = indent + '  '

  keyList.forEach(key => {
    if (ignoreKeyRE.test(key) === true) {
      commentLines.push(`// ${ key }`)
    }
    else {
      codeLines.push(`${ key }: ${ getValue(key, innerIndent) }`)
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

function joinList ({
  keyList,
  getValue,
  indent,
  prefix = '[',
  suffix = ']'
}) {
  const innerIndent = keyList.length === 1
    ? indent
    : indent + '  '

  const lines = keyList.map(key => getValue(key, innerIndent))

  const str = lines.join(', ')

  if (str.length + indent.length > 80) {
    return keyList.length === 1
      ? `${ prefix ? prefix + ' ' : '' }${ lines[ 0 ] }${ suffix ? ' ' + suffix : '' }`
      : `${ prefix }\n${ indent }  ${ lines.join(`,\n${ indent }  `) }\n${ indent }${ suffix }`
  }

  return `${ prefix ? prefix + ' ' : '' }${ str }${ suffix ? ' ' + suffix : '' }`
}

export function filterDefExceptionTypes (type) {
  const typeList = Array.isArray(type) === true
    ? type
    : [ type ]

  return typeList.filter(type => type !== 'FileList')
}

export function getComponentPropAssignment ({
  camelCaseName,
  jsonEntry,
  indent
}) {
  const keyList = [ `${ camelCaseName }: propVal` ]

  if (jsonEntry.sync === true) {
    keyList.push(
      `'onUpdate:${ camelCaseName }': val => { wrapper.setProps({ ${ camelCaseName }: val }) }`
    )
  }

  const props = joinList({
    keyList,
    getValue: key => key,
    indent,
    prefix: '{',
    suffix: '}'
  })

  return (
    `await wrapper.setProps(${ props })`
    + `\n${ indent }await flushPromises()`
  )
}

export function getComponentMount ({
  ctx,
  json,
  prop = null,
  slot = null,
  indent
}) {
  const target = {}
  const innerIndent = `${ indent }    `
  const props = Object.keys(json.props || [])
    .filter(propName => prop === propName || json.props[ propName ].required === true)

  if (props.length !== 0) {
    target.props = props.reduce((acc, propName) => {
      const jsonEntry = json.props[ propName ]
      const camelCaseName = camelCase(propName)

      acc[ camelCaseName ] = prop === propName
        ? 'propVal'
        : getTestValue({
          jsonEntry,
          indent: innerIndent
        })

      if (jsonEntry.sync === true) {
        acc[ `'onUpdate:${ camelCaseName }'` ] = (
          `val => { wrapper.setProps({ ${ camelCaseName }: val }) }`
        )
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
        `\n${ innerIndent }`
      )
    }
  }

  const keyList = Object.keys(target)

  if (keyList.length === 0) {
    return `const wrapper = mount(${ ctx.camelCaseName })`
  }

  const mountOpts = joinObject({
    keyList,
    getValue: (key, innerIndent) => {
      const acc = target[ key ]
      return joinObject({
        keyList: Object.keys(acc),
        getValue: innerKey => acc[ innerKey ],
        indent: innerIndent
      })
    },
    indent
  })

  return `const wrapper = mount(${ ctx.camelCaseName }, ${ mountOpts })`
}

function getExpectMatcher ({ jsonEntry, indent }) {
  if (jsonEntry.values !== void 0) {
    const list = joinList({
      keyList: jsonEntry.values,
      getValue: key => key,
      indent
    })

    return `expect.$any(${ list })`
  }

  if (Array.isArray(jsonEntry.type) === false) {
    if (jsonEntry.type === 'Object') {
      if (jsonEntry.definition !== void 0) {
        const keyList = Object.keys(jsonEntry.definition)

        if (keyList.length === 1) {
          const [ localKey ] = keyList

          if (localKey === '...self') {
            // could be anything, not only Object
            return getExpectMatcher({
              jsonEntry: jsonEntry.definition[ localKey ],
              indent
            })
          }

          if (localKey === '...key') {
            const target = jsonEntry.definition[ localKey ].definition

            // example: QUploader > slots > header
            if (target === void 0) {
              return getExpectMatcher({
                jsonEntry: jsonEntry.definition[ localKey ],
                indent
              })
            }

            const list = joinObject({
              keyList: Object.keys(target),
              getValue: (key, innerIndent) => getExpectMatcher({
                jsonEntry: target[ key ],
                indent: innerIndent
              }),
              indent
            })

            return `expect.$objectValues(${ list })`
          }
        }

        return joinObject({
          keyList,
          getValue: (key, innerIndent) => getExpectMatcher({
            jsonEntry: jsonEntry.definition[ key ],
            indent: innerIndent
          }),
          indent
        })
      }
    }
    else if (jsonEntry.type === 'Array') {
      if (jsonEntry.definition !== void 0) {
        const { definition } = jsonEntry
        const keyList = Object.keys(definition)

        const list = joinObject({
          keyList,
          getValue: (key, innerIndent) => getExpectMatcher({
            jsonEntry: definition[ key ],
            indent: innerIndent
          }),
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

  const list = joinList({
    keyList: jsonEntry.type,
    getValue: (type, innerIndent) => getExpectMatcher({
      jsonEntry: { ...jsonEntry, type },
      indent: innerIndent
    }),
    indent
  })

  return `expect.$any(${ list })`
}

export function getTypeTest ({
  jsonEntry,
  ref,
  indent
}) {
  if (jsonEntry.values !== void 0) {
    const list = joinList({
      keyList: jsonEntry.values,
      getValue: key => key,
      indent
    })

    return `expect(${ list }).toContain(${ ref })`
  }

  if (Array.isArray(jsonEntry.type) === false) {
    const target = typeMap[ jsonEntry.type ]
    if (target === void 0) {
      console.error('jsonEntry:', jsonEntry)
      throw new Error(`getTypeTest(): unknown type: ${ jsonEntry.type }`)
    }

    return target.createExpectCall({
      jsonEntry,
      ref,
      indent
    })
  }

  const list = joinList({
    keyList: jsonEntry.type,
    getValue: (type, innerIndent) => getExpectMatcher({
      jsonEntry: { ...jsonEntry, type },
      indent: innerIndent
    }),
    indent
  })

  return `expect(${ ref }).$any(${ list })`
}

const defTypeTestableValueKeyList = Object.keys(typeMap)
  .filter(key => typeMap[ key ].valueRegex !== void 0)

export function getTestValue ({ jsonEntry, indent }) {
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

    return fallback.createValue({
      jsonEntry,
      indent
    })
  }

  console.error('jsonEntry:', jsonEntry)
  throw new Error(`getTestValue() -> Cannot handle any of type(s): ${ typeList }`)
}

export function getFunctionCallTest ({
  jsonEntry,
  ref,
  indent
}) {
  const localIndent = indent + '  '
  const callParams = jsonEntry.params
    ? joinList({
      keyList: Object.keys(jsonEntry.params),
      getValue: (paramName, innerIndent) => getTestValue({
        jsonEntry: jsonEntry.params[ paramName ],
        indent: innerIndent
      }),
      indent: localIndent,
      prefix: '',
      suffix: ''
    })
    : ''

  const callRef = `\n${ localIndent }${ ref }(${ callParams })\n${ indent }`

  if (jsonEntry.returns) {
    const returnTypeTest = getTypeTest({
      jsonEntry: jsonEntry.returns,
      ref: callRef,
      indent
    })

    return `${ returnTypeTest }`
  }

  return `expect(${ callRef }).toBeUndefined()`
}
