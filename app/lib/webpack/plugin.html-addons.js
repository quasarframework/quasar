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

function fillBaseTag (html, base) {
  return html.replace(
    /(<head[^>]*)(>)/i,
    (found, start, end) => `${start}${end}<base href="${base}">`
  )
}

module.exports.fillBaseTag = fillBaseTag

module.exports.plugin = class HtmlAddonsPlugin {
  constructor (cfg = {}) {
    this.cfg = cfg
  }

  apply (compiler) {
    compiler.hooks.compilation.tap('webpack-plugin-html-addons', compilation => {
      if (this.cfg.build.appBase) {
        compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync('webpack-plugin-html-base-tag', (data, callback) => {
          data.html = fillBaseTag(data.html, this.cfg.build.appBase)
          callback(null, data)
        })
      }

      compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync('webpack-plugin-html-addons', (data, callback) => {
        if (this.cfg.ctx.mode.cordova) {
          data.body.unshift(
            makeTag('script', { src: 'cordova.js' }, true)
          )
        }
        else if (this.cfg.ctx.mode.electron && this.cfg.ctx.prod && this.cfg.electron.nodeIntegration === true) {
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
