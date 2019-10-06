const join = require('path').join

const menu = require('../src/assets/menu')
const flatMenu = {}
const prefix = join(__dirname, '../src/pages')

let prev

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

    if (prev !== void 0) {
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
    prev = current
  }
}

menu.forEach(n => {
  menuWalk(n, '', null)
})

module.exports.flatMenu = flatMenu
module.exports.convertToRelated = function (entry) {
  const menu = flatMenu[join(prefix, entry + '.md')]

  if (!menu) {
    console.error('Erroneous related link: ' + entry)
    return {}
  }

  return {
    name: menu.name,
    category: menu.category,
    path: menu.path
  }
}
