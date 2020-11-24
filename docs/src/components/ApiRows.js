import { h, defineComponent } from 'vue'
import { QBadge } from 'quasar'

import './ApiRows.sass'

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
  const optionalIndex = params.findIndex(param => method.params[param].required !== true)

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

export default defineComponent({
  name: 'ApiRows',

  props: {
    which: String,
    apiKey: String,
    api: Object
  },

  methods: {
    getDiv (col, propName, propValue, slot) {
      return h('div', { class: `api-row__item col-xs-12 col-sm-${col}` }, [
        h('div', propName),
        propValue !== void 0
          ? h('div', { class: 'api-row__value' }, propValue)
          : slot
      ])
    },

    getProp (prop, propName, level, onlyChildren) {
      const type = getStringType(prop.type)
      const child = []

      if (propName !== void 0) {
        child.push(
          this.getDiv(4, 'Name', h(QBadge, {
            color: NAME_PROP_COLOR[level],
            label: propName
          }))
        )

        if (type !== void 0) {
          child.push(
            this.getDiv(4, 'Type', type)
          )
        }

        if (type !== 'Function' && prop.required === true) {
          child.push(
            this.getDiv(3, 'Required', 'yes')
          )
        }

        if (prop.reactive === true) {
          child.push(
            this.getDiv(3, 'Reactive', 'yes')
          )
        }
      }

      if (prop.addedIn !== void 0) {
        child.push(
          this.getDiv(12, 'Added in', prop.addedIn)
        )
      }

      child.push(
        this.getDiv(12, 'Description', prop.desc)
      )

      if (type === 'Function') {
        child.push(
          this.getDiv(12, 'Function form', getMethodParams(prop, true) + getMethodReturnValue(prop))
        )
      }

      if (prop.sync === true) {
        child.push(
          this.getDiv(3, 'Note', 'Required to be used with v-model!')
        )
      }

      if (prop.default !== void 0) {
        child.push(
          this.getDiv(3, 'Default value', JSON.stringify(prop.default))
        )
      }

      if (prop.link === true) {
        child.push(
          this.getDiv(6, 'External link', prop.link)
        )
      }

      if (prop.values !== void 0) {
        child.push(
          this.getDiv(
            12,
            `Accepted values`,
            void 0,
            h(
              'div',
              { class: 'api-row--indent api-row__value' },
              prop.values.map(val => h('div', { class: 'api-row__example' }, val))
            )
          )
        )
      }

      if (prop.definition !== void 0) {
        const nodes = []
        for (const propName in prop.definition) {
          nodes.push(
            this.getProp(prop.definition[propName], propName, 2)
          )
        }

        child.push(
          this.getDiv(
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
            this.getProp(prop.params[propName], propName, newLevel)
          )
        }

        child.push(
          this.getDiv(
            12,
            'Params',
            void 0,
            h('div', { class: 'api-row__subitem' }, nodes)
          )
        )
      }

      if (prop.returns !== void 0 && prop.returns !== null) {
        child.push(
          this.getDiv(
            12,
            `Returns <${getStringType(prop.returns.type)}>`,
            void 0,
            h(
              'div',
              { class: 'api-row__subitem' },
              [ this.getProp(prop.returns, void 0, 0) ]
            )
          )
        )
      }

      if (prop.scope !== void 0) {
        const nodes = []
        for (const propName in prop.scope) {
          nodes.push(
            this.getProp(prop.scope[propName], propName, 1)
          )
        }

        child.push(
          this.getDiv(
            12,
            'Scope',
            void 0,
            h('div', { class: 'api-row__subitem' }, nodes)
          )
        )
      }

      if (prop.examples !== void 0) {
        child.push(
          this.getDiv(
            12,
            `Example${prop.examples.length > 1 ? 's' : ''}`,
            void 0,
            h(
              'div',
              { class: 'api-row--indent api-row__value' },
              prop.examples.map(example => h('div', { class: 'api-row__example' }, example))
            )
          )
        )
      }

      return onlyChildren !== true
        ? h('div', { class: 'api-row row' }, child)
        : child
    },

    props (props) {
      const child = []

      for (const propName in props) {
        child.push(
          this.getProp(props[propName], propName, 0)
        )
      }

      return child
    },

    slots (slots) {
      const child = []

      for (const slot in slots) {
        child.push(
          this.getProp(slots[slot], slot, 0)
        )
      }

      return child
    },

    events (events) {
      const child = []

      if (events === void 0) {
        return child
      }

      for (const eventName in events) {
        const event = events[eventName]
        const params = []

        if (event.params !== void 0) {
          for (const paramName in event.params) {
            params.push(
              this.getProp(event.params[paramName], paramName, 1)
            )
          }
        }
        else {
          params.push(
            h('div', { class: 'text-italic' }, '*None*')
          )
        }

        child.push(
          h('div', { class: 'api-row row' }, [
            this.getDiv(12, 'Name', h(QBadge, {
              color: NAME_PROP_COLOR[0],
              label: `@${eventName}${getEventParams(event)}`
            })),
            event.addedIn !== void 0
              ? this.getDiv(12, 'Added in', event.addedIn)
              : null,
            this.getDiv(12, 'Description', event.desc),
            this.getDiv(12,
              'Parameters',
              void 0,
              h('div', { class: 'api-row__subitem' }, params)
            )
          ])
        )
      }

      return child
    },

    methods (methods) {
      const child = []

      for (const methodName in methods) {
        const method = methods[methodName]

        const nodes = [
          this.getDiv(12, 'Name', h(QBadge, {
            color: NAME_PROP_COLOR[0],
            label: `${methodName}${getMethodParams(method)}${getMethodReturnValue(method)}`
          })),
          method.addedIn !== void 0
            ? this.getDiv(12, 'Added in', method.addedIn)
            : null,
          this.getDiv(12, 'Description', method.desc)
        ]

        if (method.params !== void 0) {
          const props = []
          for (const paramName in method.params) {
            props.push(
              this.getProp(method.params[paramName], paramName, 1)
            )
          }
          nodes.push(
            this.getDiv(
              12,
              'Parameters',
              void 0,
              h('div', { class: 'api-row__subitem' }, props)
            )
          )
        }
        if (method.returns !== void 0) {
          nodes.push(
            this.getDiv(
              12,
              `Returns <${getStringType(method.returns.type)}>`,
              void 0,
              h(
                'div',
                { class: 'api-row__subitem' },
                [ this.getProp(method.returns, void 0, 0) ]
              )
            )
          )
        }

        child.push(
          h('div', { class: 'api-row row' }, nodes)
        )
      }

      return child
    },

    value (value) {
      return [
        h('div', { class: 'api-row row' }, [
          this.getDiv(12, 'Type', getStringType(value.type))
        ].concat(this.getProp(value, void 0, 0, true)))
      ]
    },

    arg (arg) {
      return [
        h('div', { class: 'api-row row' }, [
          this.getDiv(12, 'Type', getStringType(arg.type))
        ].concat(this.getProp(arg, void 0, 0, true)))
      ]
    },

    modifiers (modifiers) {
      const child = []

      for (const modifierName in modifiers) {
        const modifier = modifiers[modifierName]

        child.push(
          h(
            'div',
            { class: 'api-row row' },
            this.getProp(modifier, modifierName, 0, true)
          )
        )
      }

      return child
    },

    injection (injection) {
      return [
        h('div', { class: 'api-row row' }, [
          this.getDiv(12, 'Name', injection)
        ])
      ]
    },

    quasarConfOptions (conf) {
      const child = []

      for (const def in conf.definition) {
        child.push(
          this.getProp(conf.definition[def], def, 0)
        )
      }

      return [
        h('div', { class: 'api-row row' }, [
          this.getDiv(12, 'Property Name', conf.propName),
          conf.addedIn !== void 0
            ? this.getDiv(12, 'Added in', conf.addedIn)
            : null,
          this.getDiv(
            12,
            'Definition',
            void 0,
            h('div', { class: 'api-row__subitem' }, child)
          )
        ])
      ]
    }
  },

  render () {
    const api = this.api[this.apiKey || this.which]

    const content = Object.keys(api).length !== 0
      ? this[this.which](api)
      : [
          h('div', { class: 'q-pa-md text-grey-9' }, [
            h('div', 'No matching entries found on this tab.'),
            h('div', 'Please check the other tabs/subtabs with a number badge on their label or refine the filter.')
          ])
        ]

    return h('div', { class: 'api-rows' }, content)
  }
})
