import spaEntries from './spa.js'

/* def: width, height, pixel-ratio */
function getAppleLaunch(def) {
  const media = `(device-width: ${def[0] / def[2]}px) and (device-height: ${def[1] / def[2]}px) and (-webkit-device-pixel-ratio: ${def[2]})`

  return {
    generator: 'splashscreen',
    name: 'apple-launch-{size}.png',
    folder: 'public/icons',
    sizes: [[def[0], def[1]]],
    tag: `${def[3]}\n<link rel="apple-touch-startup-image" media="${media}" href="icons/{name}">`
  }
}

export default [
  ...spaEntries,

  {
    generator: 'png',
    name: 'apple-icon-{size}x{size}.png',
    folder: 'public/icons',
    background: true,
    sizes: [120, 152, 167, 180]
    // tag is auto-injected by @quasar/app
    // <link rel="apple-touch-icon" sizes="{size}x{size}" href="icons/{name}">
  },

  {
    generator: 'svg',
    name: 'safari-pinned-tab.svg',
    folder: 'public/icons'
    // tag is auto-injected by @quasar/app
    // <link rel="mask-icon" color="#..." href="icons/{name}">
  },

  {
    generator: 'png',
    name: 'icon-{size}x{size}.png',
    folder: 'public/icons',
    sizes: [128, 192, 256, 384, 512]
    // manifest icons
  },

  ...[
    [1320, 2868, 3, '<!-- iPhone 17 Pro Max, 16 Pro Max -->'],
    [1260, 2736, 3, '<!-- iPhone 17 Air -->'],
    [1206, 2622, 3, '<!-- iPhone 17 Pro, 17, 16 Pro -->'],
    [1290, 2796, 3, '<!-- iPhone 16 Plus, 15 Pro Max, 15 Plus, 14 Pro Max -->'],
    [1179, 2556, 3, '<!-- iPhone 16, 15 Pro, 15, 14 Pro -->'],
    [1284, 2778, 3, '<!-- iPhone 14 Plus, 13 Pro Max, 12 Pro Max -->'],
    [1170, 2532, 3, '<!-- iPhone 17e, 16e, 14, 13 Pro, 13, 12 Pro, 12 -->'],
    [1080, 2340, 3, '<!-- iPhone 13 mini, 12 mini -->'],
    [1242, 2688, 3, '<!-- iPhone 11 Pro Max, XS Max -->'],
    [1125, 2436, 3, '<!-- iPhone 11 Pro, X, XS -->'],
    [828, 1792, 2, '<!-- iPhone 11, XR -->'],
    [1242, 2208, 3, '<!-- iPhone 8 Plus, 7 Plus, 6s Plus, 6 Plus -->'],
    [750, 1334, 2, '<!-- iPhone 8, 7, 6s, 6, SE (2nd & 3rd gen) -->'],

    [2064, 2752, 2, '<!-- iPad Pro 13" (M4) -->'],
    [2048, 2732, 2, '<!-- iPad Pro 12.9", iPad Air 13" (M2) -->'],
    [1668, 2420, 2, '<!-- iPad Pro 11" (M4) -->'],
    [1668, 2388, 2, '<!-- iPad Pro 11" (M1/M2) -->'],
    [
      1640,
      2360,
      2,
      '<!-- iPad 11" (11th gen), iPad 10.9" (10th gen), iPad Air 11" (M2), iPad Air 10.9" -->'
    ],
    [1668, 2224, 2, '<!-- iPad Pro 10.5", iPad Air 3rd Gen -->'],
    [1620, 2160, 2, '<!-- iPad 10.2" (7th, 8th, 9th gen) -->'],
    [1488, 2266, 2, '<!-- iPad Mini (6th & 7th gen) -->'],
    [
      1536,
      2048,
      2,
      '<!-- iPad Mini (up to 5th gen), iPad Air 9.7", iPad 9.7" -->'
    ]
  ].map(getAppleLaunch)
]
