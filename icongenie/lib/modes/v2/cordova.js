// Targets cordova-android >= 11 (Android 12 splash screen API, adaptive
// icons) and cordova-ios >= 8 (single 1024px icon with appearance variants)

const androidRes = 'src-cordova/res/android'
const androidScreen = 'src-cordova/res/screen/android'
const iosRes = 'src-cordova/res/ios'
const iosScreen = 'src-cordova/res/screen/ios'

// [ density, scale ]; launcher icons are 48dp, adaptive icon layers 108dp
const androidDensities = [
  ['ldpi', 0.75],
  ['mdpi', 1],
  ['hdpi', 1.5],
  ['xhdpi', 2],
  ['xxhdpi', 3],
  ['xxxhdpi', 4]
]

// [ name, width, height ]
const iosSplashscreens = [
  ['Default@2x~universal~anyany.png', 2732, 2732],
  ['Default@2x~universal~comany.png', 1278, 2732],
  ['Default@2x~universal~comcom.png', 1334, 750],
  ['Default@3x~universal~anyany.png', 2208, 2208],
  ['Default@3x~universal~anycom.png', 2208, 1242],
  ['Default@3x~universal~comany.png', 1242, 2208]
]

function getAndroidIcons() {
  const list = []

  androidDensities.forEach(([density, scale]) => {
    const icon = {
      generator: 'launcher',
      folder: androidRes,
      platform: 'cordova-android',
      density
    }

    list.push(
      {
        ...icon,
        name: `${density}.png`,
        variant: 'legacy',
        sizes: [48 * scale]
      },
      {
        ...icon,
        name: `${density}-foreground.png`,
        variant: 'foreground',
        sizes: [108 * scale]
      },
      {
        ...icon,
        name: `${density}-background.png`,
        variant: 'background',
        sizes: [108 * scale]
      },
      {
        ...icon,
        name: `${density}-monochrome.png`,
        variant: 'monochrome',
        sizes: [108 * scale]
      }
    )
  })

  return list
}

function getIosSplashscreens(dark) {
  return iosSplashscreens.map(([name, width, height]) => ({
    generator: 'splashscreen',
    name: dark ? name.replace(/\.png$/, '~dark.png') : name,
    folder: iosScreen,
    sizes: [[width, height]],
    platform: 'cordova-ios',
    ...(dark ? { dark: true } : {})
  }))
}

export default [
  /***************
   *** Android ***
   ***************/

  ...getAndroidIcons(),

  {
    // the Android 12 splash screen icon: the adaptive icon
    // at 240dp (4x png), masked by the system
    generator: 'launcher',
    name: 'splashscreen.png',
    folder: androidScreen,
    variant: 'maskable',
    sizes: [960],
    platform: 'cordova-android'
  },

  /**************
   **** iOS *****
   **************/

  {
    generator: 'png',
    name: 'icon.png',
    folder: iosRes,
    sizes: [1024],
    platform: 'cordova-ios',
    background: true
  },
  {
    generator: 'png',
    name: 'icon-dark.png',
    folder: iosRes,
    sizes: [1024],
    platform: 'cordova-ios',
    appearance: 'dark'
  },
  {
    generator: 'png',
    name: 'icon-tinted.png',
    folder: iosRes,
    sizes: [1024],
    platform: 'cordova-ios',
    appearance: 'tinted'
  },

  ...getIosSplashscreens(false),
  ...getIosSplashscreens(true)
]

// Files of earlier Icon Genie versions that no Cordova platform
// in range uses anymore; removed when found
export const retired = [
  ...['ldpi', 'mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'].flatMap(density => [
    `${androidScreen}/splash-land-${density}.png`,
    `${androidScreen}/splash-port-${density}.png`
  ]),

  `${iosRes}/icon@2x.png`,
  ...[
    '20',
    '20@2x',
    '20@3x',
    '24@2x',
    '27.5@2x',
    '29',
    '29@2x',
    '29@3x',
    '40',
    '40@2x',
    '44@2x',
    '50',
    '50@2x',
    '60@2x',
    '60@3x',
    '72',
    '72@2x',
    '76',
    '76@2x',
    '83.5@2x',
    '86@2x',
    '98@2x',
    '1024'
  ].map(size => `${iosRes}/icon-${size}.png`),

  ...[
    'Default@2x~iphone~anyany',
    'Default@2x~iphone~comany',
    'Default@2x~iphone~comcom',
    'Default@3x~iphone~anyany',
    'Default@3x~iphone~anycom',
    'Default@3x~iphone~comany',
    'Default@2x~ipad~anyany',
    'Default@2x~ipad~comany'
  ].map(name => `${iosScreen}/${name}.png`)
]
