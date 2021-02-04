const iosIconRegex = /icon-(\d+\.?\d?)@?(\d+)?x?\.png/

function getAndroidIcon (entry) {
  return {
    generator: 'png',
    name: `${entry[0]}.png`,
    folder: 'src-cordova/res/android',
    sizes: [ entry[1] ],
    platform: 'cordova-android',
    density: entry[0]
  }
}

function getAndroidSplashscreens (entries) {
  const list = []

  entries.forEach(entry => {
    list.push({
      generator: 'splashscreen',
      name: `splash-land-${entry[0]}.png`,
      folder: 'src-cordova/res/screen/android',
      sizes: [
        [ entry[1], entry[2] ]
      ],
      platform: 'cordova-android',
      density: `land-${entry[0]}`
    })

    list.push({
      generator: 'splashscreen',
      name: `splash-port-${entry[0]}.png`,
      folder: 'src-cordova/res/screen/android',
      sizes: [
        [ entry[2], entry[1] ]
      ],
      platform: 'cordova-android',
      density: `port-${entry[0]}`
    })
  })

  return list
}

function getIosIcon (name) {
  const [,size,multiplier] = name.match(iosIconRegex)

  return {
    generator: 'png',
    name,
    folder: 'src-cordova/res/ios',
    sizes: [
      multiplier
        ? parseFloat(size) * parseInt(multiplier,10)
        : parseFloat(size)
    ],
    platform: 'cordova-ios',
    background: true
  }
}

function getIosSplashscreen (entry) {
  return {
    generator: 'splashscreen',
    name: entry[0],
    folder: 'src-cordova/res/screen/ios',
    sizes: [
      [ entry[1], entry[2] ]
    ],
    platform: 'cordova-ios'
  }
}

module.exports = [
  /***************
   *** Android ***
   ***************/

  ...[
    [ 'ldpi', 36 ],
    [ 'mdpi', 48 ],
    [ 'hdpi', 72 ],
    [ 'xhdpi', 96 ],
    [ 'xxhdpi', 144 ],
    [ 'xxxhdpi', 192 ],
  ].map(getAndroidIcon),

  ...getAndroidSplashscreens([
    [ 'ldpi', 320, 200 ],
    [ 'mdpi', 480, 320 ],
    [ 'hdpi', 800, 480 ],
    [ 'xhdpi', 1280, 720 ],
    [ 'xxhdpi', 1600, 960 ],
    [ 'xxxhdpi', 1920, 1280 ]
  ]),

  /**************
   **** iOS *****
   **************/

  {
    generator: 'png',
    name: 'icon.png',
    folder: 'src-cordova/res/ios',
    sizes: [ 57 ],
    platform: 'cordova-ios',
    background: true
  },
  {
    generator: 'png',
    name: 'icon@2x.png',
    folder: 'src-cordova/res/ios',
    sizes: [ 114 ],
    platform: 'cordova-ios',
    background: true
  },

  ...[
    'icon-20@2x.png',
    'icon-20@3x.png',
    'icon-29.png',
    'icon-29@2x.png',
    'icon-29@3x.png',
    'icon-40@2x.png',
    'icon-60@2x.png',
    'icon-60@3x.png',
    'icon-20.png',
    'icon-20@2x.png',
    'icon-40.png',
    'icon-50.png',
    'icon-50@2x.png',
    'icon-72.png',
    'icon-72@2x.png',
    'icon-76.png',
    'icon-76@2x.png',
    'icon-83.5@2x.png',
    'icon-1024.png',
    'icon-24@2x.png',
    'icon-27.5@2x.png',
    'icon-29@2x.png',
    'icon-29@3x.png',
    'icon-40@2x.png',
    'icon-44@2x.png',
    'icon-50@2x.png',
    'icon-86@2x.png',
    'icon-98@2x.png'
  ].map(getIosIcon),

  ...[
    [ 'Default@2x~iphone~anyany.png', 1334, 1334 ],
    [ 'Default@2x~iphone~comany.png', 750, 1334 ],
    [ 'Default@2x~iphone~comcom.png', 1334, 750 ],
    [ 'Default@3x~iphone~anyany.png', 2208, 2208 ],
    [ 'Default@3x~iphone~anycom.png', 2208, 1242 ],
    [ 'Default@3x~iphone~comany.png', 1242, 2208 ],
    [ 'Default@2x~ipad~anyany.png', 2732, 2732 ],
    [ 'Default@2x~ipad~comany.png', 1278, 2732 ]
  ].map(getIosSplashscreen)
]
