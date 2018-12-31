import Vue from 'vue'

import { isSSR, fromSSR } from './Platform.js'
import extend from '../utils/extend.js'

let updateId, ssrTakeover

function normalize (meta) {
  if (meta.title) {
    meta.title = meta.titleTemplate
      ? meta.titleTemplate(meta.title || '')
      : meta.title
    delete meta.titleTemplate
  }

  ;[['meta', 'content'], ['link', 'href']].forEach(type => {
    const
      metaType = meta[type[0]],
      metaProp = type[1]

    for (let name in metaType) {
      const metaLink = metaType[name]
      if (metaLink.template) {
        if (Object.keys(metaLink).length === 1) {
          delete metaType[name]
        }
        else {
          metaLink[metaProp] = metaLink.template(metaLink[metaProp] || '')
          delete metaLink.template
        }
      }
    }
  })
}

function changed (old, def) {
  if (Object.keys(old).length !== Object.keys(def).length) {
    return true
  }
  for (let key in old) {
    if (old[key] !== def[key]) { return true }
  }
}

function bodyFilter (name) {
  return !['class', 'style'].includes(name)
}

function htmlFilter (name) {
  return !['lang', 'dir'].includes(name)
}

function diff (meta, other) {
  let add = {}, remove = {}

  if (!meta) {
    return { add: other, remove }
  }

  if (meta.title !== other.title) {
    add.title = other.title
  }

  ;['meta', 'link', 'script', 'htmlAttr', 'bodyAttr'].forEach(type => {
    const old = meta[type], cur = other[type]
    remove[type] = []

    if (!old) {
      add[type] = cur
      return
    }

    add[type] = {}

    for (let key in old) {
      if (!cur.hasOwnProperty(key)) { remove[type].push(key) }
    }
    for (let key in cur) {
      if (!old.hasOwnProperty(key)) { add[type][key] = cur[key] }
      else if (changed(old[key], cur[key])) {
        remove[type].push(key)
        add[type][key] = cur[key]
      }
    }
  })

  return { add, remove }
}

function apply ({ add, remove }) {
  if (add.title) {
    document.title = add.title
  }

  if (Object.keys(remove).length > 0) {
    ['meta', 'link', 'script'].forEach(type => {
      remove[type].forEach(name => {
        document.head.querySelector(`${type}[data-qmeta="${name}"]`).remove()
      })
    })
    remove.htmlAttr.filter(htmlFilter).forEach(name => {
      document.documentElement.removeAttribute(name)
    })
    remove.bodyAttr.filter(bodyFilter).forEach(name => {
      document.body.removeAttribute(name)
    })
  }

  ;['meta', 'link', 'script'].forEach(type => {
    const metaType = add[type]

    for (let name in metaType) {
      const tag = document.createElement(type)
      for (let att in metaType[name]) {
        if (att !== 'innerHTML') {
          tag.setAttribute(att, metaType[name][att])
        }
      }
      tag.setAttribute('data-qmeta', name)
      if (type === 'script') {
        tag.innerHTML = metaType[name].innerHTML || ''
      }
      document.head.appendChild(tag)
    }
  })
  Object.keys(add.htmlAttr).filter(htmlFilter).forEach(name => {
    document.documentElement.setAttribute(name, add.htmlAttr[name] || '')
  })
  Object.keys(add.bodyAttr).filter(bodyFilter).forEach(name => {
    document.body.setAttribute(name, add.bodyAttr[name] || '')
  })
}

function parseMeta (component, meta) {
  if (component._inactive) { return }

  const hasMeta = component.$options.meta
  if (hasMeta) {
    extend(true, meta, component.__qMeta)
    if (hasMeta.stopPropagation) { return }
  }

  component.$children && component.$children.forEach(child => {
    parseMeta(child, meta)
  })
}

function updateClient () {
  if (ssrTakeover) {
    ssrTakeover = false
    this.$root.__currentMeta = window.__Q_META__
    document.body.querySelector('script[data-qmeta-init]').remove()
    return
  }

  const meta = {
    title: '',
    titleTemplate: null,
    meta: {},
    link: {},
    script: {},
    htmlAttr: {},
    bodyAttr: {}
  }
  parseMeta(this.$root, meta)
  normalize(meta)

  apply(diff(this.$root.__currentMeta, meta))
  this.$root.__currentMeta = meta
}

function getAttr (seed) {
  return att => {
    const val = seed[att]
    return att + (val !== void 0 ? `="${val}"` : '')
  }
}

function getHead (meta) {
  let output = ''
  if (meta.title) {
    output += `<title>${meta.title}</title>`
  }
  ;['meta', 'link', 'script'].forEach(type => {
    const metaType = meta[type]

    for (let att in metaType) {
      const attrs = Object.keys(metaType[att])
        .filter(att => att !== 'innerHTML')
        .map(getAttr(metaType[att]))

      output += `<${type} ${attrs.join(' ')} data-qmeta="${att}">`
      if (type === 'script') {
        output += (metaType[att].innerHTML || '') + `</script>`
      }
    }
  })
  return output
}

function getServerMeta (app, html) {
  const meta = {
    title: '',
    titleTemplate: null,
    meta: {},
    link: {},
    htmlAttr: {},
    bodyAttr: {},
    noscript: {}
  }

  parseMeta(app, meta)
  normalize(meta)

  const tokens = {
    '%%Q_HTML_ATTRS%%': Object.keys(meta.htmlAttr)
      .filter(htmlFilter)
      .map(getAttr(meta.htmlAttr))
      .join(' '),
    '%%Q_HEAD_TAGS%%': getHead(meta),
    '%%Q_BODY_ATTRS%%': Object.keys(meta.bodyAttr)
      .filter(bodyFilter)
      .map(getAttr(meta.bodyAttr))
      .join(' '),
    '%%Q_BODY_TAGS%%': Object.keys(meta.noscript)
      .map(name => `<noscript data-qmeta="${name}">${meta.noscript[name]}</noscript>`)
      .join('') +
      `<script data-qmeta-init>window.__Q_META__=${delete meta.noscript && JSON.stringify(meta)}</script>`
  }

  Object.keys(tokens).forEach(key => {
    html = html.replace(key, tokens[key])
  })

  return html
}

function beforeCreate () {
  if (this.$options.meta) {
    if (typeof this.$options.meta === 'function') {
      if (!this.$options.computed) {
        this.$options.computed = {}
      }
      this.$options.computed.__qMeta = this.$options.meta
    }
    else {
      this.__qMeta = this.$options.meta
    }
  }
}

function triggerMeta () {
  this.$options.meta && this.__qMetaUpdate()
}

export default {
  install ({ queues }) {
    if (isSSR) {
      Vue.prototype.$getMetaHTML = app => html => getServerMeta(app, html)
      Vue.mixin({ beforeCreate })

      queues.server.push((q, ctx) => {
        ctx.ssr.Q_HTML_ATTRS += ' %%Q_HTML_ATTRS%%'
        Object.assign(ctx.ssr, {
          Q_HEAD_TAGS: '%%Q_HEAD_TAGS%%',
          Q_BODY_ATTRS: '%%Q_BODY_ATTRS%%',
          Q_BODY_TAGS: '%%Q_BODY_TAGS%%'
        })
      })
    }
    else {
      ssrTakeover = fromSSR

      Vue.mixin({
        beforeCreate,
        created () {
          if (this.$options.meta) {
            this.__qMetaUnwatch = this.$watch('__qMeta', this.__qMetaUpdate)
          }
        },
        activated: triggerMeta,
        deactivated: triggerMeta,
        beforeMount: triggerMeta,
        destroyed () {
          if (this.$options.meta) {
            this.__qMetaUnwatch()
            this.__qMetaUpdate()
          }
        },
        methods: {
          __qMetaUpdate () {
            clearTimeout(updateId)
            updateId = setTimeout(updateClient.bind(this), 50)
          }
        }
      })
    }
  }
}
