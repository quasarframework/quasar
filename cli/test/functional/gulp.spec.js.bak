'use strict';

var
  exec = require('child_process').exec,
  path = require('path'),
  fs = require('../../lib/file-system'),
  request = require('sync-request'),
  del = require('del')
  ;

describe('bin - gulp', function() {

  var
    timeout = (process.env.CIRCLECI ? 40 : 30) * 1000,
    folder = 'test-app-gulp',
    cmd = 'node ' + path.join(__dirname, '../../bin/quasar') + ' ',
    cwd = path.join(process.cwd(), folder);

  function run(callback, opts, args) {
    return exec(
      cmd + args + ' -d',
      opts,
      function(error, stdout, stderr) {
        expect(stdout).to.not.contain('ERROR');

        if (error && error.killed && error.signal == 'SIGKILL') {
          callback();
          return;
        }

        expect(error).to.not.exist;
        expect(stderr).to.be.empty;
        callback();
      }
    );
  }

  before(function() {
    fs.remove(folder);
  });
  after(function() {
    fs.remove(folder);
  });

  this.timeout(timeout);

  it('should be able to create a new App', function(done) {
    run(done, {}, 'new ' + folder);
  });

  it('should be able to build App for Development', function(done) {
    run(
      function() {
        expect(fs.exists(folder + '/dist')).to.equal(true);
        del.sync(folder + '/dist');
        done();
      },
      {cwd: cwd},
      'build'
    );
  });

  it('should be able to build App for Production', function(done) {
    run(
      function() {
        expect(fs.exists(folder + '/dist')).to.equal(true);
        done();
      },
      {cwd: cwd},
      'build -p'
    );
  });

  it.skip('should be able to test App', function(done) {
    run(
      function() {
        done();
      },
      {cwd: cwd},
      'test'
    );
  });

  it('should be able to clean App after builds', function(done) {
    run(
      function() {
        expect(fs.exists(folder + '/dist')).to.equal(false);
        expect(fs.exists(folder + '/coverage')).to.equal(false);
        done();
      },
      {cwd: cwd},
      'clean'
    );
  });

  it('should be able to monitor App', function(done) {
    var child = run(
      function() {},
      {cwd: cwd, timeout: timeout / 2},
      'monitor'
    );

    child.on('error', function() {
      throw new Error('Should not error out.');
    });
    child.stderr.on('data', function() {
      throw new Error('Should not write to stderr.');
    });
    child.on('close', function() {
      expect(fs.exists(folder + '/dist')).to.equal(true);
      done();
    });
    child.kill('SIGKILL');
  });


  function preview(command, done) {
    var
      serverWorking,
      port = command === 'preview' ? '3000' : '3100'
      ;

    var child = run(
      function() {},
      {cwd: cwd, timeout: timeout - 100},
      command
    );

    child.on('error', function() {
      throw new Error('Should not error out.');
    });
    child.stderr.on('data', function() {
      throw new Error('Should not write to stderr.');
    });
    child.on('close', function(code) {
      expect(fs.exists(folder + '/dist')).to.equal(true);
      expect(serverWorking).to.equal(true);
      done();
    });

    var fn = function() {
      var req;

      try {
        req = request('GET', 'http://localhost:' + port, {
          timeout: 200
        });
      }
      catch(e) {
      }

      if (req && req.statusCode === 200) {
        serverWorking = true;
        child.kill('SIGKILL');
        return;
      }

      setTimeout(fn, 100);
    };

    setTimeout(fn, 1000);
  }
  it('should be able to preview App', function(done) {
    preview('preview', done);
  });
  it('should be able to preview App with Responsive View', function(done) {
    preview('responsive', done);
  });

});
