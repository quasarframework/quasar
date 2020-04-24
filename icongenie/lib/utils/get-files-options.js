const sharp = require('sharp')

const { getPngCompression, getIcoCompression } = require('./get-compression')

function getRgbColor (color) {
  let hex = color.replace(/^#/, '')

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }

  const num = parseInt(hex, 16)

  return {
    r: num >> 16,
    g: num >> 8 & 255,
    b: num & 255,
    alpha: 1
  }
}

module.exports = async function getFilesOptions ({
  quality,

  icon,
  background,

  pngColor,
  splashscreenColor,

  ...opts
}) {
  const qualityLevel = parseInt(quality, 10)
  const sharpIcon = sharp(icon).withMetadata()
  const sharpBackground = background
    ? sharp(background).withMetadata()
    : sharp({
      create: {
        width: 12,
        height: 12,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })

  return {
    ...opts,

    icon: sharpIcon,
    iconBuffer: await sharpIcon.toBuffer(),
    background: sharpBackground,

    compression: {
      ico: getIcoCompression(qualityLevel),
      png: getPngCompression(qualityLevel),
    },

    pngColor: getRgbColor(pngColor),
    splashscreenColor: getRgbColor(splashscreenColor)
  }
}
