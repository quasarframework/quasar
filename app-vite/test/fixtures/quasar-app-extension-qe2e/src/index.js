import markers from './markers.js'

export default function qe2eExtension(api) {
  api.extendQuasarConf(conf => {
    conf.htmlVariables.qe2eMarker = markers.quasarConfMarker
  })

  // proves the AE-extended Vite config reaches a real build
  api.extendViteConf(conf => {
    conf.plugins ||= []
    conf.plugins.push({
      name: 'qe2e-marker',
      transformIndexHtml: html =>
        html.replace('</body>', `${markers.viteHtmlMarker}</body>`)
    })
  })

  api.registerCommand('greet', () => {
    console.log(markers.greetCommandOutput)
  })

  api.registerDescribeApi('Qe2eThing', './describe-api/qe2e-thing.json')
}
