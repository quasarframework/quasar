module.exports = function getSquareIcon ({
  icon,
  size,
  padding,
  background = { r: 255, g: 255, b: 255, alpha: 0 }
}) {
  const img = icon.clone()

  img.resize({
    width: size - 2 * padding.horiz,
    height: size - 2 * padding.vert,
    fit: 'contain',
    background
  })

  if (padding.horiz > 0 || padding.vert > 0) {
    img.extend({
      top: padding.vert,
      bottom: padding.vert,
      left: padding.horiz,
      right: padding.horiz,
      background
    })
  }

  return img
}
