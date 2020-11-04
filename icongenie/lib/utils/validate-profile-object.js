const Joi = require('@hapi/joi')
const { red } = require('chalk')

const generatorsList = Object.keys(require('../generators'))
const modesList = [ 'all' ].concat(Object.keys(require('../modes')))
const platformsList = [ 'cordova-ios', 'cordova-android' ]

const baseParamsSchema = {
  include: Joi.array().min(1).items(
    Joi.string().valid(...modesList)
  ),

  icon: Joi.string().min(1),
  background: Joi.string().min(1),

  filter: Joi.string().valid(...generatorsList),
  quality: Joi.number().integer().min(1).max(12),

  skipTrim: Joi.boolean(),
  padding: Joi.array().items(
    Joi.number().integer().min(0)
  ).min(1).max(2),

  splashscreenIconRatio: Joi.number().integer().min(0).max(100)
}

const assetsSchema = Joi.array().items({
  generator: Joi.string().required().valid(...generatorsList),
  name: Joi.string().required().min(1),
  folder: Joi.string().required().min(1),

  background: Joi.when('generator', { is: 'png', then: Joi.boolean() }),

  platform: Joi.when('generator', [
    { is: 'png', then: Joi.string().valid(...platformsList) },
    { is: 'splashscreen', then: Joi.string().valid(...platformsList) }
  ]),

  density: Joi.when('platform', [
    { is: 'cordova-android', then: Joi.string().required().min(1) }
  ]),

  sizes: Joi.when('generator', {
    is: Joi.valid('png', 'splashscreen'),
    then: Joi.array().required().min(1).items(
      Joi.number().integer().min(1),
      Joi.array().items(
        Joi.number().integer().min(1)
      ).length(2)
    )
  }),

  tag: Joi.string()
})

/**
 * When generating the profile file, we don't want to validate with # on the hex color.
 * When generating the icon, we're expecting a hash on the color (automatically added to user input via the CLI)
 */
const getColorParamsSchema = (requireHash) => {
  const colorPattern = Joi.string().pattern(new RegExp(`^${requireHash ? '#' : ''}[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$`))
  return {
    themeColor: colorPattern,
    pngColor: colorPattern,
    splashscreenColor: colorPattern,
    svgColor: colorPattern
  }
}

const getParamsSchema = (isGeneratingProfileFile) => {
  return {
    ...baseParamsSchema,
    ...getColorParamsSchema(isGeneratingProfileFile === false)
  }
}

module.exports = function validateProfileObject (profileObject, generatingProfileFile = false) {
  const profileSchema = Joi.object({
    params: getParamsSchema(generatingProfileFile),
    assets: assetsSchema
  })

  const { error } = profileSchema.validate(profileObject)
  if (error) {
    console.error(` ${red('ERROR')}: Input parameters are not valid. Please correct them.`)
    console.error(` ${error}`)
    console.log()
    process.exit(1)
  }
}
