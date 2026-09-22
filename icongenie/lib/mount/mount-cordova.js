// oxlint-disable new-cap

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import elementTree from 'elementtree'
import { join, relative } from 'node:path'
import { green, red } from 'kolorist'

import { resolveDir } from '../utils/app-paths.js'
import { log } from '../utils/logger.js'

const cordovaConfigXml = resolveDir('src-cordova/config.xml')
const srcCordovaDir = resolveDir('src-cordova')

const platformList = ['cordova-android', 'cordova-ios']
const generatorList = ['png', 'splashscreen', 'launcher']

// config.xml attribute of the <icon> node for each launcher variant
const androidIconAttr = {
  legacy: 'src',
  foreground: 'foreground',
  background: 'background',
  monochrome: 'monochrome'
}

// cordova-android >= 11 splash screen (Android 12 API)
const splashIconPreference = 'AndroidWindowSplashScreenAnimatedIcon'
const splashBackgroundPreference = 'AndroidWindowSplashScreenBackground'

// config.xml attributes of the cordova-ios >= 8 icon appearance variants
const iosIconAttr = {
  dark: 'foreground',
  tinted: 'monochrome'
}

function getNode(root, tag, selector) {
  return root.find(`${tag}${selector}`) || elementTree.SubElement(root, tag)
}

function hasNode(root, tag, selector) {
  return root.find(`${tag}${selector}`)
}

function getSrc(file) {
  return relative(srcCordovaDir, file.absoluteName).replaceAll('\\', '/') // Windows support
}

export function isCordovaFile(file) {
  return (
    platformList.includes(file.platform) &&
    generatorList.includes(file.generator)
  )
}

function isAndroid(file) {
  return file.platform === 'cordova-android'
}

function getPlatformNode(rootNode, name) {
  const node = getNode(rootNode, 'platform', `[@name="${name}"]`)

  if (node.get('name') === void 0) {
    node.set('name', name)
  }

  return node
}

function setPreference(node, name, value) {
  const pref = getNode(node, 'preference', `[@name="${name}"]`)
  pref.set('name', name)
  pref.set('value', value)
}

function removeNodes(parent, list, reason) {
  if (list.length === 0) return

  list.forEach(node => {
    parent.remove(node)
  })

  log(`Removed ${reason} from src-cordova/config.xml`)
}

// Android color resources take #RGB too, but spell it out for readability
function getHexColor(color) {
  return color.length === 4
    ? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
    : color
}

function mountAndroidFile(node, file) {
  const src = getSrc(file)

  if (file.generator === 'launcher') {
    if (file.variant === 'maskable') {
      setPreference(node, splashIconPreference, src)
      return
    }

    // <icon density="mdpi" src="res/android/mdpi.png"
    //   foreground="..." background="..." monochrome="..." />
    const entry = getNode(node, 'icon', `[@density="${file.density}"]`)
    entry.set('density', file.density)
    entry.set(androidIconAttr[file.variant], src)
    return
  }

  if (file.generator === 'png') {
    // <icon src="res/android/ldpi.png" density="ldpi" />
    const entry = getNode(node, 'icon', `[@density="${file.density}"]`)
    entry.set('src', src)
    entry.set('density', file.density)
  }

  // legacy <splash> entries are not used by cordova-android >= 11
}

function mountIosFile(node, file) {
  const src = getSrc(file)

  if (file.generator === 'splashscreen') {
    // <splash src="res/screen/ios/Default@2x~universal~anyany.png" />
    getNode(node, 'splash', `[@src="${src}"]`).set('src', src)
    return
  }

  if (file.generator === 'png') {
    // <icon src="res/ios/icon.png" />
    // <icon src="res/ios/icon-dark.png" foreground="true" />
    // <icon src="res/ios/icon-tinted.png" monochrome="true" />
    const entry = getNode(node, 'icon', `[@src="${src}"]`)
    entry.set('src', src)

    const attr = iosIconAttr[file.appearance]
    if (attr !== void 0) {
      entry.set(attr, 'true')
    }
  }
}

// entries whose files are gone (retired assets) would break the build
function pruneMissingFiles(node) {
  const stale = [...node.findall('icon'), ...node.findall('splash')].filter(
    entry => {
      const src = entry.get('src')
      return src !== void 0 && !existsSync(join(srcCordovaDir, src))
    }
  )

  removeNodes(
    node,
    stale,
    `${stale.map(entry => `<${entry.tag} src="${entry.get('src')}">`).join(', ')}`
  )
}

function updateConfigXml(cordovaFiles, params) {
  const doc = elementTree.parse(readFileSync(cordovaConfigXml, 'utf8'))
  const rootNode = doc.getroot()

  const androidNode = getPlatformNode(rootNode, 'android')
  const iosNode = getPlatformNode(rootNode, 'ios')

  cordovaFiles.forEach(file => {
    if (isAndroid(file)) {
      mountAndroidFile(androidNode, file)
    } else {
      mountIosFile(iosNode, file)
    }
  })

  if (
    cordovaFiles.some(
      file => file.generator === 'launcher' && file.variant === 'maskable'
    )
  ) {
    setPreference(
      androidNode,
      splashBackgroundPreference,
      getHexColor(params.splashscreenColor)
    )
  }

  // leftovers of the cordova-plugin-splashscreen era
  removeNodes(
    androidNode,
    androidNode.findall('splash'),
    'the legacy Android <splash> entries'
  )
  removeNodes(
    rootNode,
    rootNode.findall('preference[@name="SplashMaintainAspectRatio"]'),
    'the SplashMaintainAspectRatio preference'
  )

  pruneMissingFiles(androidNode)
  pruneMissingFiles(iosNode)

  writeFileSync(cordovaConfigXml, doc.write({ indent: 4 }), 'utf8')
  log(`Updated src-cordova/config.xml`)
}

export function mountCordova(files, params) {
  if (!existsSync(cordovaConfigXml)) return

  const cordovaFiles = files.filter(isCordovaFile)

  if (cordovaFiles.length !== 0) {
    updateConfigXml(cordovaFiles, params)
  }
}

function verifyAndroid(node, file) {
  const src = getSrc(file)

  if (file.generator === 'launcher') {
    if (file.variant === 'maskable') {
      return hasNode(
        node,
        'preference',
        `[@name="${splashIconPreference}"][@value="${src}"]`
      )
        ? green('mounted')
        : red(`ERROR: not the ${splashIconPreference} preference`)
    }

    const attr = androidIconAttr[file.variant]

    return hasNode(
      node,
      'icon',
      `[@density="${file.density}"][@${attr}="${src}"]`
    )
      ? green('mounted')
      : red(`ERROR: no icon entry with ${attr}="${src}"`)
  }

  if (file.generator === 'png') {
    return hasNode(node, 'icon', `[@density="${file.density}"][@src="${src}"]`)
      ? green('mounted')
      : red('ERROR: no entry for it in src-cordova/config.xml')
  }

  return red('ERROR: not used by cordova-android >= 11')
}

function verifyIos(node, file) {
  const src = getSrc(file)

  if (file.generator === 'splashscreen') {
    return hasNode(node, 'splash', `[@src="${src}"]`)
      ? green('mounted')
      : red('ERROR: no entry for it in src-cordova/config.xml')
  }

  const attr = iosIconAttr[file.appearance]
  const selector = `[@src="${src}"]${attr === void 0 ? '' : `[@${attr}="true"]`}`

  return hasNode(node, 'icon', selector)
    ? green('mounted')
    : red('ERROR: no entry for it in src-cordova/config.xml')
}

export function verifyCordova(file) {
  if (!existsSync(cordovaConfigXml)) return ''

  const doc = elementTree.parse(readFileSync(cordovaConfigXml, 'utf8'))
  const node = doc
    .getroot()
    .find(`platform[@name="${isAndroid(file) ? 'android' : 'ios'}"]`)

  // verify that the platform is installed
  if (!node) {
    return red('ERROR: platform not installed!')
  }

  return isAndroid(file) ? verifyAndroid(node, file) : verifyIos(node, file)
}
