module.exports = [
  {
    // macos (embedded icons)
    generator: 'icns',
    name: 'icon.icns',
    folder: 'src-electron/icons'
  },

  {
    // windows (embedded icon)
    generator: 'ico',
    name: 'icon.ico',
    folder: 'src-electron/icons'
  },

  {
    // linux (not really needed)
    generator: 'png',
    name: 'linux-512x512.png',
    folder: 'src-electron/icons',
    sizes: [ 512 ]
  },
  {
    // tray icon (all platforms)
    generator: 'png',
    name: 'icon.png',
    folder: 'src-electron/icons',
    sizes: [ 512 ]
  }
]
