const parallel = require('os').cpus().length > 1
const runJob = parallel ? require('child_process').fork : require
const { join } = require('path')

runJob(join(__dirname, './webfonts.js'))
runJob(join(__dirname, './animate.js'))

runJob(join(__dirname, './mdi-v5.js'))
runJob(join(__dirname, './fontawesome-v5.js'))
runJob(join(__dirname, './ionicons-v5.js'))
runJob(join(__dirname, './eva-icons.js'))
runJob(join(__dirname, './themify.js'))
runJob(join(__dirname, './line-awesome.js'))

// this one takes the longest
runJob(join(__dirname, './material-icons.js'))
