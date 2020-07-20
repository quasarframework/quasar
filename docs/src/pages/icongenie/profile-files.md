---
title: Icon Genie Profile Files
desc: How to use profile files with the Icon Genie CLI.
---

If you need to automate the creation of all your app's icons and splash screens, Icon Genie offers configuration files which can be run in batch.

These configuration files are called "profile files". The files are in JSON format and tell Icon Genie which images to generate and how to generate them. They also spare you from having to remember the whole set of Icon Genie commands and parameters to generate your assets.

## File structure

The generic form of a JSON profile file is:

```json
{
  "params": { },
  "assets": [ ]
}
```

We will be discussing each in the next sections.

### Params

The `params` object from a JSON profile file takes the same prop names as the [generate](/icongenie/command-list#Generate) command parameters (but camelCased instead of the CLI's kebab-case). There is one key difference: instead of using `mode` (examples: "spa,pwa", "all") you will be writing `include` (examples: [ "spa", "pwa" ], [ "all" ]).

Full list of props that you can write for the `params` object:

| Prop name | Type | Description | Examples |
| --- | --- | --- | --- |
| include | Array | Include Icon Genie hardcoded sets of assets for specific Quasar modes | `[ "spa", "pwa" ]` / `[ "all" ]` |
| icon | String | Path to source file for icon; can be absolute or relative to the root of the Quasar project folder | `my-icon.png` |
| background | String | Path to optional background source file (for splash screens); can be absolute or relative to the root of the Quasar project folder | `my-bg.png` |
| filter | String | Optionally filter the assets by generators; when used, it can generate only one type of asset instead of all | `ico` |
| quality | Number [1-12] | Quality of the generated files; higher quality means bigger filesize, slower; lower quality means smaller filesize, faster | `12` |
| padding | Array [Number] | (v2.1+) Apply fixed padding to the icon image after trimming it; Syntax: [ <horiz_px>, <vert_px> ]; Default is: [0, 0] | `[10, 0]` / `[5,5]` |
| skipTrim | Boolean | (v2.2+) Do not trim the icon source file | |
| themeColor | String [hex] | Rather than using the other color related props, you can use this one; it will be used by each generator (that uses a color) | `ccc` / `e2b399` |
| themeColor | String [hex] | Theme color to use for all generators requiring a color; it gets overridden if any generator color is also specified | `ccc` / `e2b399` |
| pngColor | String [hex] | Background color to use for the png generator, when "background: true" in the asset definition (like for the cordova/capacitor iOS icons) | `ccc` / `e2b399` |
| splashscreenColor | String [hex] | Background color to use for the splashscreen generator | `ccc` / `e2b399` |
| svgColor | String [hex] | Color to use for the generated monochrome SVGs | `ccc` / `e2b399` |
| splashscreenIconRatio | Number [0-100] | Ratio of icon size in respect to the width or height (whichever is smaller) of the resulting splashscreen; represents percentages; 0 means it won't add the icon of top of the background | `40` |

### Assets

The `assets` array can contain custom definitions for **extra assets**, should you need them. This can be used when Icon Genie's default list for each mode is not sufficient for your use case. If you don't specify the `include` prop in `params` you can only generate your custom assets.

In 99% of the cases you won't need to specify the `assets` array, but Icon Genie is designed to be very flexible, so it includes this feature too.

Some examples for `assets` from which you can extract the syntax for every type of possible asset that Icon Genie can generate:

```json
"assets": [
  {
    "generator": "png",
    "name": "icon-{size}x{size}.png",
    "folder": "src-bex/icons",
    "sizes": [ 16, 48, 128 ]
  },

  {
    "generator": "svg",
    "name": "safari-pinned-tab.svg",
    "folder": "public/icons"
  },

  {
    "generator": "splashscreen",
    "name": "apple-launch-{size}.png",
    "folder": "public/icons",
    "sizes": [
      [ 1668, 2388 ]
    ],
    "tag": "<link rel=\"apple-touch-startup-image\" media=\"(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)\" href=\"icons/{name}\">"
  },

  {
    "generator": "icns",
    "name": "icon.icns",
    "folder": "src-electron/icons"
  },

  {
    "generator": "ico",
    "name": "icon.ico",
    "folder": "src-electron/icons"
  },

  {
    "generator": "splashscreen",
    "name": "Default-Landscape-2436h.png",
    "folder": "src-cordova/res/screen/ios",
    "sizes": [
      [ 2436, 1125 ]
    ]
  },

  {
    "generator": "png",
    "name": "icon-29@2x.png",
    "folder": "src-cordova/res/ios",
    "sizes": [ 58 ],
    "platform": "cordova-ios",
    "background": true
  },

  {
    "generator": "png",
    "name": "icon-29@2x.png",
    "folder": "src-cordova/res/ios",
    "sizes": [ 58 ],
    "platform": "cordova-ios",
    "background": true
  },

  {
    "generator": "png",
    "name": "xxxhdpi.png",
    "folder": "src-cordova/res/android",
    "sizes": [ 192 ],
    "platform": "cordova-android",
    "density": "xxxhdpi"
  },

  {
    "generator": "splashscreen",
    "name": "Default@2x~ipad~comany.png",
    "folder": "src-cordova/res/screen/ios",
    "sizes": [
      [ 1278, 2732 ]
    ],
    "platform": "cordova-ios"
  },

  {
    "generator": "splashscreen",
    "name": "splash-land-xxxhdpi.png",
    "folder": "src-cordova/res/screen/android",
    "sizes": [
      [ 1920, 1280 ]
    ],
    "platform": "cordova-android",
    "density": "land-xxxhdpi"
  }
]
```

## Bootstrap profiles

Icon Genie also offers the [profile command](/icongenie/command-list#Profile) which can bootstrap JSON profile files for you. It can help you create one or more such files that you can then run in batch through the [generate command](/icongenie/command-list#Generate) with `--profile` param (or short `-p`).

The most handy use case is to generate multiple profile files into one specific folder, each with their own parameters, and then run all of them through `$ icongenie generate -p /path/to/folder`.
