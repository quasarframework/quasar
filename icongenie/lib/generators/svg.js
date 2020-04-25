const svgo = require('svgo')
const { writeFile } = require('fs')
const { posterize } = require('potrace')

module.exports = function (file, opts, done) {
  const params = {
    color: opts.svgColor,
    steps: 4,
    threshold: 255
  }

  posterize(opts.iconBuffer, params, (_, svg) => {
    const svgOutput = new svgo({})
    svgOutput.optimize(svg).then(res => {
      writeFile(file.absoluteName, res.data, done)
    })
  })
}
