
export default [
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
    // tray icon (all platforms)
    generator: 'png',
    name: 'icon.png',
    folder: 'src-electron/icons',
    sizes: [ 512 ]
  }
]
