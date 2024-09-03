import { resolve, dirname, basename, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import fse from 'fs-extra'

import { camelCase } from './specs.utils.js'

const rootFolder = fileURLToPath(new URL('../..', import.meta.url))
const jsRE = /\.js$/

export function createCtx (target) {
  const localName = basename(target)
  const rootName = localName.replace(jsRE, '').replace('private.', '')
  const testName = rootName + '.test.js'
  const targetAbsolute = resolve(rootFolder, target)
  const testFileAbsolute = resolve(dirname(targetAbsolute), testName)
  const camelCaseName = camelCase(rootName)

  const ctx = {
    targetRelative: target,
    targetAbsolute,
    localName,
    camelCaseName,
    testTreeRootId: `[${ camelCaseName } API]`,
    testFileAbsolute,
    testFileRelative: relative(rootFolder, testFileAbsolute)
  }

  let cachedTargetContent
  // on demand only
  Object.defineProperty(ctx, 'targetContent', {
    enumerable: true,
    get () {
      if (cachedTargetContent === void 0) {
        cachedTargetContent = fse.readFileSync(ctx.targetAbsolute, 'utf-8')
      }
      return cachedTargetContent
    }
  })

  return ctx
}
