const svgo = require('svgo')
const { writeFile } = require('fs')
const { posterize } = require('potrace')

const getSquareIcon = require('../utils/get-square-icon')

module.exports = async function (file, opts, done) {
  const img = getSquareIcon({
    file,
    icon: opts.icon,
    size: 256,
    padding: opts.padding
  })

  const params = {
    color: opts.svgColor,
    steps: 4,
    threshold: 255
  }

  const buffer = await img.toBuffer()

  posterize(buffer, params, (_, svg) => {
    const svgOutput = new svgo({})
    svgOutput.optimize(svg).then(res => {
      writeFile(file.absoluteName, res.data, done)
    })
  })
}
