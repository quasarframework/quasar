'use strict';

var
  exec = require('child_process').exec,
  path = require('path')
  ;

describe('bin', function() {

  var cmd = 'node ' + path.join(__dirname, '../../bin/quasar') + ' ';

  function run(done, command, code) {
    var child = exec(cmd + (command ? command : ''), function(error, stdout, stderr) {
      if (typeof code === 'number') {
        expect(error).to.exist;
        expect(error.code).to.equal(code);
      }
      else {
        expect(error).to.not.exist;
        expect(stdout).to.not.contain('error');
        expect(stderr).to.be.empty;
      }
      done();
    });

    child.stdout.on('data', function(data) {
      process.stdout.write(data);
    });
  }


  it('should run --help without errors', function(done) {
    run(done, '--help');
  });

  it('should run --version without errors', function(done) {
    run(done, '--version');
  });

  it('should return error on missing command', function(done) {
    this.timeout(4000);
    run(done, '', 1);
  });

  it('should return error on unknown command', function(done) {
    this.timeout(4000);
    run(done, 'junkcmd', 1);
  });

});
