import { getSquareIcon } from '../utils/get-square-icon.js'

export default function png(file, opts, done) {
  const img = getSquareIcon({
    file,
    icon: opts.icon,
    size: file.height,
    padding: opts.padding,
    background:
      file.background === true
        ? opts.pngColor
        : { r: 255, g: 255, b: 255, alpha: 0 }
  })

  if (file.background === true) {
    img.flatten({
      background: opts.pngColor
    })
  }

  // iOS 18+ tinted app icon: a grayscale image the system applies its tint to
  if (file.appearance === 'tinted') {
    img.grayscale()
  }

  img
    .png()
    .toFile(file.absoluteName)
    .then(() => opts.compression.png(file.absoluteName))
    .then(done)
}
