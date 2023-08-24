
const preloadRE = /"__VITE_PRELOAD__"/g

const jsRE = /\.js$/
const htmlRE = /\.html$/
const cssRE = /\.css$/

function replaceScript (html, scriptFilename, scriptCode) {
  const reScript = new RegExp(`<script([^>]*?) src="[./]*${ scriptFilename }"([^>]*)></script>`)
  const newCode = scriptCode.replace(preloadRE, 'void 0')
  return html
    .replace(reScript, (_, beforeSrc, afterSrc) => `<script${ beforeSrc }${ afterSrc }>\n${ newCode }\n</script>`)
    .replace(/<script type="module" crossorigin>/g, '<script type="module">')
}

function replaceCss (html, scriptFilename, scriptCode) {
  const reCss = new RegExp(`<link[^>]*? href="[./]*${ scriptFilename }"[^>]*?>`)
  return html.replace(reCss, `<style>\n${ scriptCode }\n</style>`)
}

function updateOutput (out) {
  out.inlineDynamicImports = true
}

module.exports = function viteSingleFile () {
  return {
    name: 'single-file',
    enforce: 'post',

    config: cfg => {
      cfg.build = Object.assign(cfg.build || {}, {
        base: void 0,
        assetsInlineLimit: Number.MAX_SAFE_INTEGER,
        chunkSizeWarningLimit: Number.MAX_SAFE_INTEGER,
        cssCodeSplit: false,
        rollupOptions: Object.assign(cfg.build.rollupOptions || {}, {
          output: {}
        })
      })

      if (Array.isArray(cfg.build.rollupOptions.output)) {
        for (const entry in cfg.build.rollupOptions.output) {
          updateOutput(entry)
        }
      }
      else {
        updateOutput(cfg.build.rollupOptions.output)
      }
    },

    generateBundle: (_, bundle) => {
      const htmlFiles = Object.keys(bundle).filter(entry => htmlRE.test(entry))
      const cssAssets = Object.keys(bundle).filter(entry => cssRE.test(entry))
      const jsAssets = Object.keys(bundle).filter(entry => jsRE.test(entry))

      const deleteList = []

      for (const name of htmlFiles) {
        const htmlChunk = bundle[ name ]
        let replacedHtml = htmlChunk.source

        for (const jsName of jsAssets) {
          const jsChunk = bundle[ jsName ]
          if (jsChunk.code != null) {
            deleteList.push(jsName)
            replacedHtml = replaceScript(replacedHtml, jsChunk.fileName, jsChunk.code)
          }
        }

        for (const cssName of cssAssets) {
          const cssChunk = bundle[ cssName ]
          deleteList.push(cssName)
          replacedHtml = replaceCss(replacedHtml, cssChunk.fileName, cssChunk.source)
        }

        htmlChunk.source = replacedHtml
      }

      for (const name of deleteList) {
        delete bundle[ name ]
      }
    }
  }
}
