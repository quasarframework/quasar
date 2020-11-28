const spaEntries = require('./spa')

function getAppleLaunch (def) {
  return {
    generator: 'splashscreen',
    name: 'apple-launch-{size}.png',
    folder: 'src/statics/icons',
    sizes: [
      [ def[0], def[1] ]
    ],
    tag: `${def[3]}\n<link rel="apple-touch-startup-image" media="${def[2]}" href="statics/icons/{name}">`
  }
}

module.exports = [
  ...spaEntries,

  {
    generator: 'png',
    name: 'apple-icon-{size}x{size}.png',
    folder: 'src/statics/icons',
    background: true,
    sizes: [ 120, 152, 167, 180 ]
    // tag is auto-injected by @quasar/app
    // <link rel="apple-touch-icon" sizes="{size}x{size}" href="statics/icons/{name}">
  },

  {
    generator: 'svg',
    name: 'safari-pinned-tab.svg',
    folder: 'src/statics/icons',
    // tag is auto-injected by @quasar/app
    // <link rel="mask-icon" color="#..." href="statics/icons/{name}">
  },

  {
    generator: 'png',
    name: 'ms-icon-{size}x{size}.png',
    folder: 'src/statics/icons',
    sizes: [ 144 ],
    // tag is auto-injected by @quasar/app
    // <meta name="msapplication-TileImage" content="statics/icons/{name}">
  },

  {
    generator: 'png',
    name: 'icon-{size}x{size}.png',
    folder: 'src/statics/icons',
    sizes: [ 128, 192, 256, 384, 512 ]
    // manifest icons
  },

  ...[
    [ 828, 1792, '(width: 414px) and (height: 896px) and (-webkit-device-pixel-ratio: 2)', '<!-- iPhone XR -->' ],
    [ 1125, 2436, '(width: 375px) and (height: 812px) and (-webkit-device-pixel-ratio: 3)', '<!-- iPhone X, XS -->' ],
    [ 1242, 2688, '(width: 414px) and (height: 896px) and (-webkit-device-pixel-ratio: 3)', '<!-- iPhone XS Max -->' ],
    [ 750, 1334, '(width: 375px) and (height: 667px) and (-webkit-device-pixel-ratio: 2)', '<!-- iPhone 8, 7, 6s, 6 -->' ],
    [ 1242, 2208, '(width: 414px) and (height: 736px) and (-webkit-device-pixel-ratio: 3)', '<!-- iPhone 8 Plus, 7 Plus, 6s Plus, 6 Plus -->' ],
    [ 640, 1136, '(width: 320px) and (height: 568px) and (-webkit-device-pixel-ratio: 2)', '<!-- iPhone 5 -->' ],
    [ 1536, 2048, '(width: 768px) and (height: 1024px) and (-webkit-device-pixel-ratio: 2)', '<!-- iPad Mini, Air, 9.7" -->' ],
    [ 1668, 2224, '(width: 834px) and (height: 1112px) and (-webkit-device-pixel-ratio: 2)', '<!-- iPad Pro 10.5" -->' ],
    [ 1668, 2388, '(width: 834px) and (height: 1194px) and (-webkit-device-pixel-ratio: 2)', '<!-- iPad Pro 11" -->' ],
    [ 2048, 2732, '(width: 1024px) and (height: 1366px) and (-webkit-device-pixel-ratio: 2)', '<!-- iPad Pro 12.9" -->' ]
  ].map(getAppleLaunch)
]
