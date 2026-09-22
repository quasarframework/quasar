import { existsSync, lstatSync } from 'node:fs'
import { isAbsolute, join, normalize, resolve } from 'node:path'
import untildify from 'untildify'

import { getPngSize } from './get-png-size.js'
import { warn } from './logger.js'
import { generators } from '../generators/index.js'
import { defaultParams } from './default-params.js'
import { appDir } from './app-paths.js'
import { modes } from '../modes/index.js'

const modesList = Object.keys(modes)

function die(msg) {
  warn(msg)
  warn()
  process.exit(1)
}

function profile(value, argv) {
  if (!value) return

  const profilePath = resolve(process.cwd(), untildify(value))

  if (!existsSync(profilePath)) {
    die(`Profile param does not point to a file or folder that exists!`)
  }

  if (!value.endsWith('.json') && !lstatSync(profilePath).isDirectory()) {
    die(`Specified profile (${value}) is not a .json file`)
  }

  argv.profile = profilePath
}

function mode(value, argv) {
  if (!value) {
    argv.mode = modesList
    return
  }

  const list = value.split(',')

  if (list.includes('all')) {
    argv.mode = modesList
    return
  }

  if (list.some(item => !modesList.includes(item))) {
    die(`Invalid mode requested: "${value}"`)
  }

  argv.mode = list
}

function include(value, argv) {
  if (!value) return

  if (value.includes('all')) {
    argv.include = modesList
    return
  }

  if (value.some(item => !modesList.includes(item))) {
    die(`Invalid include requested: "${value}"`)
  }
}

function quality(value, argv) {
  if (!value) {
    argv.quality = defaultParams.quality
    return
  }

  const numeric = Number.parseInt(value, 10)

  if (Number.isNaN(numeric)) {
    die(`Invalid quality level number specified`)
  }
  if (numeric < 1 || numeric > 12) {
    die(`Invalid quality level specified (${value}) - should be between 1 - 12`)
  }

  argv.quality = numeric
}

function filter(value) {
  if (value && !Object.keys(generators).includes(value)) {
    die(`Unknown filter value specified (${value}); there is no such generator`)
  }
}

function padding(value, argv) {
  if (!value) {
    argv.padding = [0, 0]
    return
  }

  const sizes = (Array.isArray(value) ? value : value.split(',')).map(val =>
    Number.parseInt(val, 10)
  )

  if (sizes.length > 2) {
    die(`Invalid padding specified`)
  }

  sizes.forEach(size => {
    if (Number.isNaN(size)) {
      die(`Invalid padding specified (not numbers)`)
    }
    if (size < 0) {
      die(`Invalid padding specified (not all positive numbers)`)
    }
  })

  argv.padding = sizes.length === 1 ? [sizes[0], sizes[0]] : sizes
}

function parseIconPath(value) {
  const __path = untildify(value)

  if (isAbsolute(__path)) {
    return existsSync(__path) ? __path : null
  }

  let localIcon = resolve(process.cwd(), __path)

  if (existsSync(localIcon)) {
    return localIcon
  }

  localIcon = resolve(appDir, __path)

  return existsSync(localIcon) ? localIcon : null
}

function icon(value, argv) {
  if (!value) {
    warn(`No source icon file specified, so using the sample one`)
    argv.icon = normalize(
      join(import.meta.dirname, '../../samples/icongenie-icon.png')
    )
    return
  }

  argv.icon = parseIconPath(value)

  if (!argv.icon) {
    die(`Path to source icon file does not exists: "${value}"`)
  }

  const { width, height } = getPngSize(argv.icon)

  if (width === 0 && height === 0) {
    die(`Icon source is not a PNG file!`)
  }

  if (width < 64 || height < 64) {
    die(`Icon source file does not have the minimum 64x64px resolution`)
  }
}

function getBackgroundParser(name) {
  return (value, argv) => {
    if (!value) return

    argv[name] = resolve(appDir, untildify(value))

    if (!existsSync(argv[name])) {
      die(`Path to ${name} source file does not exists: "${value}"`)
    }

    const { width, height } = getPngSize(argv[name])

    if (width === 0 && height === 0) {
      die(`The ${name} source file is not a PNG file!`)
    }

    if (width < 128 || height < 128) {
      die(
        `The ${name} source file does not have the minimum 128x128px resolution`
      )
    }
  }
}

// optional; without it the monochrome launcher layer is derived from the icon
function iconMonochrome(value, argv) {
  if (!value) return

  argv.iconMonochrome = parseIconPath(value)

  if (!argv.iconMonochrome) {
    die(`Path to monochrome icon source file does not exists: "${value}"`)
  }

  const { width, height } = getPngSize(argv.iconMonochrome)

  if (width === 0 && height === 0) {
    die(`Monochrome icon source is not a PNG file!`)
  }

  if (width < 64 || height < 64) {
    die(
      `Monochrome icon source file does not have the minimum 64x64px resolution`
    )
  }
}

function parseColor(name, value) {
  if (
    (value.length !== 3 && value.length !== 6) ||
    !/^[0-9A-Fa-f]+$/.test(value)
  ) {
    die(`Invalid ${name} color specified: "${value}"`)
  }

  return '#' + value
}

function getColorParser(name, defaultValue) {
  return (value, argv) => {
    argv[name] = value
      ? parseColor(name, value)
      : argv.themeColor || defaultValue
  }
}

// optional; its presence is what enables the dark splashscreens
function splashscreenDarkColor(value, argv) {
  if (value) {
    argv.splashscreenDarkColor = parseColor('splashscreenDarkColor', value)
  }
}

function splashscreenIconRatio(value, argv) {
  if (!value && value !== 0) {
    argv.splashscreenIconRatio = defaultParams.splashscreenIconRatio
    return
  }

  const numeric = Number.parseFloat(value)

  if (Number.isNaN(numeric)) {
    die(`Invalid splashscreen icon ratio number specified`)
  }
  if (numeric < 0 || numeric > 100) {
    die(
      `Invalid splashscreen icon ratio specified (${value}) - should be between 0 - 100`
    )
  }

  argv.splashscreenIconRatio = numeric
}

function output(value) {
  if (!value) {
    die(`The "output" param is required`)
  }
}

function assets(value, argv) {
  if (!value) {
    argv.assets = []
    return
  }

  const list = value.split(',')

  if (list.includes('all')) {
    argv.assets = modesList
    return
  }

  if (list.some(item => !modesList.includes(item))) {
    die(`Invalid assets requested: "${value}"`)
  }

  argv.assets = list
}

const parsers = {
  profile,
  mode,
  quality,
  filter,
  padding,
  icon,
  iconMonochrome,
  background: getBackgroundParser('background'),
  backgroundDark: getBackgroundParser('backgroundDark'),
  splashscreenIconRatio,

  themeColor: getColorParser('themeColor'),
  pngColor: getColorParser('pngColor', defaultParams.pngColor),
  splashscreenColor: getColorParser(
    'splashscreenColor',
    defaultParams.splashscreenColor
  ),
  svgColor: getColorParser('svgColor', defaultParams.svgColor),
  splashscreenDarkColor,

  include, // profile file param

  output, // profile cmd
  assets // profile cmd
}

export function parseArgv(argv, list) {
  list.forEach(name => {
    const fn = parsers[name]
    if (fn === void 0) {
      die(`Invalid command parameter specified (${name})`)
    }

    fn(argv[name], argv)
  })
}
