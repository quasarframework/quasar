import './ApiRows.styl'

/*
function getEventParams (event) {
  const params = event.params === void 0 || event.params.length === 0
    ? ''
    : Object.keys(event.params).join(', ')

  return ' -> function(' + params + ')'
}
*/

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
    api: Object,
    apiType: String
  },

  methods: {
    getDiv (h, col, propName, propValue) {
      return h('div', { staticClass: `api-row__item col-${col}` }, [
        h('div', [ propName ]),
        Array.isArray(propValue)
          ? h('div', { staticClass: 'text-weight-light' }, propValue)
          : h('div', { staticClass: 'text-weight-light' }, [ propValue ])
      ])
    },

    getProp (h, prop, propName) {
      const type = getStringType(prop.type)
      const child = []

      if (propName !== void 0) {
        child.push(
          this.getDiv(h, 3, 'Name', propName)
        )

        if (type !== void 0) {
          child.push(
            this.getDiv(h, 6, 'Type', type)
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
        child.push(
          this.getDiv(h, 12, 'Definition', 'Definition')
        )
      }

      if (prop.params !== void 0) {
        child.push(
          this.getDiv(h, 12, 'Params', 'Params')
        )
      }

      if (prop.returns !== void 0) {
        child.push(
          this.getDiv(h, 12, 'Returns', 'Returns')
        )
      }

      if (prop.scope !== void 0) {
        child.push(
          this.getDiv(h, 12, 'Scope', 'Scope')
        )
      }

      if (prop.values === void 0 && prop.examples !== void 0) {
        child.push(
          this.getDiv(h, 12,
            `Example${prop.examples.length > 1 ? 's' : ''}`,
            prop.examples.map(example => h('div', [ example ]))
          )
        )
      }

      return h('div', { staticClass: 'api-row row' }, child)
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
      return [ h('div') ]
    },

    scopedSlots (h) {
      return [ h('div') ]
    },

    events (h) {
      return [ h('div') ]
    },

    methods (h) {
      return [ h('div') ]
    },

    value (h) {
      return [ h('div') ]
    },

    arg (h) {
      return [ h('div') ]
    },

    modifiers (h) {
      return [ h('div') ]
    },

    injection (h) {
      return [ h('div') ]
    },

    quasarConfOptions (h) {
      return [ h('div') ]
    }
  },

  render (h) {
    return h('div', { staticClass: 'overflow-hidden' }, this[this.which](h))
  }
}
