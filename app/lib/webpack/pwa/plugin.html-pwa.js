function makeTag (tagName, attributes) {
  return {
    tagName,
    attributes,
    closeTag: false
  }
}

function fillPwaTags (data, { pwa: { manifest, metaVariables }}) {
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
      content: metaVariables.appleMobileWebAppCapable
    }),
    makeTag('meta', {
      name: 'apple-mobile-web-app-status-bar-style',
      content: metaVariables.appleMobileWebAppStatusBarStyle
    }),
    makeTag('meta', {
      name: 'apple-mobile-web-app-title',
      content: manifest.name
    }),
    makeTag('link', {
      rel: 'apple-touch-icon',
      href: metaVariables.appleTouchIcon120
    }),
    makeTag('link', {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: metaVariables.appleTouchIcon180
    }),
    makeTag('link', {
      rel: 'apple-touch-icon',
      sizes: '152x152',
      href: metaVariables.appleTouchIcon152
    }),
    makeTag('link', {
      rel: 'apple-touch-icon',
      sizes: '167x167',
      href: metaVariables.appleTouchIcon167
    }),
    makeTag('link', {
      rel: 'mask-icon',
      href: metaVariables.appleSafariPinnedTab,
      color: manifest.theme_color
    }),

    // Add to home screen for Windows
    makeTag('meta', {
      name: 'msapplication-TileImage',
      content: metaVariables.msapplicationTileImage
    }),
    makeTag('meta', {
      name: 'msapplication-TileColor',
      content: metaVariables.msapplicationTileColor
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
