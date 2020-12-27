module.exports = [
  {
    // macos
    generator: 'icns',
    name: 'icon.icns',
    folder: 'src-electron/icons'
  },

  {
    // windows
    generator: 'ico',
    name: 'icon.ico',
    folder: 'src-electron/icons'
  },

  {
    // linux
    generator: 'png',
    name: 'linux-512x512.png',
    folder: 'src-electron/icons',
    sizes: [ 512 ]
  }
]
