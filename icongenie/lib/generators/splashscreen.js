async function getSplashscreen (file, opts) {
  const size = file.width <= file.height
    ? file.width
    : file.height

  const img = opts.background
    .clone()
    .flatten({
      background: opts.splashscreenColor
    })

  if (opts.splashscreenIconRatio > 0) {
    const icon = await opts.icon
      .clone()
      .resize(Math.round(size * opts.splashscreenIconRatio / 100))
      .toBuffer()

    img.composite([
      { input: icon }
    ])
  }

  return img
}

module.exports = async function (file, opts, done) {
  const img = await getSplashscreen(file, opts)

  img
    .resize(file.width, file.height)
    .png()
    .toFile(file.absoluteName)
    .then(() => opts.compression.png(file.absoluteName))
    .then(done)
}
