const getSquareIcon = require('../utils/get-square-icon')

module.exports = function (file, opts, done) {
  const img = getSquareIcon({
    file,
    icon: opts.icon,
    size: file.height,
    padding: opts.padding,
    background: file.background === true
      ? opts.pngColor
      : { r: 255, g: 255, b: 255, alpha: 0 }
  })

  if (file.background === true) {
    img.flatten({
      background: opts.pngColor
    })
  }

  img.png()
    .toFile(file.absoluteName)
    .then(() => opts.compression.png(file.absoluteName))
    .then(done)
}
