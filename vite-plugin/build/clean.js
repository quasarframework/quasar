import { fileURLToPath } from 'node:url'
import fse from 'fs-extra'

const targetFolder = fileURLToPath(new URL('../dist', import.meta.url))
fse.removeSync(targetFolder)
fse.ensureDirSync(targetFolder)
console.log(' 💥 Cleaned build artifacts.\n')
