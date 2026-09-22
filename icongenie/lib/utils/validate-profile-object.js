// oxlint-disable unicorn/no-thenable

import Joi from 'joi'
import { red } from 'kolorist'

import { generators } from '../generators/index.js'
import { modes } from '../modes/index.js'
import { launcherVariants } from '../generators/launcher.js'

const generatorsList = Object.keys(generators)
const modesList = ['all', ...Object.keys(modes)]
const platformsList = [
  'cordova-ios',
  'cordova-android',
  'capacitor-ios',
  'capacitor-android'
]
const iosScalesList = ['1x', '2x', '3x']

const baseParamsSchema = {
  include: Joi.array()
    .min(1)
    .items(Joi.string().valid(...modesList)),

  icon: Joi.string().min(1),
  iconMonochrome: Joi.string().min(1),
  background: Joi.string().min(1),
  backgroundDark: Joi.string().min(1),

  filter: Joi.string().valid(...generatorsList),
  quality: Joi.number().integer().min(1).max(12),

  skipTrim: Joi.boolean(),
  padding: Joi.array().items(Joi.number().integer().min(0)).min(1).max(2),

  splashscreenIconRatio: Joi.number().integer().min(0).max(100)
}

const assetsSchema = Joi.array().items({
  generator: Joi.string()
    .required()
    .valid(...generatorsList),
  name: Joi.string().required().min(1),
  folder: Joi.string().required().min(1),

  background: Joi.when('generator', { is: 'png', then: Joi.boolean() }),

  variant: Joi.when('generator', {
    is: 'launcher',
    then: Joi.string()
      .required()
      .valid(...launcherVariants)
  }),

  dark: Joi.when('generator', { is: 'splashscreen', then: Joi.boolean() }),

  platform: Joi.when('generator', [
    { is: 'png', then: Joi.string().valid(...platformsList) },
    { is: 'splashscreen', then: Joi.string().valid(...platformsList) },
    { is: 'launcher', then: Joi.string().valid('capacitor-android') }
  ]),

  density: Joi.when('platform', [
    { is: 'cordova-android', then: Joi.string().required().min(1) }
  ]),

  scale: Joi.when('platform', {
    is: 'capacitor-ios',
    then: Joi.when('generator', {
      is: 'splashscreen',
      then: Joi.string()
        .required()
        .valid(...iosScalesList)
    })
  }),

  sizes: Joi.when('generator', {
    is: Joi.valid('png', 'splashscreen', 'launcher'),
    then: Joi.array()
      .required()
      .min(1)
      .items(
        Joi.number().integer().min(1),
        Joi.array().items(Joi.number().integer().min(1)).length(2)
      )
  }),

  tag: Joi.string()
})

/**
 * When generating the profile file, we don't want to validate with # on the hex color.
 * When generating the icon, we're expecting a hash on the color (automatically added to user input via the CLI)
 */
const getColorParamsSchema = requireHash => {
  const colorPattern = Joi.string().pattern(
    new RegExp(`^${requireHash ? '#' : ''}[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$`)
  )
  return {
    themeColor: colorPattern,
    pngColor: colorPattern,
    splashscreenColor: colorPattern,
    splashscreenDarkColor: colorPattern,
    svgColor: colorPattern
  }
}

const getParamsSchema = isGeneratingProfileFile => ({
  ...baseParamsSchema,
  ...getColorParamsSchema(!isGeneratingProfileFile)
})

export function validateProfileObject(
  profileObject,
  generatingProfileFile = false
) {
  const profileSchema = Joi.object({
    params: getParamsSchema(generatingProfileFile),
    assets: assetsSchema
  })

  const { error } = profileSchema.validate(profileObject)
  if (error) {
    console.error(
      ` ${red('ERROR')}: Input parameters are not valid. Please correct them.`
    )
    console.error(` ${error}`)
    console.log()
    process.exit(1)
  }
}
