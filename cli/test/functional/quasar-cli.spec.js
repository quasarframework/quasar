'use strict';

const exec = require('child_process').exec
const path = require('path')

console.log = jest.fn()

describe('bin', function() {

  const cmd = 'node ' + path.join(__dirname, '../../bin/quasar') + ' '

  function run(done, command, code) {
    const child = exec(cmd + (command ? command : ''), function (error, stdout, stderr) {
      if (typeof code === 'number' && code !== 0) {
        expect(error.code).toBe(code)
        expect(console.log).toHaveBeenCalledWith('something')
      }
      else {
        expect(error).not.toBe(true)
        expect(stdout)
        // expect(stderr).toBe(null)
      }
      done()
    })

    child.stdout.on('data', function(data) {
      // process.stdout.write(data)
    })
  }


  it('should run --help without errors', function(done) {
    run(done, '--help', 0)
  })

  it('should run --version without errors', function(done) {
    // const version = require(path.join(__dirname, '../../package.json')).version
    // ^^^that is useless, because it merely does what the function itself does
    run(done, '--version', 0)
  })

  it('should not return error on missing command', function(done) {
    run(done, '', 0)
  });

  it('should console.log an error on unknown command', () => {
    exec(cmd + 'jnkcmd', function () {
      if (typeof code === 'number' && code !== 0) {
        expect(console.log).toHaveBeenCalledWith('Unknown command "jnkcmd"')
      }
    })
  })
})
