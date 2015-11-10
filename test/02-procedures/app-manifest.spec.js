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

    quasar.load.app.manifest(function(result) {
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

});
