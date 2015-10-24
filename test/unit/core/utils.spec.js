'use strict';

describe('Utils', function() {

  describe('- nextTick', function() {

    it('should delay execution', function(done) {
      var executed = false;

      quasar.nextTick(function() {
        executed = true;
      });

      expect(executed).to.equal(false);

      setTimeout(done, 2);
    });

  });

  describe('- Reflection', function() {

    var result;

    it('should be able to tell function parameters name', function() {
      result = quasar.get.fn.param.names(function testMe(a, b, c) { /* bla bla */ });
      expect(result).to.be.an('array');
      expect(result).to.deep.equal(['a', 'b', 'c']);
    });

    it('should not execute the function', function() {
      var executed = false;

      result = quasar.get.fn.param.names(function testMe(a, b, c) { executed = true; });
      expect(result).to.be.an('array');
      expect(executed).to.equal(false);
    });

    it('should handle comments', function() {
      result = quasar.get.fn.param.names(function testMe(/* wow*/first/*yeah*/, second/*wow*//*yeah*/, third//comments
        ) { /* bla bla */ });
      expect(result).to.be.an('array');
      expect(result).to.deep.equal(['first', 'second', 'third']);
    });

    it('should handle function with no parameters', function() {
      result = quasar.get.fn.param.names(function testMe(/* wow*//*yeah*/) { /* bla bla */ });
      expect(result).to.be.an('array');
      expect(result).to.have.length(0);
    });

  });

  describe(' - Path Normalization', function() {

    var base = window.location.origin + '/';

    it('should handle a non-relative path with no base', function() {
      expect(quasar.get.normalized.path('images/singing')).to.equal(base + 'images/singing');
    });

    it('should handle a relative path with no base', function() {
      expect(quasar.get.normalized.path('images/singing/../folder/second/../../file.js')).to.equal(base + 'images/file.js');
    });

    it('should handle a non-relative path with non-relative base', function() {
      expect(quasar.get.normalized.path('images', '/folder/')).to.equal(base + 'folder/images');
    });

    it('should handle a non-relative path with relative base', function() {
      expect(quasar.get.normalized.path('images', '/folder/../folder/second/../first/../')).to.equal(base + 'folder/images');
    });

    it('should handle a relative path with relative base', function() {
      expect(quasar.get.normalized.path('../second/images', '/folder/../folder/second/../first/../')).to.equal(base + 'second/images');
    });

    it('should handle a relative path with non-relative base', function() {
      expect(quasar.get.normalized.path('../second/images', '/folder')).to.equal(base + 'second/images');
    });

  });

});
