import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { merge } from 'webpack-merge'
import { parseJSON, stringifyJSON } from 'confbox'

import { fatal } from '../utils/logger.js'
import { getExtensionLogger } from './logger.js'
import { AppExtensionInstance } from './AppExtensionInstance.js'

function readJson(file) {
  if (!existsSync(file)) return {}

  try {
    return parseJSON(readFileSync(file, 'utf8'))
  } catch (err) {
    console.log(err)
    fatal('quasar.extensions.json is malformed', 'FAIL')
  }
}

// exported for testing purposes only
export function getAppExtJson({ file, json, onListUpdate }) {
  const fileExists = Object.keys(json).length !== 0

  function save() {
    writeFileSync(
      file,
      // if file exists, preserve indentation, otherwise use 2 spaces
      stringifyJSON(json, { indent: fileExists ? void 0 : 2 }),
      'utf8'
    )
  }

  const acc = {
    has(extId) {
      return json[extId] !== void 0
    },

    get(extId) {
      return json[extId] === void 0 ? void 0 : structuredClone(json[extId])
    },

    set(extId, opts) {
      getExtensionLogger(extId).log('Updating /quasar.extensions.json')
      const hasAppExt = json[extId] !== void 0
      json[extId] = opts
      save()
      if (!hasAppExt) onListUpdate(json)
    },

    setInternal(extId, opts) {
      const cfg = json[extId] || {}
      cfg.__internal = opts
      acc.set(extId, cfg)
    },

    remove(extId) {
      if (acc.has(extId)) {
        getExtensionLogger(extId).log('Removing from /quasar.extensions.json')
        delete json[extId]
        save()
        onListUpdate(json)
      }
    },

    getPrompts(extId) {
      const { __internal, ...prompts } = json[extId] || {}
      return structuredClone(prompts)
    },

    getInternal(extId) {
      const cfg = json[extId] || {}
      return cfg.__internal || {}
    }
  }

  return acc
}

export function createAppExt(ctx) {
  let hooksMap = null

  const appExt = {
    extensionList: [],

    createInstance(extName) {
      return new AppExtensionInstance({
        extName,
        ctx,
        appExtJson
      })
    },

    async registerAppExtensions() {
      hooksMap = {}
      for (const ext of appExt.extensionList) {
        const extHooks = await ext.run()
        hooksMap = merge(hooksMap, extHooks)
      }
    },

    async runAppExtensionHook(hookName, fn) {
      const hookList = hooksMap[hookName] || []
      for (const hook of hookList) {
        await fn(hook)
      }
    },

    getInstance(extId) {
      return appExt.extensionList.find(ext => ext.extId === extId)
    }
  }

  const onListUpdate = json => {
    appExt.extensionList = Object.keys(json).map(appExt.createInstance)
  }

  const file = ctx.appPaths.resolve.app('quasar.extensions.json')
  const json = readJson(file)

  const appExtJson = getAppExtJson({
    file,
    json,
    onListUpdate
  })

  onListUpdate(json)

  return appExt
}
