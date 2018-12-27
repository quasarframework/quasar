const appPaths = require('../app-paths')

function makeTag (tagName, attributes, closeTag = false) {
  return {
    tagName,
    attributes,
    closeTag
  }
}

function makeScriptTag (innerHTML) {
  return {
    tagName: 'script',
    closeTag: true,
    innerHTML
  }
}

function fillHtmlTags (data, cfg) {
  if (cfg.build.appBase) {
    data.head.push(
      makeTag('base', { href: cfg.build.appBase })
    )
  }
}

module.exports.fillHtmlTags = fillHtmlTags

module.exports.plugin = class HtmlAddonsPlugin {
  constructor (cfg = {}) {
    this.cfg = cfg
  }

  apply (compiler) {
    compiler.hooks.compilation.tap('webpack-plugin-html-addons', compilation => {
      compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync('webpack-plugin-html-addons', (data, callback) => {
        fillHtmlTags(data, this.cfg)

        if (this.cfg.ctx.mode.electron && this.cfg.ctx.dev) {
          data.head.push(
            makeScriptTag(`
              require('module').globalPaths.push('${appPaths.resolve.app('node_modules').replace(/\\/g, '\\\\')}')
            `)
          )
        }

        if (this.cfg.ctx.mode.cordova) {
          data.body.unshift(
            makeTag('script', { src: 'cordova.js' }, true)
          )
        }
        else if (this.cfg.ctx.mode.electron && this.cfg.ctx.prod) {
          // set statics path in production;
          // the reason we add this is here is because the folder path
          // needs to be evaluated at runtime
          const bodyScript = `
            window.__statics = require('path').join(__dirname, 'statics').replace(/\\\\/g, '\\\\');
          `
          data.body.push(
            makeScriptTag(bodyScript)
          )
        }

        // finally, inform Webpack that we're ready
        callback(null, data)
      })
    })
  }
}
