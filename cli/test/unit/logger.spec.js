'use strict';

var logger = require('../../lib/logger');

describe('logger', function() {

  var program = {
    normalize: function() {
      return '';
    },
    option: function() {}
  };

  beforeEach(function() {
    sinon.spy(console, 'log');
  });
  afterEach(function() {
    console.log.restore();
  });

  it('should inject methods into program', function() {
    logger(program);
    expect(program.log).to.exist;
  });

  it('should log a message', function() {
    program.log('msg');
    expect(console.log).to.have.been.calledOnce;
    expect(console.log).to.have.been.calledWith('msg');
  });

  it('should log empty line', function() {
    program.log();
    expect(console.log).to.have.been.calledOnce;
    expect(console.log).to.have.been.calledWith();
  });

  it('should log a specific type of message', function() {
    program.log.info('msg');
    expect(console.log).to.have.been.calledOnce;
  });

  it('should not output debug when debug is disabled', function() {
    program.log.debug('msg');
    expect(console.log).to.not.have.been.called;
  });

  it('should output debug when debug is enabled', function() {
    program.normalize = function() {
      return '-d';
    };
    logger(program);
    program.log.debug('msg');
    expect(console.log).to.have.been.calledOnce;
  });

});
