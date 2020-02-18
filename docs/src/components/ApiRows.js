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

export default {
  name: 'ApiRows',

  props: {
    which: String,
    apiKey: String,
    api: Object
  },

  methods: {
    getDiv (h, col, propName, propValue, slot) {
      return h('div', { staticClass: `api-row__item col-xs-12 col-sm-${col}` }, [
        h('div', [ propName ]),
        propValue !== void 0
          ? h('div', { staticClass: 'api-row__value' }, [ propValue ])
          : slot
      ])
    },

    getProp (h, prop, propName, level, onlyChildren) {
      const type = getStringType(prop.type)
      const child = []

      if (propName !== void 0) {
        child.push(
          this.getDiv(h, 4, 'Name', h(QBadge, {
            props: {
              color: NAME_PROP_COLOR[level],
              label: propName
            }
          }))
        )

        if (type !== void 0) {
          child.push(
            this.getDiv(h, 4, 'Type', type)
          )
        }

        if (type !== 'Function' && prop.required === true) {
          child.push(
            this.getDiv(h, 3, 'Required', 'yes')
          )
        }

        if (prop.reactive === true) {
          child.push(
            this.getDiv(h, 3, 'Reactive', 'yes')
          )
        }
      }

      if (prop.addedIn !== void 0) {
        child.push(
          this.getDiv(h, 12, 'Added in', prop.addedIn)
        )
      }

      child.push(
        this.getDiv(h, 12, 'Description', prop.desc)
      )

      if (type === 'Function') {
        child.push(
          this.getDiv(h, 12, 'Function form', getMethodParams(prop, true) + getMethodReturnValue(prop))
        )
      }

      if (prop.sync === true) {
        child.push(
          this.getDiv(h, 3, 'Note', '".sync" modifier required!')
        )
      }

      if (prop.default !== void 0) {
        child.push(
          this.getDiv(h, 3, 'Default value', JSON.stringify(prop.default))
        )
      }

      if (prop.link === true) {
        child.push(
          this.getDiv(h, 6, 'External link', prop.link)
        )
      }

      if (prop.values !== void 0) {
        child.push(
          this.getDiv(h, 12,
            `Accepted values`,
            void 0,
            h(
              'div',
              { staticClass: 'api-row--indent api-row__value' },
              prop.values.map(val => h('div', {
                staticClass: 'api-row__example'
              }, [ val ]))
            )
          )
        )
      }

      if (prop.definition !== void 0) {
        const nodes = []
        for (const propName in prop.definition) {
          nodes.push(
            this.getProp(h, prop.definition[propName], propName, 2)
          )
        }

        child.push(
          this.getDiv(h, 12,
            'Props',
            void 0,
            h(
              'div',
              { staticClass: 'api-row__subitem' },
              nodes
            )
          )
        )
      }

      if (prop.params !== void 0 && prop.params !== null) {
        const
          nodes = [],
          newLevel = (level + 1) % NAME_PROP_COLOR.length

        for (const propName in prop.params) {
          nodes.push(
            this.getProp(h, prop.params[propName], propName, newLevel)
          )
        }

        child.push(
          this.getDiv(h, 12,
            'Params',
            void 0,
            h(
              'div',
              { staticClass: 'api-row__subitem' },
              nodes
            )
          )
        )
      }

      if (prop.returns !== void 0 && prop.returns !== null) {
        child.push(
          this.getDiv(h, 12,
            `Returns <${getStringType(prop.returns.type)}>`,
            void 0,
            h(
              'div',
              { staticClass: 'api-row__subitem' },
              [ this.getProp(h, prop.returns, void 0, 0) ]
            )
          )
        )
      }

      if (prop.scope !== void 0) {
        const nodes = []
        for (const propName in prop.scope) {
          nodes.push(
            this.getProp(h, prop.scope[propName], propName, 1)
          )
        }

        child.push(
          this.getDiv(h, 12,
            'Scope',
            void 0,
            h(
              'div',
              { staticClass: 'api-row__subitem' },
              nodes
            )
          )
        )
      }

      if (prop.examples !== void 0) {
        child.push(
          this.getDiv(h, 12,
            `Example${prop.examples.length > 1 ? 's' : ''}`,
            void 0,
            h(
              'div',
              { staticClass: 'api-row--indent api-row__value' },
              prop.examples.map(example => h('div', {
                staticClass: 'api-row__example'
              }, [ example ]))
            )
          )
        )
      }

      return onlyChildren !== true
        ? h('div', { staticClass: 'api-row row' }, child)
        : child
    },

    props (h, props) {
      const child = []

      for (const propName in props) {
        child.push(
          this.getProp(h, props[propName], propName, 0)
        )
      }

      return child
    },

    slots (h, slots) {
      const child = []

      for (const slot in slots) {
        child.push(
          h('div', { staticClass: 'api-row row' }, [
            this.getDiv(h, 12, 'Name', h(QBadge, {
              props: {
                color: NAME_PROP_COLOR[0],
                label: slot
              }
            })),
            slots[slot].addedIn !== void 0
              ? this.getDiv(h, 12, 'Added in', slots[slot].addedIn)
              : null,
            this.getDiv(h, 12, 'Description', slots[slot].desc)
          ])
        )
      }

      return child
    },

    scopedSlots (h, scopedSlots) {
      const child = []

      for (const slot in scopedSlots) {
        child.push(
          this.getProp(h, scopedSlots[slot], slot, 0)
        )
      }

      return child
    },

    events (h, { $listeners, ...events }) {
      const child = []

      if ($listeners !== void 0) {
        child.push(
          h('div', { staticClass: 'api-row api-row__value api-row--big-padding' }, [
            $listeners.desc
          ])
        )
      }

      if (events === void 0) {
        return child
      }

      for (const eventName in events) {
        const event = events[eventName]
        const params = []

        if (event.params !== void 0) {
          for (const paramName in event.params) {
            params.push(
              this.getProp(h, event.params[paramName], paramName, 1)
            )
          }
        }
        else {
          params.push(
            h('div', { staticClass: 'text-italic' }, '*None*')
          )
        }

        child.push(
          h('div', { staticClass: 'api-row row' }, [
            this.getDiv(h, 12, 'Name', h(QBadge, {
              props: {
                color: NAME_PROP_COLOR[0],
                label: `@${eventName}${getEventParams(event)}`
              }
            })),
            event.addedIn !== void 0
              ? this.getDiv(h, 12, 'Added in', event.addedIn)
              : null,
            this.getDiv(h, 12, 'Description', event.desc),
            this.getDiv(h, 12,
              'Parameters',
              void 0,
              h(
                'div',
                { staticClass: 'api-row__subitem' },
                params
              )
            )
          ])
        )
      }

      return child
    },

    methods (h, methods) {
      const child = []

      for (const methodName in methods) {
        const method = methods[methodName]

        const nodes = [
          this.getDiv(h, 12, 'Name', h(QBadge, {
            props: {
              color: NAME_PROP_COLOR[0],
              label: `${methodName}${getMethodParams(method)}${getMethodReturnValue(method)}`
            }
          })),
          method.addedIn !== void 0
            ? this.getDiv(h, 12, 'Added in', method.addedIn)
            : null,
          this.getDiv(h, 12, 'Description', method.desc)
        ]

        if (method.params !== void 0) {
          const props = []
          for (const paramName in method.params) {
            props.push(
              this.getProp(h, method.params[paramName], paramName, 1)
            )
          }
          nodes.push(
            this.getDiv(h, 12,
              'Parameters',
              void 0,
              h(
                'div',
                { staticClass: 'api-row__subitem' },
                props
              )
            )
          )
        }
        if (method.returns !== void 0) {
          nodes.push(
            this.getDiv(h, 12,
              `Returns <${getStringType(method.returns.type)}>`,
              void 0,
              h(
                'div',
                { staticClass: 'api-row__subitem' },
                [ this.getProp(h, method.returns, void 0, 0) ]
              )
            )
          )
        }

        child.push(
          h('div', { staticClass: 'api-row row' }, nodes)
        )
      }

      return child
    },

    value (h, value) {
      return [
        h('div', { staticClass: 'api-row row' }, [
          this.getDiv(h, 12, 'Type', getStringType(value.type))
        ].concat(this.getProp(h, value, void 0, 0, true)))
      ]
    },

    arg (h, arg) {
      return [
        h('div', { staticClass: 'api-row row' }, [
          this.getDiv(h, 12, 'Type', getStringType(arg.type))
        ].concat(this.getProp(h, arg, void 0, 0, true)))
      ]
    },

    modifiers (h, modifiers) {
      const child = []

      for (const modifierName in modifiers) {
        const modifier = modifiers[modifierName]

        child.push(
          h(
            'div',
            { staticClass: 'api-row row' },
            this.getProp(h, modifier, modifierName, 0, true)
          )
        )
      }

      return child
    },

    injection (h, injection) {
      return [
        h('div', { staticClass: 'api-row row' }, [
          this.getDiv(h, 12, 'Name', injection)
        ])
      ]
    },

    quasarConfOptions (h, conf) {
      const child = []

      for (const def in conf.definition) {
        child.push(
          this.getProp(h, conf.definition[def], def, 0)
        )
      }

      return [
        h('div', { staticClass: 'api-row row' }, [
          this.getDiv(h, 12, 'Property Name', conf.propName),
          conf.addedIn !== void 0
            ? this.getDiv(h, 12, 'Added in', conf.addedIn)
            : null,
          this.getDiv(h, 12,
            'Definition',
            void 0,
            h(
              'div',
              { staticClass: 'api-row__subitem' },
              child
            )
          )
        ])
      ]
    }
  },

  render (h) {
    const api = this.api[this.apiKey || this.which]

    const content = Object.keys(api).length !== 0
      ? this[this.which](h, api)
      : [
        h('div', { staticClass: 'q-pa-md text-grey-9' }, [
          h('div', [ 'No matching entries found on this tab.' ]),
          h('div', [ 'Please check the other tabs/subtabs with a number badge on their label or refine the filter.' ])
        ])
      ]

    return h('div', { staticClass: 'api-rows' }, content)
  }
}
