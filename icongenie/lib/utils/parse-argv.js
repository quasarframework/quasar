const { existsSync, lstatSync } = require('fs')
const { resolve, normalize, join } = require('path')

const getPngSize = require('./get-png-size')
const { warn } = require('./logger')
const generators = require('../generators')
const defaultParams = require('./default-params')

function die (msg) {
  warn(msg)
  warn()
  process.exit(1)
}

function profile (value, argv) {
  if (!value) {
    return
  }

  const profilePath = resolve(process.cwd(), value)

  if (!existsSync(profilePath)) {
    die(`Profile param does not point to a file or folder that exists!`)
  }

  if (
    !value.endsWith('.json') &&
    !lstatSync(profilePath).isDirectory()
  ) {
    die(`Specified profile (${value}) is not a .json file`)
  }

  argv.profile = profilePath
}

function mode (value, argv) {
  const possibleValues = Object.keys(require('../modes'))

  if (!value) {
    argv.mode = possibleValues
    return
  }

  const list = value.split(',')

  if (list.includes('all')) {
    argv.mode = possibleValues
    return
  }

  if (list.some(mode => !possibleValues.includes(mode))) {
    die(`Invalid mode requested: "${value}"`)
  }

  argv.mode = list
}

function include (value, argv) {
  if (!value) {
    return
  }

  const possibleValues = Object.keys(require('../modes'))

  if (value.includes('all')) {
    argv.include = possibleValues
    return
  }

  if (value.some(mode => !possibleValues.includes(mode))) {
    die(`Invalid include requested: "${value}"`)
  }
}

function quality (value, argv) {
  if (!value) {
    argv.quality = defaultParams.quality
    return
  }

  const numeric = parseInt(value, 10)

  if (isNaN(numeric)) {
    die(`Invalid quality level number specified`)
  }
  if (numeric < 1 || numeric > 12) {
    die(`Invalid quality level specified (${value}) - should be between 1 - 12`)
  }

  argv.quality = numeric
}

function filter (value) {
  if (value && !Object.keys(generators).includes(value)) {
    die(`Unknown filter value specified (${value}); there is no such generator`)
  }
}

function icon (value, argv) {
  if (!value) {
    warn(`No source icon file specified, so using the sample one`)
    argv.icon = normalize(join(__dirname, '../../samples/icongenie-icon.png'))
    return
  }


  const { appDir } = require('./app-paths')

  argv.icon = resolve(appDir, value)

  if (!existsSync(argv.icon)) {
    die(`Path to source icon file does not exists: "${value}"`)
  }

  const { width, height } = getPngSize(argv.icon)

  if (width === 0 && height === 0) {
    die(`Icon source is not a PNG file!`)
  }

  if (width < 64 || height < 64) {
    die(`Icon source file does not have the minimum 64x64px resolution`)
  }

  if (width !== height) {
    die(`Icon source file resolution has width !== height`)
  }
}

function background (value, argv) {
  if (!value) {
    return
  }

  const { appDir } = require('./app-paths')

  argv.background = resolve(appDir, value)

  if (!existsSync(argv.background)) {
    die(`Path to background source file does not exists: "${value}"`)
  }

  const { width, height } = getPngSize(argv.background)

  if (width === 0 && height === 0) {
    die(`Background source file is not a PNG file!`)
  }

  if (width < 128 || height < 128) {
    die(`Background source file does not have the minimum 128x128px resolution`)
  }
}

function getColorParser (name, defaultValue) {
  return (value, argv) => {
    if (!value) {
      argv[name] = argv.themeColor || defaultValue
      return
    }

    if (
      (value.length !== 3 && value.length !== 6) ||
      /^[0-9A-Fa-f]+$/.test(value) !== true
    ) {
      die(`Invalid ${name} color specified: "${value}"`)
    }

    argv[name] = '#' + value
  }
}

function splashscreenIconRatio (value, argv) {
  if (!value) {
    argv.splashscreenIconRatio = defaultParams.splashscreenIconRatio
    return
  }

  const numeric = parseInt(value, 10)

  if (isNaN(numeric)) {
    die(`Invalid splashscreen icon ratio number specified`)
  }
  if (numeric < 0 || numeric > 100) {
    die(`Invalid splashscreen icon ratio specified (${value}) - should be between 0 - 100`)
  }

  argv.splashscreenIconRatio = numeric
}

function output (value) {
  if (!value) {
    die(`The "output" param is required`)
  }
}

function assets (value, argv) {
  const possibleValues = Object.keys(require('../modes'))

  if (!value) {
    argv.assets = []
    return
  }

  const list = value.split(',')

  if (list.includes('all')) {
    argv.assets = possibleValues
    return
  }

  if (list.some(mode => !possibleValues.includes(mode))) {
    die(`Invalid assets requested: "${value}"`)
  }

  argv.assets = list
}

const parsers = {
  profile,
  mode,
  quality,
  filter,
  icon,
  background,
  splashscreenIconRatio,

  themeColor: getColorParser('themeColor'),
  pngColor: getColorParser('pngColor', defaultParams.pngColor),
  splashscreenColor: getColorParser('splashscreenColor', defaultParams.splashscreenColor),
  svgColor: getColorParser('svgColor', defaultParams.svgColor),

  include, // profile file param

  output, // profile cmd
  assets // profile cmd
}

module.exports = function (argv, list) {
  list.forEach(name => {
    const fn = parsers[name]
    if (fn === void 0) {
      die(`Invalid command parameter specified (${name})`)
    }

    fn(argv[name], argv)
  })
}
