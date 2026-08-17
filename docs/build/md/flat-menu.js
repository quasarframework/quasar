import { join, normalize } from 'node:path'

import menu from '../../src/assets/menu.js'

const prefix = normalize(join(import.meta.dirname, '../../src/pages'))

let prev = null
export const flatMenu = {}

function menuWalk(node, path, parentName) {
  const newPath = path + (node.path ? `/${node.path}` : '')

  if (node.children !== void 0) {
    node.children.forEach(n => {
      menuWalk(n, newPath, node.name)
    })
  } else if (!node.external) {
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

    flatMenu[join(prefix, newPath + '.md')] = current
    // may be folder-based:
    flatMenu[join(prefix, newPath + '/' + node.path + '.md')] = current

    prev = current
  }
}

menu.forEach(n => {
  menuWalk(n, '', null)
})

/**
 * @param {string} entry the related link as the page wrote it
 * @param {string} id the page that wrote it
 * @param {boolean} strict throw rather than report. A link resolving to
 *   nothing is worth carrying on past while a page is being written, and
 *   worth stopping the build that would ship it.
 */
export function convertToRelated(entry, id, strict = false) {
  const localMenu = flatMenu[join(prefix, entry + '.md')]

  if (!localMenu) {
    const message = `[flat-menu] ERROR - wrong related link: ${entry} @id ${id}`

    if (strict) throw new Error(message)

    console.error(message)
    return {}
  }

  return {
    name: localMenu.name,
    category: localMenu.category,
    path: localMenu.path
  }
}
