export default function qe2eExtension(api) {
  api.extendQuasarConf(conf => {
    conf.htmlVariables.qe2eMarker = 'qe2e-extension-active'
  })

  api.registerCommand('greet', () => {
    console.log('qe2e greet command executed')
  })

  api.registerDescribeApi('Qe2eThing', './describe-api/qe2e-thing.json')
}
