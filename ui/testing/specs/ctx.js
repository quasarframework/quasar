import { resolve, dirname, basename, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import fse from 'fs-extra'

import { toPascalCase } from './specs.utils.js'
import { getTestFile } from './testFile.js'

const rootFolder = fileURLToPath(new URL('../..', import.meta.url))

function getJsonFile (meta) {
  const distJsonFile = resolve(rootFolder, 'dist/api/', meta.jsonFileBasename)
  if (fse.existsSync(distJsonFile)) return distJsonFile

  const localJsonFile = resolve(meta.dirAbsolute, meta.jsonFileBasename)
  if (fse.existsSync(localJsonFile)) return localJsonFile
}

function getJson (meta) {
  const jsonFile = getJsonFile(meta)
  return jsonFile === void 0
    ? void 0
    : JSON.parse(fse.readFileSync(jsonFile, 'utf-8'))
}

export function createCtx (target) {
  const localName = basename(target)
  const dirAbsolute = dirname(resolve(rootFolder, target))
  const testName = localName.replace('.js', '.test.js')
  const testFileAbsolute = resolve(dirAbsolute, testName)
  const pascalName = toPascalCase(localName.replace('.js', ''))

  const ctx = {
    targetRelative: target,
    targetAbsolute: resolve(rootFolder, target),
    localName,
    pascalName,
    dirAbsolute,
    testFileAbsolute,
    testFileRelative: relative(rootFolder, testFileAbsolute),
    jsonFileBasename: localName.replace('.js', '.json'),
    testTreeRootId: `[${ pascalName } API]`
  }

  ctx.testFile = getTestFile(ctx)

  let cachedJson
  Object.defineProperty(ctx, 'json', {
    get () {
      if (cachedJson === void 0) {
        cachedJson = getJson(ctx)
      }
      return cachedJson
    }
  })

  return ctx
}
