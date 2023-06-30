const HtmlWebpackPlugin = require('html-webpack-plugin')

function makeTag (tagName, attributes) {
  return {
    tagName,
    attributes,
    closeTag: false
  }
}

function fillPwaTags (
  data,
  {
    build: { publicPath },
    pwa: { manifest, manifestFilename, injectPwaMetaTags, useCredentialsForManifestTag }
  }
) {
  data.headTags.push(
    // Add to home screen for Android and modern mobile browsers
    makeTag('link', {
      rel: 'manifest',
      href: `${ publicPath }${ manifestFilename }`,
      ...(useCredentialsForManifestTag ? { crossorigin: 'use-credentials' } : {})
    })
  )

  if (injectPwaMetaTags === true) {
    if (manifest.theme_color !== void 0) {
      data.headTags.push(
        makeTag('meta', {
          name: 'theme-color',
          content: manifest.theme_color
        }),

        makeTag('link', {
          rel: 'mask-icon',
          href: `${ publicPath }icons/safari-pinned-tab.svg`,
          color: manifest.theme_color
        })
      )
    }

    if (manifest.name !== void 0) {
      makeTag('meta', {
        name: 'apple-mobile-web-app-title',
        content: manifest.name
      })
    }

    data.headTags.push(
      // Add to home screen for Safari on iOS
      makeTag('meta', {
        name: `${ publicPath }apple-mobile-web-app-capable`,
        content: 'yes'
      }),
      makeTag('meta', {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'default'
      }),
      makeTag('link', {
        rel: 'apple-touch-icon',
        href: `${ publicPath }icons/apple-icon-120x120.png`
      }),
      makeTag('link', {
        rel: 'apple-touch-icon',
        sizes: '152x152',
        href: `${ publicPath }icons/apple-icon-152x152.png`
      }),
      makeTag('link', {
        rel: 'apple-touch-icon',
        sizes: '167x167',
        href: `${ publicPath }icons/apple-icon-167x167.png`
      }),
      makeTag('link', {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: `${ publicPath }icons/apple-icon-180x180.png`
      }),

      // Add to home screen for Windows
      makeTag('meta', {
        name: 'msapplication-TileImage',
        content: `${ publicPath }icons/ms-icon-144x144.png`
      }),
      makeTag('meta', {
        name: 'msapplication-TileColor',
        content: '#000000'
      })
    )
  }
  else if (typeof injectPwaMetaTags === 'function') {
    const tags = injectPwaMetaTags({ manifest, publicPath })

    Array.isArray(tags) && tags.forEach(tag => {
      data.headTags.push({
        tagName: tag.tagName,
        attributes: tag.attributes,
        closeTag: tag.closeTag || false
      })
    })
  }
}

module.exports.fillPwaTags = fillPwaTags

module.exports.HtmlPwaPlugin = class HtmlPwaPlugin {
  constructor (cfg = {}) {
    this.cfg = cfg
  }

  apply (compiler) {
    compiler.hooks.compilation.tap('webpack-plugin-html-pwa', compilation => {
      const hooks = HtmlWebpackPlugin.getHooks(compilation)

      hooks.afterTemplateExecution.tapAsync('webpack-plugin-html-pwa', (data, callback) => {
        fillPwaTags(data, this.cfg)

        // finally, inform Webpack that we're ready
        callback(null, data)
      })
    })
  }
}
