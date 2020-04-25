const { readFileSync, writeFileSync, existsSync } = require('fs')
const elementTree = require('elementtree')
const { relative } = require('path')
const { red, green } = require('chalk')

const { resolveDir } = require('../utils/app-paths')
const { log, warn } = require('../utils/logger')
const spawnSync = require('../utils/spawn-sync')

const cordovaConfigXml = resolveDir('src-cordova/config.xml')
const srcCordovaDir = resolveDir('src-cordova')

const platformList = [ 'cordova-android', 'cordova-ios' ]
const generatorList = [ 'png', 'splashscreen' ]

function getNode (root, tag, selector) {
  return (
    root.find(`${tag}${selector}`) ||
    elementTree.SubElement(root, tag)
  )
}

function hasNode (root, tag, selector) {
  return root.find(`${tag}${selector}`)
}

function isCordovaFile (file) {
  return platformList.includes(file.platform) &&
    generatorList.includes(file.generator)
}

function getCordovaFiles (files) {
  const cordovaFiles = []

  files.forEach(file => {
    if (isCordovaFile(file)) {
      cordovaFiles.push(file)
    }
  })

  return cordovaFiles
}

function updateConfigXml (cordovaFiles, hasSplashscreen) {
  const doc = elementTree.parse(readFileSync(cordovaConfigXml, 'utf-8'))
  const rootNode = doc.getroot()

  if (hasSplashscreen && !rootNode.find('preference[@name="SplashMaintainAspectRatio"]')) {
    const prefNode = elementTree.SubElement(rootNode, 'preference')
    prefNode.set('name', 'SplashMaintainAspectRatio')
    prefNode.set('value', 'true')
  }

  const androidNode = getNode(rootNode, 'platform', '[@name="android"]')
  const iosNode = getNode(rootNode, 'platform', '[@name="ios"]')

  cordovaFiles.forEach(file => {
    const isAndroid = file.platform === 'cordova-android'
    const node = isAndroid ? androidNode : iosNode
    const src = relative(srcCordovaDir, file.absoluteName)

    if (file.generator === 'splashscreen') {
      // <splash src="res/screen/android/splash-land-hdpi.png" density="land-hdpi"/>
      // <splash src="res/screen/ios/Default@2x~ipad~comany.png" />

      const entry = getNode(
        node,
        'splash',
        isAndroid ? `[@density="${file.density}"]` : `[@src="${src}"]`
      )

      entry.set('src', src)

      if (isAndroid) {
        entry.set('density', file.density)
      }
    }
    else if (file.generator === 'png') {
      // <icon src="res/android/ldpi.png" density="ldpi" />
      // <icon src="res/ios/icon-60@3x.png" width="180" height="180" />

      const entry = getNode(
        node,
        'icon',
        isAndroid
          ? `[@density="${file.density}"]`
          : `[@width="${file.width}"][@height="${file.height}"]`
      )

      entry.set('src', src)

      if (isAndroid) {
        entry.set('density', file.density)
      }
      else {
        entry.set('width', file.width)
        entry.set('height', file.height)
      }
    }
  })

  writeFileSync(cordovaConfigXml, doc.write({ indent: 4 }), 'utf-8')
  log(`Updated src-cordova/config.xml`)
}

function hasDeepProp (target /* , param1, param2, ... */) {
  let obj = target

  for (let i = 1; i < arguments.length; i++) {
    const prop = arguments[i]
    obj = obj[prop]

    if (obj === void 0) {
      return false
    }
  }

  return true
}

function installSplashscreenPlugin () {
  const pkgPath = resolveDir('src-cordova/package.json')

  if (!existsSync(pkgPath)) {
    // malformed /src-cordova...
    return
  }

  const pkg = require(pkgPath)

  if (
    hasDeepProp(pkg, 'dependencies', 'cordova-plugin-splashscreen') ||
    hasDeepProp(pkg, 'cordova', 'plugins', 'cordova-plugin-splashscreen')
  ) {
    // it's already installed, so nothing to do
    return
  }

  log(`Installing cordova-plugin-splashscreen...`)

  spawnSync('cordova', [ 'plugin', 'add', 'cordova-plugin-splashscreen' ], {
    cwd: srcCordovaDir
  }, () => {
    warn()
    warn('Failed to install cordova-plugin-splashscreen. Please do it manually.')
    console.log(' -> /src-cordova: $ cordova plugin add cordova-plugin-splashscreen\n')
  })

  console.log()
}

module.exports.mountCordova = function mountCordova (files) {
  if (existsSync(cordovaConfigXml)) {
    const cordovaFiles = getCordovaFiles(files)

    if (cordovaFiles.length > 0) {
      const hasSplashscreen = cordovaFiles.some(file => file.generator === 'splashscreen')

      if (hasSplashscreen) {
        installSplashscreenPlugin()
      }

      updateConfigXml(cordovaFiles, hasSplashscreen)
    }
  }
}

module.exports.isCordovaFile = isCordovaFile

module.exports.verifyCordova = function verifyCordova (file) {
  if (isCordovaFile(file) && existsSync(cordovaConfigXml)) {
    const doc = elementTree.parse(readFileSync(cordovaConfigXml, 'utf-8'))
    const isAndroid = file.platform === 'cordova-android'

    const node = doc.getroot()
      .find(`platform[@name="${isAndroid ? 'android' : 'ios'}"]`)

    // verify that the platform is installed
    if (!node) {
      return red('ERROR: platform not installed!')
    }

    const src = relative(srcCordovaDir, file.absoluteName)

    if (file.generator === 'splashscreen') {
      const selector = isAndroid
        ? `[@density="${file.density}"]`
        : `[@src="${src}"]`

      if (!hasNode(node, 'splash', selector)) {
        return red('ERROR: no entry for it in src-cordova/config.xml')
      }
    }
    else {
      const selector = isAndroid
        ? `[@density="${file.density}"]`
        : `[@width="${file.width}"][@height="${file.height}"]`

      if (!hasNode(node, 'icon', selector)) {
        return red('ERROR: no entry for it in src-cordova/config.xml')
      }
    }

    return green('mounted')
  }
}
