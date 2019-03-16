import Vue from 'vue'

let inject
const portals = []

function fillInject (root) {
  const
    options = (new Vue()).$root.$options,
    skip = ['el', 'created', 'activated', 'deactivated', 'beforeMount', 'methods', 'mounted', 'render', 'mixins']
      .concat(Object.keys(options).filter(key => options[key] !== null))

  inject = {}

  Object.keys(root)
    .filter(name => skip.includes(name) === false)
    .forEach(p => {
      inject[p] = root[p]
    })
}

function hideMultiple (ev, levels) {
  levels = parseInt(levels, 10)

  let index = portals.length - 1
  if (index === -1) {
    return
  }

  let type = portals[index].type

  while (levels > 0 && index !== -1) {
    console.log('LEVEL', levels, index)
    if (type === 'QMenu') {
      let last
      while (portals[index].type === type) {
        last = portals[index]
        index--
        if (index === -1) {
          last !== void 0 && last.hide(ev)
          console.log('LEVEL reached end', levels, index)
          return
        }
      }
      console.log('LEVEL removing menu')
      last !== void 0 && last.hide(ev)
      levels--
      type = portals[index].type
      continue
    }

    console.log('LEVEL removing dialog')
    type = portals[index].type
    portals[index].hide(ev)
    index--
    levels--
  }
}

export default {
  inheritAttrs: false,

  props: {
    contentClass: [Array, String, Object],
    contentStyle: [Array, String, Object]
  },

  methods: {
    __showPortal (push) {
      if (this.__portal !== void 0 && this.__portal.showing !== true) {
        push === true && portals.push({
          type: this.$options.name,
          hide: this.hide
        })
        console.log('pushing', this.$options.name, portals.length)
        document.body.appendChild(this.__portal.$el)
        this.__portal.showing = true
      }
    },

    __removePortal () {
      if (this.__portal !== void 0 && this.__portal.showing === true) {
        console.log('remo...')
        const index = portals.findIndex(c => c.hide === this.hide)

        if (index > -1) {
          portals.splice(index, portals.length - index)
            .reverse()
            .forEach(item => {
              console.log('removing', item.type)
              item.hide()
            })
          console.log('removed', portals.length)
        }
      }
    },

    __hidePortal () {
      if (this.__portal !== void 0 && this.__portal.showing === true) {
        this.__portal.$el.remove()
        this.__portal.showing = false
      }
    }
  },

  render () {
    this.__portal !== void 0 && this.__portal.$forceUpdate()
  },

  beforeMount () {
    if (inject === void 0) {
      fillInject(this.$root.$options)
    }

    this.__portal = new Vue({
      ...inject,

      render: h => this.__render(h),

      components: this.$options.components,
      directives: this.$options.directives,

      methods: {
        __qClosePopup: hideMultiple
      }
    }).$mount()
  },

  beforeDestroy () {
    this.__portal.$destroy()
    this.__portal.$el.remove()
    this.__portal = void 0
  }
}
