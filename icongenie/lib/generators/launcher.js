import sharp from 'sharp'

import { getSquareIcon } from '../utils/get-square-icon.js'

// Android adaptive icon geometry, in fractions of the 108dp canvas:
// launchers mask the central 72dp (any shape) and guarantee that
// the central 66dp are never clipped
const SAFE_ZONE_RATIO = 66 / 108
const VIEWPORT_RATIO = 72 / 108

const transparent = { r: 0, g: 0, b: 0, alpha: 0 }

function createCanvas(size) {
  return sharp({
    create: { width: size, height: size, channels: 4, background: transparent }
  })
}

function getCircleMask(size) {
  const radius = size / 2
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
      `<circle cx="${radius}" cy="${radius}" r="${radius}"/></svg>`
  )
}

async function getForeground(file, opts, size) {
  const inner = Math.round(size * SAFE_ZONE_RATIO)
  const offset = Math.round((size - inner) / 2)

  const icon = await getSquareIcon({
    file,
    icon: opts.icon,
    size: inner,
    padding: opts.padding
  }).toBuffer()

  return createCanvas(size).composite([
    { input: icon, left: offset, top: offset }
  ])
}

function getBackground(_file, opts, size) {
  return opts.background
    .clone()
    .resize(size, size)
    .flatten({ background: opts.pngColor })
}

// The legacy (pre Android 8) icon is what a launcher gets to show
// of the adaptive icon: the 72dp viewport of the layered 108dp canvas
async function getLegacy(file, opts, size) {
  const canvas = Math.round(size / VIEWPORT_RATIO)
  const offset = Math.round((canvas - size) / 2)

  const [background, foreground] = await Promise.all([
    getBackground(file, opts, canvas).png().toBuffer(),
    getForeground(file, opts, canvas).then(img => img.png().toBuffer())
  ])

  const layered = await sharp(background)
    .composite([{ input: foreground }])
    .png()
    .toBuffer()

  return sharp(layered).extract({
    left: offset,
    top: offset,
    width: size,
    height: size
  })
}

async function getRound(file, opts, size) {
  const legacy = await getLegacy(file, opts, size)
  const square = await legacy.png().toBuffer()

  return sharp(square)
    .ensureAlpha()
    .composite([{ input: getCircleMask(size), blend: 'dest-in' }])
}

const variants = {
  foreground: getForeground,
  background: getBackground,
  legacy: getLegacy,
  round: getRound
}

export const launcherVariants = Object.keys(variants)

export default async function launcher(file, opts, done) {
  const img = await variants[file.variant](file, opts, file.height)

  img
    .png()
    .toFile(file.absoluteName)
    .then(() => opts.compression.png(file.absoluteName))
    .then(done)
}
