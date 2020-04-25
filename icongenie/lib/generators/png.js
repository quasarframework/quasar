module.exports = function (file, opts, done) {
  const img = opts.icon
    .clone()
    .resize(file.width, file.height)

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
