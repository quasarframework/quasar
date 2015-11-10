'use strict';

describe('App Manifest', function() {

  it('should be able to retrieve app manifest', function(done) {
    var server = sinon.fakeServer.create();
    var manifest = {
      bogus: {
        app: {
          manifest: 'quasar'
        }
      }
    };

    server.autoRespond = true;
    server.respondWith('GET', 'app.json', [200, {'Content-Type': 'application/json'}, JSON.stringify(manifest)]);

    quasar.load.app.manifest(function(err, result) {
      expect(err).to.not.exist;
      expect(result).to.be.an('object');
      expect(result).to.deep.equal(manifest);
      server.restore();
      done();
    });
  });

  it('should throw error when no callback is provided', function() {
    expect(function() {
      quasar.load.app.manifest();
    }).to.throw(/Please provide callback/);
  });

  it('should report error when App manifest cannot be retrieved', function(done) {
    var server = sinon.fakeServer.create();

    server.autoRespond = true;
    server.respondWith('GET', 'app.json', [500, {'Content-Type': 'application/json'}, '']);

    quasar.clear.requests.cache();
    quasar.load.app.manifest(function(err, result) {
      expect(err).to.exist;
      expect(result).to.not.exist;
      server.restore();
      done();
    });
  });

});
