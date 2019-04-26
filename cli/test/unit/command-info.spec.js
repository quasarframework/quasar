'use strict';

describe('command: info', function() {

  it('should be able to gather runtime information', function() {
    var info = require('../../lib/cmds/info');

    expect(info).to.be.an('array');
    info.forEach(function(category) {
      expect(category).to.be.an('object');
      expect(category.title).to.be.a('string');
      expect(category.items).to.be.an('array');
    });
  });

});
