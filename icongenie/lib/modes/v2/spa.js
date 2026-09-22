export const favicons = [
  {
    generator: 'png',
    name: 'favicon-{size}x{size}.png',
    folder: 'public/icons',
    sizes: [128, 96, 32, 16],
    tag: `<link rel="icon" type="image/png" sizes="{size}x{size}" href="icons/{name}">`
  },

  {
    generator: 'ico',
    name: 'favicon.ico',
    folder: 'public',
    tag: `<link rel="icon" type="image/ico" href="{name}">`
  }
]

export default [
  ...favicons,

  {
    // Safari's "Add to Home Screen" / macOS "Add to Dock" of a plain website
    generator: 'png',
    name: 'apple-icon-{size}x{size}.png',
    folder: 'public/icons',
    background: true,
    sizes: [180],
    tag: `<link rel="apple-touch-icon" sizes="{size}x{size}" href="icons/{name}">`
  }
]
