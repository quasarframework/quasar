const parallel = require('os').cpus().length > 1
const run = parallel ? require('child_process').fork : require
const { join } = require('path')

function runJob (scriptFile) {
  run(join(__dirname, scriptFile))
}

runJob('./webfonts.js')
runJob('./animate.js')

runJob('./mdi-v5.js')
runJob('./fontawesome-v5.js')
runJob('./ionicons-v5.js')
runJob('./eva-icons.js')
runJob('./themify.js')
runJob('./line-awesome.js')

// this one takes the longest
runJob('./material-icons.js')
