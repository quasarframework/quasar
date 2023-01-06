import { h, ref } from 'vue'
import { QBadge, QBtn, Notify } from 'quasar'
import { copyToClipboard } from 'assets/page-utils'
import { mdiMinusBox, mdiPlusBox } from '@quasar/extras/mdi-v6'

function copyPropName (propName) {
  copyToClipboard(propName)

  Notify.create({
    message: 'The name has been copied to clipboard.',
    position: 'top',
    actions: [{ icon: 'cancel', color: 'white', dense: true, round: true }],
    timeout: 2000
  })
}

function getEventParams (event) {
  const params = event.params === void 0 || event.params.length === 0
    ? ''
    : Object.keys(event.params).join(', ')

  return `(${ params }) => void`
}

function getMethodParams (method, noRequired) {
  if (!method.params || method.params.length === 0) {
    return ' ()'
  }

  if (noRequired === true) {
    return ` (${Object.keys(method.params).join(', ')})`
  }

  const params = Object.keys(method.params)
  const optionalIndex = params.findIndex(param => method.params[ param ].required !== true)

  const str = optionalIndex !== -1
    ? params.slice(0, optionalIndex).join(', ') +
      (optionalIndex < params.length
        ? (optionalIndex > 0 ? ', ' : '') + params.slice(optionalIndex).join('?, ') + '?'
        : '')
    : params.join(', ')

  return ' (' + str + ')'
}

function getMethodReturnValue (method) {
  return ' => ' +
    (!method.returns
      ? 'void'
      : getStringType(method.returns.type)
    )
}

function getStringType (type) {
  return Array.isArray(type)
    ? type.join(' | ')
    : type
}

const NAME_PROP_COLOR = [
  'orange-8',
  'accent',
  'secondary'
]

function getDiv (col, propName, propValue, slot) {
  return h('div', { class: `doc-api-entry__item col-xs-12 col-sm-${col}` }, [
    h('div', { class: 'doc-api-entry__type' }, propName),
    propValue !== void 0
      ? h('div', { class: 'doc-api-entry__value' }, propValue)
      : slot
  ])
}

function getNameDiv (prop, label, suffix, level) {
  const suffixLabel = `${suffix ? ` : ${ suffix }` : ''}${prop.required ? ' - required!' : ''}`

  const child = [
    h(QBadge, {
      class: 'doc-api-entry__pill cursor-pointer',
      label,
      color: NAME_PROP_COLOR[ level ],
      onClick: () => { copyPropName(label) }
    }),
    suffixLabel
  ]

  if (prop.addedIn !== void 0) {
    child.push(
      h(QBadge, {
        class: 'q-ml-sm',
        color: 'red',
        textColor: 'white',
        label: prop.addedIn + '+'
      })
    )
  }

  return h('div', { class: 'doc-api-entry__item col-xs-12 col-sm-12' }, [
    h('div', { class: 'doc-api-entry__value' }, child)
  ])
}

function getExpandable (openState, desc, isExpandable, key, getDetails) {
  if (isExpandable === true) {
    const expanded = openState.value[ key ] === true
    const child = [
      h('div', { class: 'doc-api-entry__item col-xs-12 col-sm-12' }, [
        h('div', { class: 'doc-api-entry__type row items-center no-wrap' }, [
          h('span', 'Description'),
          h(QBtn, {
            class: 'doc-api-entry__expand-btn header-btn',
            flat: true,
            size: '11px',
            padding: '1px',
            icon: expanded === true ? mdiMinusBox : mdiPlusBox,
            onClick: () => { openState.value[ key ] = expanded === false }
          })
        ]),
        h('div', { class: 'doc-api-entry__value' }, desc)
      ])
    ]

    return expanded === true
      ? child.concat(getDetails())
      : child
  }
  else {
    return [getDiv(12, 'Description', desc)]
  }
}

function getPropDetails (openState, masterKey, prop, level) {
  const details = []

  if (prop.sync === true) {
    details.push(
      getDiv(3, 'Note', 'Required to be used with v-model!')
    )
  }

  if (prop.default !== void 0) {
    details.push(
      getDiv(
        3,
        'Default value',
        void 0,
        h(
          'div',
          { class: 'doc-api-entry--indent doc-api-entry__value' },
          h('div', { class: 'doc-token' }, '' + prop.default)
        )
      )
    )
  }

  if (prop.link === true) {
    details.push(
      getDiv(6, 'External link', prop.link)
    )
  }

  if (prop.values !== void 0) {
    details.push(
      getDiv(
        12,
        'Accepted values',
        void 0,
        h(
          'div',
          { class: 'doc-api-entry--indent doc-api-entry__value' },
          prop.values.map(val => h('div', { class: 'doc-token' }, '' + val))
        )
      )
    )
  }

  if (prop.definition !== void 0) {
    const nodes = []
    for (const propName in prop.definition) {
      nodes.push(
        getProp(openState, masterKey, prop.definition[ propName ], propName, 2)
      )
    }

    details.push(
      getDiv(
        12,
        'Props',
        void 0,
        h('div', { class: 'doc-api-entry__subitem' }, nodes)
      )
    )
  }

  if (prop.params !== void 0 && prop.params !== null) {
    const
      nodes = [],
      newLevel = (level + 1) % NAME_PROP_COLOR.length

    for (const propName in prop.params) {
      nodes.push(
        getProp(openState, masterKey, prop.params[ propName ], propName, newLevel)
      )
    }

    details.push(
      getDiv(
        12,
        'Params',
        void 0,
        h('div', { class: 'doc-api-entry__subitem' }, nodes)
      )
    )
  }

  if (prop.returns !== void 0 && prop.returns !== null) {
    details.push(
      getDiv(
        12,
        `Return type: ${getStringType(prop.returns.type)}`,
        void 0,
        h(
          'div',
          { class: 'doc-api-entry__subitem' },
          [getProp(openState, masterKey, prop.returns, void 0, 0)]
        )
      )
    )
  }

  if (prop.scope !== void 0) {
    const nodes = []
    for (const propName in prop.scope) {
      nodes.push(
        getProp(openState, masterKey, prop.scope[ propName ], propName, 1)
      )
    }

    details.push(
      getDiv(
        12,
        'Scope',
        void 0,
        h('div', { class: 'doc-api-entry__subitem' }, nodes)
      )
    )
  }

  if (prop.examples !== void 0) {
    details.push(
      getDiv(
        12,
        `Example${prop.examples.length > 1 ? 's' : ''}`,
        void 0,
        h(
          'div',
          { class: 'doc-api-entry--indent doc-api-entry__value' },
          prop.examples.map(example => h('div', { class: 'doc-token' }, '' + example))
        )
      )
    )
  }

  return details
}

function getProp (openState, masterKey, prop, propName, level, onlyChildren) {
  const type = getStringType(prop.type)
  const child = []

  if (propName !== void 0) {
    const suffix = type === 'Function'
      ? `${ getMethodParams(prop, true) }${ getMethodReturnValue(prop) }`
      : type

    child.push(
      getNameDiv(prop, propName, suffix, level)
    )

    if (prop.reactive === true) {
      child.push(
        getDiv(3, 'Reactive', 'yes')
      )
    }
  }

  const isExpandable = (
    type === 'Function' ||
    prop.sync === true ||
    prop.default !== void 0 ||
    prop.link === true ||
    prop.values !== void 0 ||
    prop.definition !== void 0 ||
    (prop.params !== void 0 && prop.params !== null) ||
    (prop.returns !== void 0 && prop.returns !== null) ||
    prop.scope !== void 0 ||
    prop.examples !== void 0
  )

  const childKey = `${ masterKey }|||prop|${ prop.type }|${ propName }|${ level }`

  child.push(
    ...getExpandable(
      openState,
      prop.desc,
      isExpandable,
      childKey,
      () => getPropDetails(openState, childKey, prop, level)
    )
  )

  return onlyChildren !== true
    ? h('div', { class: 'doc-api-entry row' }, child)
    : child
}

const describe = {}

const describePropsLike = masterKey => (openState, props) => {
  const child = []

  for (const propName in props) {
    child.push(
      getProp(openState, masterKey, props[ propName ], propName, 0)
    )
  }

  return child
}
describe.props = describePropsLike('props')
describe.computedProps = describePropsLike('computedProps')
describe.slots = describePropsLike('slots')

describe.events = (openState, events) => {
  const child = []

  if (events === void 0) {
    return child
  }

  for (const eventName in events) {
    const event = events[ eventName ]
    const masterKey = `event|${ eventName }`

    child.push(
      h('div', { class: 'doc-api-entry row' }, [
        getNameDiv(event, eventName, getEventParams(event), 0),

        ...getExpandable(
          openState,
          event.desc,
          true,
          masterKey,
          () => {
            const params = []

            if (event.params !== void 0) {
              for (const paramName in event.params) {
                params.push(
                  getProp(openState, masterKey, event.params[ paramName ], paramName, 1)
                )
              }
            }
            else {
              params.push(
                h('div', { class: 'text-italic q-py-xs q-px-md' }, '*None*')
              )
            }

            return getDiv(12,
              'Parameters',
              void 0,
              h('div', { class: 'doc-api-entry__subitem' }, params)
            )
          }
        )
      ])
    )
  }

  return child
}

describe.methods = (openState, methods) => {
  const child = []

  for (const methodName in methods) {
    const method = methods[ methodName ]
    const masterKey = `method|${ methodName }`

    const methodNode = h('div', { class: 'doc-api-entry row' }, [
      getNameDiv(method, methodName, `${ getMethodParams(method) }${ getMethodReturnValue(method) }`, 0),

      method.addedIn !== void 0
        ? getDiv(12, 'Added in', method.addedIn)
        : null,

      ...getExpandable(
        openState,
        method.desc,
        method.params !== void 0 || method.returns !== void 0,
        masterKey,
        () => {
          const nodes = []

          if (method.params !== void 0) {
            const props = []
            for (const paramName in method.params) {
              props.push(
                getProp(openState, masterKey, method.params[ paramName ], paramName, 1)
              )
            }
            nodes.push(
              getDiv(
                12,
                'Parameters',
                void 0,
                h('div', { class: 'doc-api-entry__subitem' }, props)
              )
            )
          }

          if (method.returns !== void 0) {
            nodes.push(
              getDiv(
                12,
                `Return type: ${getStringType(method.returns.type)}`,
                void 0,
                h(
                  'div',
                  { class: 'doc-api-entry__subitem' },
                  [getProp(openState, masterKey, method.returns, void 0, 0)]
                )
              )
            )
          }

          return nodes
        }
      )
    ])

    child.push(methodNode)
  }

  return child
}

describe.value = (openState, value) => {
  return [
    h('div', { class: 'doc-api-entry row' }, [
      getDiv(12, 'Type', getStringType(value.type))
    ].concat(getProp(openState, 'value', value, void 0, 0, true)))
  ]
}

describe.arg = (openState, arg) => {
  return [
    h('div', { class: 'doc-api-entry row' }, [
      getDiv(12, 'Type', getStringType(arg.type))
    ].concat(getProp(openState, 'arg', arg, void 0, 0, true)))
  ]
}

describe.modifiers = (openState, modifiers) => {
  const child = []

  for (const modifierName in modifiers) {
    const modifier = modifiers[ modifierName ]

    child.push(
      h(
        'div',
        { class: 'doc-api-entry row' },
        getProp(openState, 'modifiers', modifier, modifierName, 0, true)
      )
    )
  }

  return child
}

describe.injection = (_, injection) => {
  return [
    h('div', { class: 'doc-api-entry row' }, [
      getNameDiv(injection, injection, false, 0)
    ])
  ]
}

describe.quasarConfOptions = (openState, conf) => {
  const child = []
  const entry = [
    h('div', { class: 'doc-api-entry__item col-xs-12 col-sm-12' }, [
      h('div', { class: 'doc-api-entry__value' }, [
        h('span', { class: 'doc-api-entry__type text-grey' }, 'quasar.config.js > framework > config > '),
        h(QBadge, {
          class: 'doc-api-entry__pill',
          color: NAME_PROP_COLOR[ 0 ],
          label: conf.propName
        })
      ])
    ])
  ]

  for (const def in conf.definition) {
    child.push(
      getProp(openState, 'quasarConfOptions', conf.definition[ def ], def, 0)
    )
  }

  conf.addedIn !== void 0 && entry.push(
    getDiv(12, 'Added in', conf.addedIn)
  )

  entry.push(
    getDiv(
      12,
      'Definition',
      void 0,
      h('div', { class: 'doc-api-entry__subitem' }, child)
    )
  )

  return [
    h('div', { class: 'doc-api-entry row' }, entry)
  ]
}

export default {
  name: 'DocApiEntry',

  props: {
    type: String,
    definition: [ Object, String ]
  },

  setup (props) {
    const openState = ref({})

    return () => {
      const content = Object.keys(props.definition).length !== 0
        ? describe[ props.type ](openState, props.definition)
        : [
            h('div', { class: 'q-pa-md doc-api__nothing-to-show' }, [
              h('div', 'No matching entries found on this tab.'),
              h('div', 'Please check the other tabs/subtabs with a number badge on their label or refine the filter.')
            ])
          ]

      return h('div', { class: 'doc-api-entrys' }, content)
    }
  }
}
