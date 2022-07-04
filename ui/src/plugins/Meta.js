import Vue from 'vue'

import { isSSR, fromSSR } from './Platform.js'
import extend from '../utils/extend.js'

let updateId, ssrTakeover

function normalize (meta) {
  if (meta.title) {
    meta.title = meta.titleTemplate
      ? meta.titleTemplate(meta.title)
      : meta.title
    delete meta.titleTemplate
  }

  ;[['meta', 'content'], ['link', 'href']].forEach(type => {
    const
      metaType = meta[type[0]],
      metaProp = type[1]

    for (const name in metaType) {
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
  for (const key in old) {
    if (old[key] !== def[key]) {
      return true
    }
  }
}

function bodyFilter (name) {
  return ['class', 'style'].includes(name) === false
}

function htmlFilter (name) {
  return ['lang', 'dir'].includes(name) === false
}

function diff (meta, other) {
  const add = {}, remove = {}

  if (meta === void 0) {
    return { add: other, remove }
  }

  if (meta.title !== other.title) {
    add.title = other.title
  }

  ;['meta', 'link', 'script', 'htmlAttr', 'bodyAttr'].forEach(type => {
    const old = meta[type], cur = other[type]
    remove[type] = []

    if (old === void 0 || old === null) {
      add[type] = cur
      return
    }

    add[type] = {}

    for (const key in old) {
      if (cur.hasOwnProperty(key) === false) {
        remove[type].push(key)
      }
    }
    for (const key in cur) {
      if (old.hasOwnProperty(key) === false) {
        add[type][key] = cur[key]
      }
      else if (changed(old[key], cur[key]) === true) {
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

    for (const name in metaType) {
      const tag = document.createElement(type)
      for (const att in metaType[name]) {
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
  if (component._inactive === true) { return }

  // if it has meta
  if (hasMeta(component) === true) {
    extend(true, meta, component.__qMeta)

    if (component.$options.meta.stopPropagation === true) {
      return
    }
  }

  component.$children.forEach(child => {
    parseMeta(child, meta)
  })
}

function updateClient () {
  if (ssrTakeover === true) {
    ssrTakeover = false
    this.$root.__currentMeta = window.__Q_META__
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
    return att + (val !== true && val !== void 0 ? `="${val}"` : '')
  }
}

function getHead (meta) {
  let output = ''
  if (meta.title) {
    output += `<title>${meta.title}</title>`
  }
  ;['meta', 'link', 'script'].forEach(type => {
    const metaType = meta[type]

    for (const att in metaType) {
      const attrs = Object.keys(metaType[att])
        .filter(att => att !== 'innerHTML')
        .map(getAttr(metaType[att]))

      output += `<${type} ${attrs.join(' ')} data-qmeta="${att}">`
      if (type === 'script') {
        output += `${metaType[att].innerHTML || ''}</script>`
      }
    }
  })
  return output
}

function getServerMeta (app, html, ctx) {
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

  const nonce = ctx !== void 0 && ctx.nonce !== void 0
    ? ` nonce="${ctx.nonce}"`
    : ''

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
      `<script${nonce}>window.__Q_META__=${delete meta.noscript && JSON.stringify(meta)}</script>`
  }

  Object.keys(tokens).forEach(key => {
    html = html.replace(key, tokens[key])
  })

  return html
}

function beforeCreate () {
  if (typeof this.$options.meta === 'function') {
    if (this.$options.computed === void 0) {
      this.$options.computed = {}
    }
    this.$options.computed.__qMeta = this.$options.meta
  }
  else if (hasMeta(this) === true) {
    this.__qMeta = this.$options.meta
  }
}

// needs to be really fast
function hasMeta (vm) {
  return vm.$options.meta !== void 0 &&
    vm.$options.meta !== null
}

function triggerMeta () {
  hasMeta(this) === true && this.__qMetaUpdate()
}

export default {
  install ({ queues }) {
    if (isSSR === true) {
      Vue.prototype.$getMetaHTML = app => {
        return (html, ctx) => getServerMeta(app, html, ctx)
      }

      Vue.mixin({ beforeCreate })

      queues.server.push((_, ctx) => {
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
          if (hasMeta(this) === true) {
            this.__qMetaUnwatch = this.$watch('__qMeta', this.__qMetaUpdate)
          }
        },
        activated: triggerMeta,
        deactivated: triggerMeta,
        beforeMount: triggerMeta,
        destroyed () {
          if (hasMeta(this) === true) {
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
