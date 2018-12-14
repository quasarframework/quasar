function makeTag (tagName, attributes) {
  return {
    tagName,
    attributes,
    closeTag: false
  }
}

function fillPwaTags (data, { pwa: { manifest }}) {
  data.head.push(
    // Add to home screen for Android and modern mobile browsers
    makeTag('link', {
      rel: 'manifest',
      href: 'manifest.json'
    }),
    makeTag('meta', {
      name: 'theme-color',
      content: manifest.theme_color
    }),

    // Add to home screen for Safari on iOS
    makeTag('meta', {
      name: 'apple-mobile-web-app-capable',
      content: 'yes'
    }),
    makeTag('meta', {
      name: 'apple-mobile-web-app-status-bar-style',
      content: manifest.background_color
    }),
    makeTag('meta', {
      name: 'apple-mobile-web-app-title',
      content: manifest.name
    }),
    makeTag('link', {
      rel: 'apple-touch-icon',
      href: 'statics/icons/apple-icon-152x152.png'
    }),
    /* makeTag('link', {
      rel: 'mask-icon',
      href: 'statics/icons/safari-pinned-tab.svg',
      color: manifest.theme_color
    }), */

    // Add to home screen for Windows
    makeTag('meta', {
      name: 'msapplication-TileImage',
      content: 'statics/icons/ms-icon-144x144.png'
    }),
    makeTag('meta', {
      name: 'msapplication-TileColor',
      content: manifest.background_color
    })
  )
}

module.exports.fillPwaTags = fillPwaTags

module.exports.plugin = class HtmlPwaPlugin {
  constructor (cfg = {}) {
    this.cfg = cfg
  }

  apply (compiler) {
    compiler.hooks.compilation.tap('webpack-plugin-html-pwa', compilation => {
      compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync('webpack-plugin-html-pwa', (data, callback) => {
        fillPwaTags(data, this.cfg)

        // finally, inform Webpack that we're ready
        callback(null, data)
      })
    })
  }
}
