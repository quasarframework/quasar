import { resolve, dirname, basename, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import fse from 'fs-extra'

import { pascalCase } from './specs.utils.js'

const rootFolder = fileURLToPath(new URL('../..', import.meta.url))

export function createCtx (target) {
  const localName = basename(target)
  const dirAbsolute = dirname(resolve(rootFolder, target))
  const testName = localName.replace('.js', '.test.js')
  const testFileAbsolute = resolve(dirAbsolute, testName)
  const pascalName = pascalCase(localName.replace('.js', ''))

  const ctx = {
    targetRelative: target,
    targetAbsolute: resolve(rootFolder, target),
    localName,
    pascalName,
    dirAbsolute,
    testFileAbsolute,
    testFileRelative: relative(rootFolder, testFileAbsolute),
    testTreeRootId: `[${ pascalName } API]`
  }

  let cachedTargetContent
  // on demand only
  Object.defineProperty(ctx, 'targetContent', {
    get () {
      if (cachedTargetContent === void 0) {
        cachedTargetContent = fse.readFileSync(ctx.targetAbsolute, 'utf-8')
      }
      return cachedTargetContent
    }
  })

  return ctx
}
