const { warn } = require('../utils/logger')

module.exports = function getSquareIcon ({
  file,
  icon,
  size,
  padding: { horiz, vert },
  background = { r: 255, g: 255, b: 255, alpha: 0 }
}) {
  const img = icon.clone()
  let width = size - 2 * horiz
  let height = size - 2 * vert
  let corrections = []

  if (width <= 0) {
    width = size
    horiz = 0
    corrections.push('width')
  }

  if (height <= 0) {
    height = size
    vert = 0
    corrections.push('height')
  }

  if (corrections.length > 0) {
    warn(`Correction on padding for ${file.relativeName} due to padding exceeding file's dimension of ${size}x${size}px`)
  }

  img.resize({
    width,
    height,
    fit: 'contain',
    background
  })

  if (horiz > 0 || vert > 0) {
    img.extend({
      top: vert,
      bottom: vert,
      left: horiz,
      right: horiz,
      background
    })
  }

  return img
}
