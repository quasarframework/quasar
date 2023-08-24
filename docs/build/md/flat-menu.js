import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import menu from '../../src/assets/menu.js'

const prefix = fileURLToPath(new URL('../../src/pages', import.meta.url))

let prev = null
export const flatMenu = {}

function menuWalk (node, path, parentName) {
  const newPath = path + (node.path ? `/${node.path}` : '')

  if (node.children !== void 0) {
    node.children.forEach(n => {
      menuWalk(n, newPath, node.name)
    })
  }
  else if (!node.external) {
    const current = {
      name: node.name,
      category: parentName,
      path: newPath
    }

    if (prev !== null) {
      prev.next = {
        name: current.name,
        category: current.category,
        path: current.path
      }
      current.prev = {
        name: prev.name,
        category: prev.category,
        path: prev.path
      }
    }

    flatMenu[ join(prefix, newPath + '.md') ] = current
    // may be folder-based:
    flatMenu[ join(prefix, newPath + '/' + node.path + '.md') ] = current

    prev = current
  }
}

menu.forEach(n => {
  menuWalk(n, '', null)
})

export function convertToRelated (entry, id) {
  const menu = flatMenu[ join(prefix, entry + '.md') ]

  if (!menu) {
    console.error('[flat-menu] ERROR - wrong related link:', entry, '@id', id)
    return {}
  }

  return {
    name: menu.name,
    category: menu.category,
    path: menu.path
  }
}
