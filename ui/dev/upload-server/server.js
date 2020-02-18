const express = require('express')
const app = express()
const formidable = require('formidable')
const path = require('path')
const rimraf = require('rimraf')
const fs = require('fs')
const throttle = require('express-throttle-bandwidth')

const
  port = process.env.PORT || 4444,
  folder = path.join(__dirname, 'files')

if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder)
}
else {
  rimraf.sync(path.join(folder, '*'))
}

process.on('exit', () => {
  rimraf.sync(path.join(folder))
})

app.set('port', port)
app.use(throttle(1024 * 128))

app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.post('/upload', (req, res) => {
  rimraf.sync(path.join(folder, '*'))
  const form = new formidable.IncomingForm()

  form.uploadDir = folder
  form.parse(req, (_, fields, files) => {
    console.log('\n-----------')
    console.log('Fields', fields)
    console.log('Received:', Object.keys(files))
    console.log()
  })
  res.send('Thank you')
})

app.listen(port, () => {
  console.log('\nUpload server running on http://localhost:' + port + '/upload')
  console.log('You can now upload from main dev server using QUploader')
})
