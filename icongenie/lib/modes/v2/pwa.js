import { favicons } from './spa.js'

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
  // the apple touch icon comes from the list below (tag auto-injected)
  ...favicons,

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

  {
    generator: 'launcher',
    name: 'icon-maskable-{size}x{size}.png',
    folder: 'public/icons',
    variant: 'maskable',
    sizes: [512]
    // manifest icon with "purpose": "maskable"
  },

  {
    generator: 'launcher',
    name: 'icon-monochrome-{size}x{size}.png',
    folder: 'public/icons',
    variant: 'monochrome',
    sizes: [512]
    // manifest icon with "purpose": "monochrome"
  },

  // Devices able to run iOS/iPadOS 17.2 (the Safari floor of Baseline
  // Widely Available, see /start/browser-support) or later
  ...[
    [1320, 2868, 3, '<!-- iPhone 18 Pro Max, 17 Pro Max, 16 Pro Max -->'],
    [1206, 2622, 3, '<!-- iPhone 18 Pro, 17 Pro, 17, 16 Pro -->'],
    [1878, 2670, 3, '<!-- iPhone Duo (inner display) -->'],
    [1398, 2034, 3, '<!-- iPhone Duo (outer display) -->'],
    [1260, 2736, 3, '<!-- iPhone Air -->'],
    [1290, 2796, 3, '<!-- iPhone 16 Plus, 15 Pro Max, 15 Plus, 14 Pro Max -->'],
    [1179, 2556, 3, '<!-- iPhone 16, 15 Pro, 15, 14 Pro -->'],
    [1284, 2778, 3, '<!-- iPhone 14 Plus, 13 Pro Max, 12 Pro Max -->'],
    [1170, 2532, 3, '<!-- iPhone 17e, 16e, 14, 13 Pro, 13, 12 Pro, 12 -->'],
    [1080, 2340, 3, '<!-- iPhone 13 mini, 12 mini -->'],
    [1242, 2688, 3, '<!-- iPhone 11 Pro Max, XS Max -->'],
    [1125, 2436, 3, '<!-- iPhone 11 Pro, XS -->'],
    [828, 1792, 2, '<!-- iPhone 11, XR -->'],
    [750, 1334, 2, '<!-- iPhone SE (2nd & 3rd gen) -->'],

    [2064, 2752, 2, '<!-- iPad Pro 13" (M4, M5) -->'],
    [
      2048,
      2732,
      2,
      '<!-- iPad Pro 12.9" (2nd gen and later), iPad Air 13" (M2 and later) -->'
    ],
    [1668, 2420, 2, '<!-- iPad Pro 11" (M4, M5) -->'],
    [1668, 2388, 2, '<!-- iPad Pro 11" (1st gen up to M2) -->'],
    [
      1640,
      2360,
      2,
      '<!-- iPad (A16), iPad 10th gen, iPad Air 11" (M2 and later), iPad Air 4th & 5th gen -->'
    ],
    [1668, 2224, 2, '<!-- iPad Pro 10.5", iPad Air 3rd gen -->'],
    [1620, 2160, 2, '<!-- iPad 7th, 8th & 9th gen -->'],
    [1488, 2266, 2, '<!-- iPad mini 6th gen, iPad mini (A17 Pro) -->'],
    [1536, 2048, 2, '<!-- iPad mini 5th gen, iPad 6th gen -->']
  ].map(getAppleLaunch)
]
