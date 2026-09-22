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
  "params": {},
  "assets": []
}
```

We will be discussing each in the next sections.

### Params

The `params` object from a JSON profile file takes the same prop names as the [generate](/icongenie/command-list#generate) command parameters (but camelCased instead of the CLI's kebab-case). There is one key difference: instead of using `mode` (examples: "spa,pwa", "all") you will be writing `include` (examples: [ "spa", "pwa" ], [ "all" ]).

Full list of props that you can write for the `params` object:

| Prop name             | Type           | Description                                                                                                                                                                                                                                 | Examples                         |
| --------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| include               | Array          | Include Icon Genie hardcoded sets of assets for specific Quasar modes                                                                                                                                                                       | `[ "spa", "pwa" ]` / `[ "all" ]` |
| icon                  | String         | Path to source file for icon; can be absolute or relative to the root of the Quasar project folder                                                                                                                                          | `my-icon.png`                    |
| iconMonochrome        | String         | Path to optional source file for the monochrome layer of the Android adaptive icon (Android 13+ themed icons); only its shape is used; defaults to the shape of the icon source file                                                        | `my-icon-mono.png`               |
| background            | String         | Path to optional background source file (for splash screens and the Android adaptive icon background layer); can be absolute or relative to the root of the Quasar project folder                                                           | `my-bg.png`                      |
| backgroundDark        | String         | Path to optional background source file for the dark variants of the splash screens; defaults to the background source file                                                                                                                 | `my-bg-dark.png`                 |
| filter                | String         | Optionally filter the assets by generators; when used, it can generate only one type of asset instead of all                                                                                                                                | `ico`                            |
| quality               | Number [1-12]  | Quality of the generated files; higher quality means bigger filesize, slower; lower quality means smaller filesize, faster                                                                                                                  | `12`                             |
| padding               | Array          | Apply padding to the icon image after trimming it; Syntax: `[ <horiz>, <vert> ]`, each a number of pixels or a percentage string of the resulting image size (so that it scales with every generated size); Default is: [0, 0]              | `[10, 0]` / `["8%", "4%"]`       |
| skipTrim              | Boolean        | Do not trim the icon source file                                                                                                                                                                                                            |                                  |
| themeColor            | String [hex]   | Theme color to use for all generators requiring a color; it gets overridden if any generator color is also specified                                                                                                                        | `ccc` / `e2b399`                 |
| pngColor              | String [hex]   | Background color to use for the png generator, when "background: true" in the asset definition (like for the cordova/capacitor iOS icons) and for the Android adaptive icon background layer                                                | `ccc` / `e2b399`                 |
| splashscreenColor     | String [hex]   | Background color to use for the splashscreen generator                                                                                                                                                                                      | `ccc` / `e2b399`                 |
| splashscreenDarkColor | String [hex]   | Background color for the dark variants of the splash screens (Capacitor mode: Android "night" resources and the iOS dark appearance); when not specified, the dark variants are not generated and any previously generated ones get removed | `121212`                         |
| svgColor              | String [hex]   | Color to use for the generated monochrome SVGs                                                                                                                                                                                              | `ccc` / `e2b399`                 |
| splashscreenIconRatio | Number [0-100] | Ratio of icon size in respect to the width or height (whichever is smaller) of the resulting splashscreen; represents percentages; 0 means it won't add the icon of top of the background                                                   | `40`                             |

### Assets

The `assets` array can contain custom definitions for **extra assets**, should you need them. This can be used when Icon Genie's default list for each mode is not sufficient for your use case. If you don't specify the `include` prop in `params` you can only generate your custom assets.

In 99% of the cases you won't need to specify the `assets` array, but Icon Genie is designed to be very flexible, so it includes this feature too.

Asset `folder` and `name` values are resolved relative to the Quasar project folder. They cannot target a location outside the project folder, either directly or through a symbolic link.

Some asset props only apply to specific generators or platforms:

| Prop name  | Applies to                        | Description                                                                                                                                                                                                                                                                             |
| ---------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| background | `png`                             | Fill the transparent areas with `pngColor`                                                                                                                                                                                                                                              |
| platform   | `png`, `splashscreen`, `launcher` | Registers the asset with the native project: `cordova-android` / `cordova-ios` (config.xml), `capacitor-android` (adaptive icon XML) / `capacitor-ios` (Contents.json)                                                                                                                  |
| density    | `cordova-android`                 | The `density` attribute of the config.xml `<icon>` entry (not needed by the `maskable` splash screen icon)                                                                                                                                                                              |
| variant    | `launcher`                        | Which Android launcher icon to compose: `foreground` / `background` / `monochrome` (the adaptive icon layers, 108dp canvas), `maskable` (the layered canvas, for web app manifest maskable icons and the Android 12 splash screen icon), `legacy` / `round` (pre Android 8 icons, 48dp) |
| scale      | `capacitor-ios` splash screens    | The scale of the Contents.json entry: `1x`, `2x` or `3x`                                                                                                                                                                                                                                |
| appearance | `png`                             | iOS 18+ app icon variant for `cordova-ios` / `capacitor-ios`: `dark` (icon on a transparent background) or `tinted` (grayscale)                                                                                                                                                         |
| dark       | `splashscreen`                    | Dark variant: uses `backgroundDark` and `splashscreenDarkColor` as the background and is only generated when the latter is set                                                                                                                                                          |
| tag        | any                               | Tag to print at the end, for you to add to your /index.html; `{size}` and `{name}` placeholders are available                                                                                                                                                                           |

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
    "folder": "src-electron/electron-assets/icons"
  },

  {
    "generator": "ico",
    "name": "icon.ico",
    "folder": "src-electron/electron-assets/icons"
  },

  {
    "generator": "launcher",
    "name": "icon-maskable-512x512.png",
    "folder": "public/icons",
    "sizes": [ 512 ],
    "variant": "maskable"
  },

  {
    "generator": "png",
    "name": "icon.png",
    "folder": "src-cordova/res/ios",
    "sizes": [ 1024 ],
    "platform": "cordova-ios",
    "background": true
  },

  {
    "generator": "launcher",
    "name": "xxxhdpi-foreground.png",
    "folder": "src-cordova/res/android",
    "sizes": [ 432 ],
    "platform": "cordova-android",
    "density": "xxxhdpi",
    "variant": "foreground"
  },

  {
    "generator": "launcher",
    "name": "splashscreen.png",
    "folder": "src-cordova/res/screen/android",
    "sizes": [ 960 ],
    "platform": "cordova-android",
    "variant": "maskable"
  },

  {
    "generator": "png",
    "name": "icon-dark.png",
    "folder": "src-cordova/res/ios",
    "sizes": [ 1024 ],
    "platform": "cordova-ios",
    "appearance": "dark"
  },

  {
    "generator": "splashscreen",
    "name": "Default@2x~universal~comany.png",
    "folder": "src-cordova/res/screen/ios",
    "sizes": [
      [ 1278, 2732 ]
    ],
    "platform": "cordova-ios"
  },

  {
    "generator": "launcher",
    "name": "ic_launcher_foreground.png",
    "folder": "src-capacitor/android/app/src/main/res/mipmap-xxxhdpi",
    "sizes": [ 432 ],
    "platform": "capacitor-android",
    "variant": "foreground"
  },

  {
    "generator": "splashscreen",
    "name": "splash.png",
    "folder": "src-capacitor/android/app/src/main/res/drawable-port-night-xxxhdpi",
    "sizes": [
      [ 1280, 1920 ]
    ],
    "platform": "capacitor-android",
    "dark": true
  },

  {
    "generator": "png",
    "name": "AppIcon-512@2x.png",
    "folder": "src-capacitor/ios/App/App/Assets.xcassets/AppIcon.appiconset",
    "sizes": [ 1024 ],
    "platform": "capacitor-ios",
    "background": true
  },

  {
    "generator": "splashscreen",
    "name": "splash-2732x2732-dark.png",
    "folder": "src-capacitor/ios/App/App/Assets.xcassets/Splash.imageset",
    "sizes": [ 2732 ],
    "platform": "capacitor-ios",
    "scale": "3x",
    "dark": true
  }
]
```

## Bootstrap profiles

Icon Genie also offers the [profile command](/icongenie/command-list#profile) which can bootstrap JSON profile files for you. It can help you create one or more such files that you can then run in batch through the [generate command](/icongenie/command-list#generate) with `--profile` param (or short `-p`).

The most handy use case is to generate multiple profile files into one specific folder, each with their own parameters, and then run all of them through `icongenie generate -p /path/to/folder`.
