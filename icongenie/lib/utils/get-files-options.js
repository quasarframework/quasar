import sharp from 'sharp'

import { getIcoCompression, getPngCompression } from './get-compression.js'

function getRgbColor(color) {
  let hex = color.replace(/^#/, '')

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }

  const num = Number.parseInt(hex, 16)

  return {
    r: num >> 16,
    g: (num >> 8) & 255,
    b: num & 255,
    alpha: 1
  }
}

function getSharpBackground(path) {
  return path
    ? sharp(path).withMetadata()
    : sharp({
        create: {
          width: 12,
          height: 12,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        }
      })
}

// the shape of the icon (its alpha channel) filled with one color;
// Android tints the monochrome launcher layer with the theme color
async function getMonochromeIcon(iconBuffer) {
  const { width, height } = await sharp(iconBuffer).metadata()
  const alpha = await sharp(iconBuffer)
    .ensureAlpha()
    .extractChannel('alpha')
    .toBuffer()

  const buffer = await sharp({
    create: { width, height, channels: 3, background: '#000' }
  })
    .joinChannel(alpha)
    .png()
    .toBuffer()

  return sharp(buffer)
}

export async function getFilesOptions({
  quality,
  padding,

  icon,
  iconMonochrome,
  background,
  backgroundDark,

  pngColor,
  splashscreenColor,
  splashscreenDarkColor,

  ...opts
}) {
  const qualityLevel = Number.parseInt(quality, 10)
  const sharpIcon = sharp(icon).withMetadata()
  const sharpIconMonochrome = iconMonochrome
    ? sharp(iconMonochrome).withMetadata()
    : null
  const sharpBackground = getSharpBackground(background)

  if (opts.skipTrim !== true) {
    sharpIcon.trim()
    sharpIconMonochrome?.trim()
  }

  const iconBuffer = await sharpIcon.toBuffer()

  const computedPadding = padding
    ? padding.length === 1
      ? { horiz: padding[0], vert: padding[0] }
      : { horiz: padding[0], vert: padding[1] }
    : { horiz: 0, vert: 0 }

  return {
    ...opts,

    icon: sharpIcon,
    iconBuffer,
    iconMonochrome:
      sharpIconMonochrome ?? (await getMonochromeIcon(iconBuffer)),
    background: sharpBackground,
    backgroundDark: backgroundDark
      ? getSharpBackground(backgroundDark)
      : sharpBackground,

    compression: {
      ico: getIcoCompression(qualityLevel),
      png: getPngCompression(qualityLevel)
    },

    padding: computedPadding,

    pngColor: getRgbColor(pngColor),
    splashscreenColor: getRgbColor(splashscreenColor),
    splashscreenDarkColor: splashscreenDarkColor
      ? getRgbColor(splashscreenDarkColor)
      : null
  }
}
