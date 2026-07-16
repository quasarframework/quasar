import fse from 'fs-extra'
import { join } from 'node:path'
import { merge } from 'webpack-merge'

import { warn } from '../../utils/logger.js'

export async function createManifest(quasarConf) {
  let json
  const bexManifestPath = quasarConf.metaConf.bexManifestFile

  try {
    json = JSON.parse(fse.readFileSync(bexManifestPath, 'utf8'))
  } catch (err) {
    warn('Could not read BEX manifest. Please check its syntax.')
    return { err }
  }

  json = merge({}, json.all || {}, json[quasarConf.ctx.targetName] || {})

  if (json.manifest_version === void 0) {
    warn(
      'The BEX manifest requires a "manifest_version" prop, which is currently missing.'
    )
    return { err: true }
  }

  const {
    appPkg: { productName, name, description, version }
  } = quasarConf.ctx.pkg

  if (json.name === void 0) {
    json.name = productName || name
  }
  if (json.short_name === void 0) {
    json.short_name = json.name
  }
  if (json.description === void 0) {
    json.description = description
  }
  if (json.version === void 0) {
    json.version = version
  }

  if (json.manifest_version === 2) {
    json.browser_action ||= {}

    if (json.browser_action.default_title === void 0) {
      json.browser_action.default_title = json.name
    }
  } else if (json.manifest_version === 3) {
    json.action ||= {}
    if (json.action.default_title === void 0) {
      json.action.default_title = json.name
    }
  } else {
    warn()
    warn(
      `The bex manifest version specified (${json.manifest_version}) is NOT yet officially supported by Quasar CLI. Things might go wrong.`
    )
    warn()
  }

  if (typeof quasarConf.bex.extendBexManifestJson === 'function') {
    const overrides = await quasarConf.bex.extendBexManifestJson(json)
    if (Object(overrides) === overrides) {
      json = merge({}, json, overrides)
    }
  }

  await quasarConf.ctx.appExt.runAppExtensionHook(
    'extendBexManifestJson',
    async hook => {
      hook.api.logger.log(`Running "extendBexManifestJson(json)"`)
      const overrides = await hook.fn(json, hook.api)
      if (Object(overrides) === overrides) {
        json = merge({}, json, overrides)
      }
    }
  )

  // also changes .ts -> .js and .tsx -> .jsx
  const scriptList = extractBexScripts(quasarConf, json)

  fse.ensureDirSync(quasarConf.build.distDir)
  fse.writeFileSync(
    join(quasarConf.build.distDir, 'manifest.json'),
    JSON.stringify(json, null, quasarConf.build.minify ? void 0 : 2),
    'utf8'
  )

  return { scriptList }
}

function getCompilationEntry(quasarConf, inputFile, scriptName) {
  return {
    name: scriptName.replaceAll('\\', '/'),
    from: inputFile,
    to: join(quasarConf.build.distDir, `${scriptName}.js`)
  }
}

const scriptExtRE = /\.[jt]sx?$/i

function extractBexScripts(quasarConf, bexManifest) {
  const scriptList = []
  const scriptNameSet = new Set()

  if (bexManifest.background?.service_worker) {
    const rawName = bexManifest.background.service_worker
    const scriptName = rawName.replace(scriptExtRE, '')
    const inputFile = quasarConf.ctx.appPaths.resolve.bex(rawName)

    bexManifest.background.service_worker = scriptName + '.js'

    if (!fse.existsSync(inputFile)) {
      warn()
      warn(
        `The file defined in bex manifest > background > service_worker > "${rawName}" does NOT exist. Skipping.`
      )
      warn()
    } else {
      const entry = getCompilationEntry(quasarConf, inputFile, scriptName)
      if (!scriptNameSet.has(entry.name)) {
        scriptNameSet.add(entry.name)
        scriptList.push(entry)
      }
    }
  }

  bexManifest.background?.scripts?.forEach((rawName, index) => {
    const scriptName = rawName.replace(scriptExtRE, '')
    const inputFile = quasarConf.ctx.appPaths.resolve.bex(rawName)

    bexManifest.background.scripts[index] = scriptName + '.js'

    if (!fse.existsSync(inputFile)) {
      warn()
      warn(
        `The file defined in bex manifest > background > scripts > "${rawName}" does NOT exist. Skipping.`
      )
      warn()
      return
    }

    const entry = getCompilationEntry(quasarConf, inputFile, scriptName)
    if (!scriptNameSet.has(entry.name)) {
      scriptNameSet.add(entry.name)
      scriptList.push(entry)
    }
  })

  bexManifest.content_scripts?.forEach(contentScript => {
    contentScript.js?.forEach((rawName, index) => {
      const scriptName = rawName.replace(scriptExtRE, '')
      const inputFile = quasarConf.ctx.appPaths.resolve.bex(rawName)

      contentScript.js[index] = scriptName + '.js'

      if (!fse.existsSync(inputFile)) {
        warn()
        warn(
          `The file defined in bex manifest > content_scripts > js > "${rawName}" does NOT exist. Skipping.`
        )
        warn()
        return
      }

      const entry = getCompilationEntry(quasarConf, inputFile, scriptName)
      if (!scriptNameSet.has(entry.name)) {
        scriptNameSet.add(entry.name)
        scriptList.push(entry)
      }
    })
  })

  quasarConf.bex.extraScripts.forEach(rawName => {
    const inputFile = quasarConf.ctx.appPaths.resolve.bex(rawName)

    if (!fse.existsSync(inputFile)) {
      warn()
      warn(
        `The file defined in quasar.config > bex > extraScripts > "${rawName}" does NOT exist. Skipping.`
      )
      warn()
      return
    }

    const scriptName = rawName.replace(scriptExtRE, '')
    const entry = getCompilationEntry(quasarConf, inputFile, scriptName)
    if (!scriptNameSet.has(entry.name)) {
      scriptNameSet.add(entry.name)
      scriptList.push(entry)
    }
  })

  return scriptList
}

export function copyBexAssets(quasarConf, clean = false) {
  const { appPaths, cacheProxy } = quasarConf.ctx

  const { assetsFolder, iconsFolder, localesFolder } = cacheProxy.getRuntime(
    'runtimeBexUtils',
    () => ({
      assetsFolder: appPaths.resolve.bex('assets'),
      iconsFolder: appPaths.resolve.bex('icons'),
      localesFolder: appPaths.resolve.bex('_locales')
    })
  )

  const folders = [assetsFolder, iconsFolder, localesFolder]
  const targets = [
    [assetsFolder, join(quasarConf.build.distDir, 'assets')],
    [iconsFolder, join(quasarConf.build.distDir, 'icons')],
    [localesFolder, join(quasarConf.build.distDir, '_locales')]
  ]

  for (const [source, target] of targets) {
    if (clean === true) {
      fse.removeSync(target)
    }

    if (fse.existsSync(source)) {
      fse.copySync(source, target)
    }
  }

  return folders
}
