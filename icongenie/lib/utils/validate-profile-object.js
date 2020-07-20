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

const colorParamsSchemaProfileSave = {
  themeColor: Joi.string().pattern(/^[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/),
  pngColor: Joi.string().pattern(/^[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/),
  splashscreenColor: Joi.string().pattern(/^[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/),
  svgColor: Joi.string().pattern(/^[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/),
}

const colorParamsSchema = {
  themeColor: Joi.string().pattern(/^#[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/),
  pngColor: Joi.string().pattern(/^#[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/),
  splashscreenColor: Joi.string().pattern(/^#[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/),
  svgColor: Joi.string().pattern(/^#[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/),
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

module.exports = function validateProfileObject (profileObject, generatingProfileFile = false) {
  // ? - When generating the profile file, we don't want to validate with # on the hex color.
  // : - When generating the icon, we're expecting a hash on the color (automatically added to user input via the CLI)
  const colorParams = generatingProfileFile
    ? colorParamsSchemaProfileSave
    : colorParamsSchema

  const profileSchema = Joi.object({
    params: {
      ...baseParamsSchema,
      ...colorParams
    },
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
