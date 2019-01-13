const menu = require('../assets/menu')

const fs = require('fs')
const path = require('path')

const resolve = _path => path.join(__dirname, _path)

const Sample = resolve('./sample.vue')

function createFolder (dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}

function createFile (_path) {
  const file = resolve(_path)
  console.log('createFolder(', path.dirname(file), ')')
  // createFolder(path.dirname(file))
  // console.log('> ' + file.substring(13))
  // fs.copyFileSync('/work/@quasar/docs/src/pages/sample.vue', file)
}

function traverse (node, __path) {
  const prefix = __path + (node.path !== void 0 ? '/' + node.path : '')

  if (node.children !== void 0) {
    node.children.forEach(node => traverse(node, prefix))
  }
  else {
    createFile(prefix + '.vue')
  }
}

menu.forEach(node => traverse(node, '/'))
