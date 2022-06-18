module.exports = [
  {
    generator: 'png',
    name: 'favicon-{size}x{size}.png',
    folder: 'src/statics/icons',
    sizes: [ 128, 96, 32, 16 ],
    tag: `<link rel="icon" type="image/png" sizes="{size}x{size}" href="statics/icons/{name}">`
  },

  {
    generator: 'ico',
    name: 'favicon.ico',
    folder: 'src/statics/icons',
    tag: `<link rel="icon" type="image/ico" href="statics/icons/{name}">`
  }
]
