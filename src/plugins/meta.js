import { isSSR, fromSSR } from './platform.js'
import extend from '../utils/extend.js'

let updateId, ssrTakeover

function normalize (meta) {
  if (meta.title) {
    meta.title = meta.titleTemplate
      ? meta.titleTemplate(meta.title || '')
      : meta.title
    delete meta.titleTemplate
  }

  [['tags', 'content'], ['links', 'href']].forEach(type => {
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
  if (Object.keys(old).length !== Object.keys(def).length) { return true }
  for (let key in old) {
    if (old[key] !== def[key]) { return true }
  }
}

function diff (meta, other) {
  let add = {}, remove = {}

  if (!meta) {
    return { add: other, remove }
  }

  if (meta.title !== other.title) {
    add.title = other.title
  }

  ;['tags', 'links', 'htmlAttrs', 'bodyAttrs'].forEach(type => {
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
    remove.tags.forEach(name => {
      document.head.querySelector(`meta[data-qmeta="${name}"]`).remove()
    })
    remove.links.forEach(name => {
      document.head.querySelector(`link[data-qmeta="${name}"]`).remove()
    })
    remove.htmlAttrs.forEach(name => {
      document.documentElement.removeAttribute(name)
    })
    remove.bodyAttrs.forEach(name => {
      document.body.removeAttribute(name)
    })
  }

  ;[['tags', 'meta'], ['links', 'link']].forEach(type => {
    const
      metaType = add[type[0]],
      tagName = type[1]

    for (let name in metaType) {
      const tag = document.createElement(tagName)
      for (let att in metaType[name]) {
        tag.setAttribute(att, metaType[name][att])
      }
      tag.setAttribute('data-qmeta', name)
      document.head.appendChild(tag)
    }
  })
  Object.keys(add.htmlAttrs).forEach(name => {
    document.documentElement.setAttribute(name, add.htmlAttrs[name] || '')
  })
  Object.keys(add.bodyAttrs).forEach(name => {
    document.body.setAttribute(name, add.bodyAttrs[name] || '')
  })
}

function merge (main, { title, titleTemplate, ...other }) {
  title && (main.title = title)
  titleTemplate && (main.titleTemplate = titleTemplate)

  extend(true, main, other)
}

function parseMeta (component, meta) {
  if (component._inactive) { return }

  const hasMeta = component.$options.meta
  if (hasMeta) {
    merge(meta, component.__qMeta)
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
    tags: {},
    links: {},
    htmlAttrs: {},
    bodyAttrs: {}
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
  ;[['tags', 'meta'], ['links', 'link']].forEach(type => {
    const
      metaType = meta[type[0]],
      tag = type[1]

    for (let att in metaType) {
      const attrs = Object.keys(metaType[att]).map(getAttr(metaType[att]))
      output += `<${tag} ${attrs.join(' ')} data-qmeta="${att}">`
    }
  })
  return output
}

function getServerMeta (app, html) {
  const meta = {
    title: '',
    titleTemplate: null,
    tags: {},
    links: {},
    htmlAttrs: {},
    bodyAttrs: {},
    noscripts: {}
  }

  parseMeta(app, meta)
  normalize(meta)

  const tokens = {
    '%%Q_HTML_ATTRS%%': Object.keys(meta.htmlAttrs)
      .filter(name => !['lang', 'dir'].includes(name))
      .map(getAttr(meta.htmlAttrs))
      .join(' '),
    '%%Q_HEAD_TAGS%%': getHead(meta),
    '%%Q_BODY_ATTRS%%': Object.keys(meta.bodyAttrs)
      .filter(name => name !== 'class')
      .map(getAttr(meta.bodyAttrs))
      .join(' '),
    '%%Q_BODY_TAGS%%': Object.keys(meta.noscripts)
      .map(name => `<noscript data-qmeta="${name}">${meta.noscripts[name]}</noscript>`)
      .join('') +
      `<script data-qmeta-init>window.__Q_META__=${delete meta.noscripts && JSON.stringify(meta)}</script>`
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
  install ({ queues, Vue }) {
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
        // ssr.Q_BODY_CLASSES
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
