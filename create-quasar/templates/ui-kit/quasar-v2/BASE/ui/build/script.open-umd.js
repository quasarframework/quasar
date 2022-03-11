const { resolve } = require('path')
const open = require('open')

open(
  resolve(__dirname, '../umd-test.html')
)
