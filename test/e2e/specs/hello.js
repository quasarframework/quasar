casper.on('remote.message', function (e) {
  console.log(e)
})

casper.test.begin('commits', 1, function (test) {
  casper
  .start('test/e2e/dist/index.html')
  .then(function () {
    this.evaluate(function () {
      window.location.hash = '#!/vivi'
    })
  })
  .then(function () {
    // this.echo(this.getCurrentUrl())
    test.assertExists('#quasar-app')
  })
  // run
  .run(function () {
    test.done()
  })
})
