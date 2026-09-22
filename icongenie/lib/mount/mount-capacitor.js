import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, relative } from 'node:path'
import { ensureDirSync } from 'fs-extra'
import { green, red } from 'kolorist'

import { appDir, resolveDir } from '../utils/app-paths.js'
import { log, warn } from '../utils/logger.js'
import { createInstance } from '../utils/package-manager.js'

const srcCapacitorDir = resolveDir('src-capacitor')

const platformList = ['capacitor-android', 'capacitor-ios']
const adaptiveIconFolder = 'mipmap-anydpi-v26'

export function isCapacitorFile(file) {
  return platformList.includes(file.platform)
}

function getRelativeName(absoluteName) {
  return relative(appDir, absoluteName).replaceAll('\\', '/') // Windows support
}

function getResourceName(file) {
  return basename(file.name, '.png')
}

function writeIfChanged(absoluteName, content) {
  if (
    existsSync(absoluteName) &&
    readFileSync(absoluteName, 'utf8') === content
  ) {
    return
  }

  ensureDirSync(dirname(absoluteName))
  writeFileSync(absoluteName, content, 'utf8')
  log(`Updated ${getRelativeName(absoluteName)}`)
}

/**
 * Android
 */

// the launcher files live in <res>/mipmap-<density>/
function getAndroidResDir(file) {
  return dirname(dirname(file.absoluteName))
}

function getAdaptiveIconXml(foreground, background) {
  return `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/${background}"/>
    <foreground android:drawable="@mipmap/${foreground}"/>
</adaptive-icon>
`
}

function mountAndroidIcons(files) {
  const launcherFiles = files.filter(file => file.generator === 'launcher')
  if (launcherFiles.length === 0) return

  const foreground = launcherFiles.find(file => file.variant === 'foreground')
  const background = launcherFiles.find(file => file.variant === 'background')

  if (foreground === void 0 || background === void 0) {
    warn(
      'Both the "foreground" and the "background" launcher variants are needed to mount the Android adaptive icon'
    )
    return
  }

  const xml = getAdaptiveIconXml(
    getResourceName(foreground),
    getResourceName(background)
  )

  // the adaptive icon XML overrides the same-named legacy png on Android 8+
  const iconNames = new Set(
    launcherFiles
      .filter(file => file.variant === 'legacy' || file.variant === 'round')
      .map(getResourceName)
  )

  iconNames.forEach(name => {
    writeIfChanged(
      join(getAndroidResDir(foreground), adaptiveIconFolder, `${name}.xml`),
      xml
    )
  })
}

function readAndroidXml(file, ...segments) {
  const target = join(getAndroidResDir(file), ...segments)
  return existsSync(target) ? readFileSync(target, 'utf8') : null
}

function verifyAndroid(file) {
  const name = getResourceName(file)

  if (file.generator === 'launcher') {
    if (file.variant === 'foreground' || file.variant === 'background') {
      const folder = join(getAndroidResDir(file), adaptiveIconFolder)
      const isReferenced =
        existsSync(folder) &&
        readdirSync(folder).some(
          entry =>
            entry.endsWith('.xml') &&
            readFileSync(join(folder, entry), 'utf8').includes(
              `@mipmap/${name}`
            )
        )

      return isReferenced
        ? green('mounted')
        : red(`ERROR: no adaptive icon in ${adaptiveIconFolder} uses it`)
    }

    const manifest = readAndroidXml(file, '..', 'AndroidManifest.xml')

    return manifest?.includes(`@mipmap/${name}`)
      ? green('mounted')
      : red('ERROR: not referenced in AndroidManifest.xml')
  }

  if (file.generator === 'splashscreen') {
    const styles = readAndroidXml(file, 'values', 'styles.xml')

    return styles?.includes(`@drawable/${name}`)
      ? green('mounted')
      : red('ERROR: not referenced in res/values/styles.xml')
  }

  return ''
}

/**
 * iOS
 */

const darkAppearance = [{ appearance: 'luminosity', value: 'dark' }]

// keys in alphabetical order, as Xcode writes them
function getXcassetEntry(file) {
  const entry = {}

  if (file.dark === true) {
    entry.appearances = darkAppearance
  }

  entry.filename = file.name
  entry.idiom = 'universal'

  if (file.generator === 'splashscreen') {
    entry.scale = file.scale
  } else {
    entry.platform = 'ios'
    entry.size = `${file.width}x${file.height}`
  }

  return entry
}

function readContentsJson(folder) {
  const target = join(folder, 'Contents.json')

  if (existsSync(target)) {
    try {
      return JSON.parse(readFileSync(target, 'utf8'))
    } catch {
      warn(`Malformed ${getRelativeName(target)}; overwriting it`)
    }
  }

  return { images: [], info: { author: 'xcode', version: 1 } }
}

// Xcode's own serialization, so that it does not rewrite the file
function toXcodeJson(content) {
  return (
    JSON.stringify(content, null, 2).replaceAll(
      /^(\s*"[^"]+")(: )/gm,
      '$1 : '
    ) + '\n'
  )
}

function mountIosAssets(files) {
  const folders = new Map()

  files.forEach(file => {
    const folder = dirname(file.absoluteName)

    if (!folders.has(folder)) {
      folders.set(folder, [])
    }

    folders.get(folder).push(file)
  })

  folders.forEach((folderFiles, folder) => {
    const contents = readContentsJson(folder)

    // light appearance first, as Xcode lists them
    contents.images = [
      ...folderFiles.filter(file => file.dark !== true),
      ...folderFiles.filter(file => file.dark === true)
    ].map(getXcassetEntry)

    writeIfChanged(join(folder, 'Contents.json'), toXcodeJson(contents))
  })
}

function verifyIos(file) {
  const contents = readContentsJson(dirname(file.absoluteName))

  return Array.isArray(contents.images) &&
    contents.images.some(entry => entry.filename === file.name)
    ? green('mounted')
    : red('ERROR: no entry for it in Contents.json')
}

/**
 * Splashscreen plugin
 */

async function installSplashscreenPlugin() {
  const pkgPath = join(srcCapacitorDir, 'package.json')

  // malformed /src-capacitor...
  if (!existsSync(pkgPath)) return

  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))

  if (
    pkg.dependencies?.['@capacitor/splash-screen'] ||
    pkg.devDependencies?.['@capacitor/splash-screen']
  ) {
    return
  }

  const pm = createInstance(srcCapacitorDir)
  if (typeof pm === 'string') {
    warn(pm)
    return
  }

  const success = await pm.installPackage('@capacitor/splash-screen')

  if (!success) {
    warn()
    warn('Failed to install @capacitor/splash-screen. Please do it manually.')
  }
}

export async function mountCapacitor(files) {
  const capacitorFiles = files.filter(isCapacitorFile)
  if (capacitorFiles.length === 0) return

  mountAndroidIcons(
    capacitorFiles.filter(file => file.platform === 'capacitor-android')
  )

  mountIosAssets(
    capacitorFiles.filter(file => file.platform === 'capacitor-ios')
  )

  if (capacitorFiles.some(file => file.generator === 'splashscreen')) {
    await installSplashscreenPlugin()
  }
}

export function verifyCapacitor(file) {
  return file.platform === 'capacitor-android'
    ? verifyAndroid(file)
    : verifyIos(file)
}
