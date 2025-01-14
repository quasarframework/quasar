import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { merge } from 'webpack-merge'
import { parseJSON, stringifyJSON } from 'confbox'

import { log, fatal } from '../utils/logger.js'
import { AppExtensionInstance } from './AppExtensionInstance.js'

function readJson (file) {
  if (existsSync(file) === false) {
    return {}
  }

  try {
    return parseJSON(
      readFileSync(file, 'utf-8')
    )
  }
  catch (e) {
    console.log(e)
    fatal('quasar.extensions.json is malformed', 'FAIL')
  }
}

function getAppExtJson ({ file, json, onListUpdate }) {
  const fileExists = Object.keys(json).length > 0

  function save () {
    writeFileSync(
      file,
      // if file exists, preserve indentation, otherwise use 2 spaces
      stringifyJSON(json, { indent: fileExists ? undefined : 2 }),
      'utf-8'
    )
  }

  const acc = {
    has (extId) {
      return json[ extId ] !== void 0
    },

    set (extId, opts) {
      log(`Updating /quasar.extensions.json for "${ extId }" extension ...`)
      const hasAppExt = json[ extId ] !== void 0
      json[ extId ] = opts
      save()
      hasAppExt === false && onListUpdate(json)
    },

    setInternal (extId, opts) {
      const cfg = json[ extId ] || {}
      cfg.__internal = opts
      acc.set(extId, cfg)
    },

    remove (extId) {
      if (acc.has(extId) === true) {
        log(`Removing "${ extId }" extension from /quasar.extensions.json ...`)
        delete json[ extId ]
        save()
        onListUpdate(json)
      }
    },

    getPrompts (extId) {
      const { __internal, ...prompts } = json[ extId ] || {}
      return JSON.parse(JSON.stringify(prompts))
    },

    getInternal (extId) {
      const cfg = json[ extId ] || {}
      return cfg.__internal || {}
    }
  }

  return acc
}

export function createAppExt (ctx) {
  let hooksMap = null

  const appExt = {
    extensionList: [],

    createInstance (extName) {
      return new AppExtensionInstance({
        extName,
        ctx,
        appExtJson
      })
    },

    async registerAppExtensions () {
      hooksMap = {}
      for (const ext of appExt.extensionList) {
        const extHooks = await ext.run()
        hooksMap = merge(hooksMap, extHooks)
      }
    },

    async runAppExtensionHook (hookName, fn) {
      const hookList = hooksMap[ hookName ] || []
      for (const hook of hookList) {
        await fn(hook)
      }
    },

    getInstance (extId) {
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
