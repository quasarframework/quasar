const
  fse = require('fs-extra'),
  path = require('path')


class InitTransformer {
  constructor (options) {
    this.options = options
  }
  
  apply (compiler) {
    compiler.hooks.done.tap('done-compiling', async () => {
      const manData = fse.readFileSync(this.options.chunkManifest)
      const data = fse.readFileSync(path.join(this.options.src, 'js', 'init.js'))
      const varData = `const BEXChunkData=${manData.toString()};`
      let newValue = data.toString().indexOf('BEXChunkData=') > -1
        ? data.toString().replace(/const[ .*]BEXChunkData.*};/g, varData)
        : varData + data.toString()
      fse.writeFileSync(path.join(this.options.src, 'js', 'init.js'), newValue, 'utf-8')
    })
  }
}

module.exports = InitTransformer
