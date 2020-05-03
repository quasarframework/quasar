const iosIconRegex = /AppIcon-(\d+\.?\d?)x?(\d+\.?\d?)?@?(\d+)?x?-?\d?\.png/

function getAndroidIcons (entries) {
  const list = []

  entries.forEach(entry => {
    const icon = {
      generator: 'png',
      folder: `src-capacitor/android/app/src/main/res/mipmap-${entry[0]}`
    }

    list.push({
      ...icon,
      name: 'ic_launcher_foreground.png',
      sizes: [ entry[2] ]
    })

    list.push({
      ...icon,
      name: 'ic_launcher_round.png',
      sizes: [ entry[1] ]
    })

    list.push({
      ...icon,
      name: 'ic_launcher.png',
      sizes: [ entry[1] ]
    })
  })

  return list
}

function getAndroidSplashscreen (entries) {
  const list = []

  entries.forEach(entry => {
    const icon = {
      generator: 'splashscreen',
      name: 'splash.png'
    }

    list.push({
      ...icon,
      folder: `src-capacitor/android/app/src/main/res/drawable-land-${entry[0]}`,
      sizes: [
        [ entry[1], entry[2] ]
      ]
    })

    list.push({
      ...icon,
      folder: `src-capacitor/android/app/src/main/res/drawable-port-${entry[0]}`,
      sizes: [
        [ entry[2], entry[1] ]
      ]
    })
  })

  return list
}

function getIosIcon (name) {
  const [,size,,multiplier] = name.match(iosIconRegex)

  return {
    generator: 'png',
    name,
    folder: 'src-capacitor/ios/App/App/Assets.xcassets/AppIcon.appiconset',
    sizes: [
      multiplier
        ? parseFloat(size) * parseInt(multiplier,10)
        : parseFloat(size)
    ],
    background: true
  }
}

module.exports = [
  /***************
   *** Android ***
   ***************/

  ...getAndroidIcons([
    [ 'hdpi', 49, 162 ],
    [ 'mdpi', 48, 108 ],
    [ 'xhdpi', 96, 216 ],
    [ 'xxhdpi', 144, 324 ],
    [ 'xxxhdpi', 192, 432 ]
  ]),

  {
    generator: 'splashscreen',
    name: 'splash.png',
    folder: 'src-capacitor/android/app/src/main/res/drawable',
    sizes: [
      [ 480, 320 ]
    ]
  },

  ...getAndroidSplashscreen([
    [ 'mdpi', 480, 320 ],
    [ 'hdpi', 800, 480 ],
    [ 'xhdpi', 1280, 720 ],
    [ 'xxhdpi', 1600, 960 ],
    [ 'xxxhdpi', 1920, 1280 ]
  ]),

  /**************
   **** iOS *****
   **************/

  ...[
    'AppIcon-20x20@1x.png',
    'AppIcon-20x20@2x-1.png',
    'AppIcon-20x20@2x.png',
    'AppIcon-20x20@3x.png',
    'AppIcon-29x29@1x.png',
    'AppIcon-29x29@2x-1.png',
    'AppIcon-29x29@2x.png',
    'AppIcon-29x29@3x.png',
    'AppIcon-40x40@1x.png',
    'AppIcon-40x40@2x-1.png',
    'AppIcon-40x40@2x.png',
    'AppIcon-40x40@3x.png',
    'AppIcon-60x60@2x.png',
    'AppIcon-60x60@3x.png',
    'AppIcon-76x76@1x.png',
    'AppIcon-76x76@2x.png',
    'AppIcon-83.5x83.5@2x.png',
    'AppIcon-512@2x.png'
  ].map(getIosIcon),

  {
    generator: 'splashscreen',
    name: 'splash-2732x2732-1.png',
    folder: 'src-capacitor/ios/App/App/Assets.xcassets/Splash.imageset',
    sizes: [ 2732 ]
  },

  {
    generator: 'splashscreen',
    name: 'splash-2732x2732-2.png',
    folder: 'src-capacitor/ios/App/App/Assets.xcassets/Splash.imageset',
    sizes: [ 2732 ]
  },

  {
    generator: 'splashscreen',
    name: 'splash-2732x2732.png',
    folder: 'src-capacitor/ios/App/App/Assets.xcassets/Splash.imageset',
    sizes: [ 2732 ]
  }
]
