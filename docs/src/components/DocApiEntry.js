import { h } from 'vue'
import { QBadge } from 'quasar'

import './DocApiEntry.sass'

function getEventParams (event) {
  const params = event.params === void 0 || event.params.length === 0
    ? ''
    : Object.keys(event.params).join(', ')

  return ' -> function(' + params + ')'
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
        ? '[' + (optionalIndex > 0 ? ', ' : '') + params.slice(optionalIndex).join(', ') + ']'
        : '')
    : params.join(', ')

  return ' (' + str + ')'
}

function getMethodReturnValue (method) {
  return ' => ' +
    (!method.returns
      ? 'void 0'
      : method.returns.type
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
  return h('div', { class: `api-row__item col-xs-12 col-sm-${col}` }, [
    h('div', { class: 'api-row__type' }, propName),
    propValue !== void 0
      ? h('div', { class: 'api-row__value' }, propValue)
      : slot
  ])
}

function getNameDiv (label, level) {
  return h('div', { class: 'api-row__item col-xs-12 col-sm-12' }, [
    h('div', { class: 'api-row__value' }, [
      h(QBadge, {
        color: NAME_PROP_COLOR[ level ],
        label,
        style: 'font-size: 1em; line-height: 1.2em'
      })
    ])
  ])
}

function getExtendedNameDiv (label, level, type, required) {
  const suffix = `${type ? ` : ${type}` : ''}${required ? ' - required!' : ''}`

  return h('div', { class: 'api-row__item col-xs-12 col-sm-12' }, [
    h('div', { class: 'api-row__value' }, [
      h(QBadge, {
        color: NAME_PROP_COLOR[ level ],
        label,
        style: 'font-size: 1em; line-height: 1.2em'
      }),
      suffix
    ])
  ])
}

function getProp (prop, propName, level, onlyChildren) {
  const type = getStringType(prop.type)
  const child = []

  if (propName !== void 0) {
    child.push(
      getExtendedNameDiv(propName, level, type, type !== 'Function' && prop.required === true)
    )

    if (prop.reactive === true) {
      child.push(
        getDiv(3, 'Reactive', 'yes')
      )
    }
  }

  if (prop.addedIn !== void 0) {
    child.push(
      getDiv(12, 'Added in', prop.addedIn)
    )
  }

  child.push(
    getDiv(12, 'Description', prop.desc)
  )

  if (type === 'Function') {
    child.push(
      getDiv(12, 'Function form', getMethodParams(prop, true) + getMethodReturnValue(prop))
    )
  }

  if (prop.sync === true) {
    child.push(
      getDiv(3, 'Note', 'Required to be used with v-model!')
    )
  }

  if (prop.default !== void 0) {
    child.push(
      getDiv(3, 'Default value', JSON.stringify(prop.default))
    )
  }

  if (prop.link === true) {
    child.push(
      getDiv(6, 'External link', prop.link)
    )
  }

  if (prop.values !== void 0) {
    child.push(
      getDiv(
        12,
        'Accepted values',
        void 0,
        h(
          'div',
          { class: 'api-row--indent api-row__value' },
          prop.values.map(val => h('div', { class: 'api-row__example' }, '' + val))
        )
      )
    )
  }

  if (prop.definition !== void 0) {
    const nodes = []
    for (const propName in prop.definition) {
      nodes.push(
        getProp(prop.definition[ propName ], propName, 2)
      )
    }

    child.push(
      getDiv(
        12,
        'Props',
        void 0,
        h('div', { class: 'api-row__subitem' }, nodes)
      )
    )
  }

  if (prop.params !== void 0 && prop.params !== null) {
    const
      nodes = [],
      newLevel = (level + 1) % NAME_PROP_COLOR.length

    for (const propName in prop.params) {
      nodes.push(
        getProp(prop.params[ propName ], propName, newLevel)
      )
    }

    child.push(
      getDiv(
        12,
        'Params',
        void 0,
        h('div', { class: 'api-row__subitem' }, nodes)
      )
    )
  }

  if (prop.returns !== void 0 && prop.returns !== null) {
    child.push(
      getDiv(
        12,
        `Returns <${getStringType(prop.returns.type)}>`,
        void 0,
        h(
          'div',
          { class: 'api-row__subitem' },
          [getProp(prop.returns, void 0, 0)]
        )
      )
    )
  }

  if (prop.scope !== void 0) {
    const nodes = []
    for (const propName in prop.scope) {
      nodes.push(
        getProp(prop.scope[ propName ], propName, 1)
      )
    }

    child.push(
      getDiv(
        12,
        'Scope',
        void 0,
        h('div', { class: 'api-row__subitem' }, nodes)
      )
    )
  }

  if (prop.examples !== void 0) {
    child.push(
      getDiv(
        12,
        `Example${prop.examples.length > 1 ? 's' : ''}`,
        void 0,
        h(
          'div',
          { class: 'api-row--indent api-row__value' },
          prop.examples.map(example => h('div', { class: 'api-row__example' }, '' + example))
        )
      )
    )
  }

  return onlyChildren !== true
    ? h('div', { class: 'api-row row' }, child)
    : child
}

const describe = {}

describe.props = props => {
  const child = []

  for (const propName in props) {
    child.push(
      getProp(props[ propName ], propName, 0)
    )
  }

  return child
}

describe.slots = slots => {
  const child = []

  for (const slot in slots) {
    child.push(
      getProp(slots[ slot ], slot, 0)
    )
  }

  return child
}

describe.events = events => {
  const child = []

  if (events === void 0) {
    return child
  }

  for (const eventName in events) {
    const event = events[ eventName ]
    const params = []

    if (event.params !== void 0) {
      for (const paramName in event.params) {
        params.push(
          getProp(event.params[ paramName ], paramName, 1)
        )
      }
    }
    else {
      params.push(
        h('div', { class: 'text-italic q-py-xs q-px-md' }, '*None*')
      )
    }

    child.push(
      h('div', { class: 'api-row row' }, [
        getNameDiv(`@${eventName}${getEventParams(event)}`, 0),
        event.addedIn !== void 0
          ? getDiv(12, 'Added in', event.addedIn)
          : null,
        getDiv(12, 'Description', event.desc),
        getDiv(12,
          'Parameters',
          void 0,
          h('div', { class: 'api-row__subitem' }, params)
        )
      ])
    )
  }

  return child
}

describe.methods = methods => {
  const child = []

  for (const methodName in methods) {
    const method = methods[ methodName ]

    const nodes = [
      getNameDiv(`${methodName}${getMethodParams(method)}${getMethodReturnValue(method)}`, 0),
      method.addedIn !== void 0
        ? getDiv(12, 'Added in', method.addedIn)
        : null,
      getDiv(12, 'Description', method.desc)
    ]

    if (method.params !== void 0) {
      const props = []
      for (const paramName in method.params) {
        props.push(
          getProp(method.params[ paramName ], paramName, 1)
        )
      }
      nodes.push(
        getDiv(
          12,
          'Parameters',
          void 0,
          h('div', { class: 'api-row__subitem' }, props)
        )
      )
    }
    if (method.returns !== void 0) {
      nodes.push(
        getDiv(
          12,
          `Returns <${getStringType(method.returns.type)}>`,
          void 0,
          h(
            'div',
            { class: 'api-row__subitem' },
            [getProp(method.returns, void 0, 0)]
          )
        )
      )
    }

    child.push(
      h('div', { class: 'api-row row' }, nodes)
    )
  }

  return child
}

describe.value = value => {
  return [
    h('div', { class: 'api-row row' }, [
      getDiv(12, 'Type', getStringType(value.type))
    ].concat(getProp(value, void 0, 0, true)))
  ]
}

describe.arg = arg => {
  return [
    h('div', { class: 'api-row row' }, [
      getDiv(12, 'Type', getStringType(arg.type))
    ].concat(getProp(arg, void 0, 0, true)))
  ]
}

describe.modifiers = modifiers => {
  const child = []

  for (const modifierName in modifiers) {
    const modifier = modifiers[ modifierName ]

    child.push(
      h(
        'div',
        { class: 'api-row row' },
        getProp(modifier, modifierName, 0, true)
      )
    )
  }

  return child
}

describe.injection = injection => {
  return [
    h('div', { class: 'api-row row' }, [
      getNameDiv(injection, 0)
    ])
  ]
}

describe.quasarConfOptions = conf => {
  const child = []
  const entry = [
    h('div', { class: 'api-row__item col-xs-12 col-sm-12' }, [
      h('div', { class: 'api-row__value' }, [
        h('span', { class: 'api-row__type text-grey' }, 'quasar.conf.js > framework > config > '),
        h(QBadge, {
          color: NAME_PROP_COLOR[ 0 ],
          label: conf.propName,
          style: 'font-size: 1em; line-height: 1.2em'
        })
      ])
    ])
  ]

  for (const def in conf.definition) {
    child.push(
      getProp(conf.definition[ def ], def, 0)
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
      h('div', { class: 'api-row__subitem' }, child)
    )
  )

  return [
    h('div', { class: 'api-row row' }, entry)
  ]
}

export default {
  name: 'DocApiEntry',

  props: {
    type: String,
    definition: [ Object, String ]
  },

  setup (props) {
    return () => {
      const content = Object.keys(props.definition).length !== 0
        ? describe[ props.type ](props.definition)
        : [
            h('div', { class: 'q-pa-md doc-api__nothing-to-show' }, [
              h('div', 'No matching entries found on this tab.'),
              h('div', 'Please check the other tabs/subtabs with a number badge on their label or refine the filter.')
            ])
          ]

      return h('div', { class: 'api-rows' }, content)
    }
  }
}
