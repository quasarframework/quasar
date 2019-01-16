import './ApiRows.styl'

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

export default {
  name: 'ApiRows',

  props: {
    which: String,
    api: Object
  },

  methods: {
    getDiv (h, col, propName, propValue, slot) {
      return h('div', { staticClass: `api-row__item col-xs-12 col-sm-${col}` }, [
        h('div', [ propName ]),
        propValue !== void 0
          ? h('div', { staticClass: ' api-row__value' }, [ propValue ])
          : slot
      ])
    },

    getProp (h, prop, propName, onlyChildren) {
      const type = getStringType(prop.type)
      const child = []

      if (propName !== void 0) {
        child.push(
          this.getDiv(h, 4, 'Name', propName)
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
          this.getDiv(h, 12, 'Accepted values', `${prop.values.join(` | `)}`)
        )
      }

      if (prop.definition !== void 0) {
        const nodes = []
        for (let propName in prop.definition) {
          nodes.push(
            this.getProp(h, prop.definition[propName], propName)
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
        const nodes = []
        for (let propName in prop.params) {
          nodes.push(
            this.getProp(h, prop.params[propName], propName)
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
              [ this.getProp(h, prop.returns, void 0) ]
            )
          )
        )
      }

      if (prop.scope !== void 0) {
        const nodes = []
        for (let propName in prop.scope) {
          nodes.push(
            this.getProp(h, prop.scope[propName], propName)
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

      if (prop.values === void 0 && prop.examples !== void 0) {
        child.push(
          this.getDiv(h, 12,
            `Example${prop.examples.length > 1 ? 's' : ''}`,
            void 0,
            h(
              'div',
              { staticClass: 'api-row--indent api-row__value' },
              prop.examples.map(example => h('div', [ example ]))
            )
          )
        )
      }

      return onlyChildren !== true
        ? h('div', { staticClass: 'api-row row' }, child)
        : child
    },

    props (h) {
      const props = this.api.props
      const child = []

      for (let propName in props) {
        child.push(
          this.getProp(h, props[propName], propName)
        )
      }

      return child
    },

    slots (h) {
      const slots = this.api.slots
      const child = []

      for (let slot in slots) {
        child.push(
          h('div', { staticClass: 'api-row row' }, [
            this.getDiv(h, 12, 'Name', slot),
            this.getDiv(h, 12, 'Description', slots[slot].desc)
          ])
        )
      }

      return child
    },

    scopedSlots (h) {
      const scopedSlots = this.api.scopedSlots
      const child = []

      for (let slot in scopedSlots) {
        child.push(
          this.getProp(h, scopedSlots[slot], slot)
        )
      }

      return child
    },

    events (h) {
      const events = this.api.events
      const child = []

      for (let eventName in events) {
        const event = events[eventName]
        const params = []

        if (event.params !== void 0) {
          for (let paramName in event.params) {
            params.push(
              this.getProp(h, event.params[paramName], paramName)
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
            this.getDiv(h, 12, 'Name', `@${eventName}${getEventParams(event)}`),
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

    methods (h) {
      const methods = this.api.methods
      const child = []

      for (let methodName in methods) {
        const method = methods[methodName]

        const nodes = [
          this.getDiv(h, 12, 'Name', `@${methodName}${getMethodParams(method)}${getMethodReturnValue(method)}`),
          this.getDiv(h, 12, 'Description', method.desc)
        ]

        if (method.params !== void 0) {
          const props = []
          for (let paramName in method.params) {
            props.push(
              this.getProp(h, method.params[paramName], paramName)
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
                [ this.getProp(h, method.returns, void 0) ]
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

    value (h) {
      return [
        h('div', { staticClass: 'api-row row' }, [
          this.getDiv(h, 12, 'Type', getStringType(this.api.value.type))
        ].concat(this.getProp(h, this.api.value, void 0, true)))
      ]
    },

    arg (h) {
      return [
        h('div', { staticClass: 'api-row row' }, [
          this.getDiv(h, 12, 'Type', getStringType(this.api.arg.type))
        ].concat(this.getProp(h, this.api.arg, void 0, true)))
      ]
    },

    modifiers (h) {
      const modifiers = this.api.modifiers
      const child = []

      for (let modifierName in modifiers) {
        const modifier = modifiers[modifierName]

        child.push(
          h(
            'div',
            { staticClass: 'api-row row' },
            [
              this.getDiv(h, 12, 'Name', modifierName)
            ].concat(this.getProp(h, modifier, void 0, true))
          )
        )
      }

      return child
    },

    injection (h) {
      return [
        h('div', { staticClass: 'api-row row' }, [
          this.getDiv(h, 12, 'Name', this.api.injection)
        ])
      ]
    },

    quasarConfOptions (h) {
      const conf = this.api.quasarConfOptions
      const child = []

      for (let def in conf.definition) {
        child.push(
          this.getProp(h, conf.definition[def], def)
        )
      }

      return [
        h('div', { staticClass: 'api-row row' }, [
          this.getDiv(h, 12, 'Property Name', conf.propName),
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
    return h('div', { staticClass: 'api-rows' }, this[this.which](h))
  }
}
