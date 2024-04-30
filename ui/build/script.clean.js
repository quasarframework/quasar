import fse from 'fs-extra'

import { resolveToRoot } from './build.utils.js'

const targetFolder = resolveToRoot('dist')

fse.removeSync(targetFolder)
fse.ensureDirSync(targetFolder)
console.log(' 💥 Cleaned build artifacts.\n')
