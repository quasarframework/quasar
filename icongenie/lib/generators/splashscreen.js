const getSquareIcon = require('../utils/get-square-icon')

module.exports = async function (file, opts, done) {
  const size = Math.min(file.width, file.height)

  const img = opts.background
    .clone()
    .resize(file.width, file.height)
    .flatten({
      background: opts.splashscreenColor
    })

  if (opts.splashscreenIconRatio > 0) {
    const icon = getSquareIcon({
      file,
      icon: opts.icon,
      size: Math.round(size * opts.splashscreenIconRatio / 100),
      padding: opts.padding
    })

    const buffer = await icon.toBuffer()

    img.composite([
      { input: buffer }
    ])
  }

  img
    .png()
    .toFile(file.absoluteName)
    .then(() => opts.compression.png(file.absoluteName))
    .then(done)
}
