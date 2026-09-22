const androidRes = 'src-capacitor/android/app/src/main/res'
const iosAssets = 'src-capacitor/ios/App/App/Assets.xcassets'

// [ density, scale ]; launcher icons are 48dp, adaptive icon layers 108dp
const androidDensities = [
  ['mdpi', 1],
  ['hdpi', 1.5],
  ['xhdpi', 2],
  ['xxhdpi', 3],
  ['xxxhdpi', 4]
]

// [ density, landscape width, landscape height ]
const androidSplashscreens = [
  ['mdpi', 480, 320],
  ['hdpi', 800, 480],
  ['xhdpi', 1280, 720],
  ['xxhdpi', 1600, 960],
  ['xxxhdpi', 1920, 1280]
]

// [ name, scale ]
const iosSplashscreens = [
  ['splash-2732x2732-2.png', '1x'],
  ['splash-2732x2732-1.png', '2x'],
  ['splash-2732x2732.png', '3x']
]

function getAndroidIcons() {
  const list = []

  androidDensities.forEach(([density, scale]) => {
    const icon = {
      generator: 'launcher',
      folder: `${androidRes}/mipmap-${density}`,
      platform: 'capacitor-android'
    }

    list.push(
      {
        ...icon,
        name: 'ic_launcher_foreground.png',
        variant: 'foreground',
        sizes: [108 * scale]
      },
      {
        ...icon,
        name: 'ic_launcher_background.png',
        variant: 'background',
        sizes: [108 * scale]
      },
      {
        ...icon,
        name: 'ic_launcher_monochrome.png',
        variant: 'monochrome',
        sizes: [108 * scale]
      },
      {
        ...icon,
        name: 'ic_launcher.png',
        variant: 'legacy',
        sizes: [48 * scale]
      },
      {
        ...icon,
        name: 'ic_launcher_round.png',
        variant: 'round',
        sizes: [48 * scale]
      }
    )
  })

  return list
}

function getAndroidSplashscreens(dark) {
  const suffix = dark ? '-night' : ''
  const splash = {
    generator: 'splashscreen',
    name: 'splash.png',
    platform: 'capacitor-android',
    ...(dark ? { dark: true } : {})
  }

  const list = [
    {
      ...splash,
      folder: `${androidRes}/drawable${suffix}`,
      sizes: [[480, 320]]
    }
  ]

  androidSplashscreens.forEach(([density, width, height]) => {
    list.push(
      {
        ...splash,
        folder: `${androidRes}/drawable-land${suffix}-${density}`,
        sizes: [[width, height]]
      },
      {
        ...splash,
        folder: `${androidRes}/drawable-port${suffix}-${density}`,
        sizes: [[height, width]]
      }
    )
  })

  return list
}

function getIosSplashscreens(dark) {
  return iosSplashscreens.map(([name, scale]) => ({
    generator: 'splashscreen',
    name: dark ? name.replace(/\.png$/, '-dark.png') : name,
    folder: `${iosAssets}/Splash.imageset`,
    sizes: [2732],
    platform: 'capacitor-ios',
    scale,
    ...(dark ? { dark: true } : {})
  }))
}

export default [
  /***************
   *** Android ***
   ***************/

  ...getAndroidIcons(),
  ...getAndroidSplashscreens(false),
  ...getAndroidSplashscreens(true),

  /**************
   **** iOS *****
   **************/

  {
    generator: 'png',
    name: 'AppIcon-512@2x.png',
    folder: `${iosAssets}/AppIcon.appiconset`,
    sizes: [1024],
    platform: 'capacitor-ios',
    background: true
  },

  ...getIosSplashscreens(false),
  ...getIosSplashscreens(true)
]
