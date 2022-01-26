import { isRuntimeSsrPreHydration } from './Platform.js'
import extend from '../utils/extend.js'

let updateId, currentClientMeta
export const clientList = []

function normalize (meta) {
  if (meta.title) {
    meta.title = meta.titleTemplate
      ? meta.titleTemplate(meta.title)
      : meta.title
    delete meta.titleTemplate
  }

  ;[ [ 'meta', 'content' ], [ 'link', 'href' ] ].forEach(type => {
    const
      metaType = meta[ type[ 0 ] ],
      metaProp = type[ 1 ]

    for (const name in metaType) {
      const metaLink = metaType[ name ]

      if (metaLink.template) {
        if (Object.keys(metaLink).length === 1) {
          delete metaType[ name ]
        }
        else {
          metaLink[ metaProp ] = metaLink.template(metaLink[ metaProp ] || '')
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
    if (old[ key ] !== def[ key ]) {
      return true
    }
  }
}

function bodyFilter (name) {
  return [ 'class', 'style' ].includes(name) === false
}

function htmlFilter (name) {
  return [ 'lang', 'dir' ].includes(name) === false
}

function diff (meta, other) {
  const add = {}, remove = {}

  if (meta === void 0) {
    return { add: other, remove }
  }

  if (meta.title !== other.title) {
    add.title = other.title
  }

  ;[ 'meta', 'link', 'script', 'htmlAttr', 'bodyAttr' ].forEach(type => {
    const old = meta[ type ], cur = other[ type ]
    remove[ type ] = []

    if (old === void 0 || old === null) {
      add[ type ] = cur
      return
    }

    add[ type ] = {}

    for (const key in old) {
      if (cur.hasOwnProperty(key) === false) {
        remove[ type ].push(key)
      }
    }
    for (const key in cur) {
      if (old.hasOwnProperty(key) === false) {
        add[ type ][ key ] = cur[ key ]
      }
      else if (changed(old[ key ], cur[ key ]) === true) {
        remove[ type ].push(key)
        add[ type ][ key ] = cur[ key ]
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
    [ 'meta', 'link', 'script' ].forEach(type => {
      remove[ type ].forEach(name => {
        document.head.querySelector(`${ type }[data-qmeta="${ name }"]`).remove()
      })
    })
    remove.htmlAttr.filter(htmlFilter).forEach(name => {
      document.documentElement.removeAttribute(name)
    })
    remove.bodyAttr.filter(bodyFilter).forEach(name => {
      document.body.removeAttribute(name)
    })
  }

  ;[ 'meta', 'link', 'script' ].forEach(type => {
    const metaType = add[ type ]

    for (const name in metaType) {
      const tag = document.createElement(type)
      for (const att in metaType[ name ]) {
        if (att !== 'innerHTML') {
          tag.setAttribute(att, metaType[ name ][ att ])
        }
      }
      tag.setAttribute('data-qmeta', name)
      if (type === 'script') {
        tag.innerHTML = metaType[ name ].innerHTML || ''
      }
      document.head.appendChild(tag)
    }
  })
  Object.keys(add.htmlAttr).filter(htmlFilter).forEach(name => {
    document.documentElement.setAttribute(name, add.htmlAttr[ name ] || '')
  })
  Object.keys(add.bodyAttr).filter(bodyFilter).forEach(name => {
    document.body.setAttribute(name, add.bodyAttr[ name ] || '')
  })
}

function getAttr (seed) {
  return att => {
    const val = seed[ att ]
    return att + (val !== void 0 ? `="${ val }"` : '')
  }
}

function getHead (meta) {
  let output = ''
  if (meta.title) {
    output += `<title>${ meta.title }</title>`
  }
  ;[ 'meta', 'link', 'script' ].forEach(type => {
    const metaType = meta[ type ]

    for (const att in metaType) {
      const attrs = Object.keys(metaType[ att ])
        .filter(att => att !== 'innerHTML')
        .map(getAttr(metaType[ att ]))

      output += `<${ type } ${ attrs.join(' ') } data-qmeta="${ att }">`
      if (type === 'script') {
        output += (metaType[ att ].innerHTML || '') + '</script>'
      }
    }
  })
  return output
}

function injectServerMeta (ssrContext) {
  const data = {
    title: '',
    titleTemplate: null,
    meta: {},
    link: {},
    htmlAttr: {},
    bodyAttr: {},
    noscript: {}
  }

  const list = ssrContext.__qMetaList

  for (let i = 0; i < list.length; i++) {
    extend(true, data, list[ i ])
  }

  normalize(data)

  const nonce = ssrContext.nonce !== void 0
    ? ` nonce="${ ssrContext.nonce }"`
    : ''

  const ctx = ssrContext._meta

  const htmlAttr = Object.keys(data.htmlAttr).filter(htmlFilter)

  if (htmlAttr.length > 0) {
    ctx.htmlAttrs += (
      (ctx.htmlAttrs.length > 0 ? ' ' : '')
      + htmlAttr.map(getAttr(data.htmlAttr)).join(' ')
    )
  }

  ctx.headTags += getHead(data)

  const bodyAttr = Object.keys(data.bodyAttr).filter(bodyFilter)

  if (bodyAttr.length > 0) {
    ctx.bodyAttrs += (
      (ctx.bodyAttrs.length > 0 ? ' ' : '')
      + bodyAttr.map(getAttr(data.bodyAttr)).join(' ')
    )
  }

  ctx.bodyTags += Object.keys(data.noscript)
    .map(name => `<noscript data-qmeta="${ name }">${ data.noscript[ name ] }</noscript>`)
    .join('')
    + `<script${ nonce } id="qmeta-init">window.__Q_META__=${ delete data.noscript && JSON.stringify(data) }</script>`
}

function updateClientMeta () {
  const data = {
    title: '',
    titleTemplate: null,
    meta: {},
    link: {},
    script: {},
    htmlAttr: {},
    bodyAttr: {}
  }

  for (let i = 0; i < clientList.length; i++) {
    const { active, val } = clientList[ i ]

    if (active === true) {
      extend(true, data, val)
    }
  }

  normalize(data)

  apply(diff(currentClientMeta, data))
  currentClientMeta = data
}

export function planClientUpdate () {
  clearTimeout(updateId)
  updateId = setTimeout(updateClientMeta, 50)
}

export default {
  install (opts) {
    if (__QUASAR_SSR_SERVER__) {
      const { ssrContext } = opts

      ssrContext.__qMetaList = []
      ssrContext.onRendered(() => {
        injectServerMeta(ssrContext)
      })
    }
    else if (this.__installed !== true && isRuntimeSsrPreHydration.value === true) {
      currentClientMeta = window.__Q_META__
      document.getElementById('qmeta-init').remove()
    }
  }
}
