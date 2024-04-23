import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import fse from 'fs-extra'

const rootFolder = fileURLToPath(new URL('../..', import.meta.url))

function readJsonFile (ctx) {
  const jsonFileBasename = ctx.localName.replace('.js', '.json')

  const distJsonFile = resolve(rootFolder, 'dist/api/', jsonFileBasename)
  if (fse.existsSync(distJsonFile)) return distJsonFile

  const localJsonFile = ctx.targetAbsolute.replace('.js', '.json')
  if (fse.existsSync(localJsonFile)) return localJsonFile
}

export default function readAssociatedJsonFile (ctx) {
  const jsonFile = readJsonFile(ctx)
  return jsonFile === void 0
    ? void 0
    : JSON.parse(fse.readFileSync(jsonFile, 'utf-8'))
}
