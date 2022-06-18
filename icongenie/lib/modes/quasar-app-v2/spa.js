module.exports = [
  {
    generator: 'png',
    name: 'favicon-{size}x{size}.png',
    folder: 'public/icons',
    sizes: [ 128, 96, 32, 16 ],
    tag: `<link rel="icon" type="image/png" sizes="{size}x{size}" href="icons/{name}">`
  },

  {
    generator: 'ico',
    name: 'favicon.ico',
    folder: 'public',
    tag: `<link rel="icon" type="image/ico" href="{name}">`
  }
]
