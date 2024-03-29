const path = require('node:path')
const fse = require('fs-extra')

const targetFolder = path.resolve(__dirname, '../dist')
fse.removeSync(targetFolder)
fse.ensureDirSync(targetFolder)
console.log(' 💥 Cleaned build artifacts.\n')
