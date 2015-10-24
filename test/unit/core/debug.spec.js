'use strict';

describe('.debug', function() {

  beforeEach(function() {
    sinon.spy(console, 'log');
  });

  afterEach(function() {
    console.log.restore();
  });

  !testing.phantomjs && it('should print stack', function() {
    quasar.debug.printStack();
    expect(console.log).to.have.been.called;
  });

  it('should profile function', function() {
    expect(quasar.debug.profile).to.exist;

    quasar.debug.profile('profile');
    quasar.debug.profile('profile');
    expect(console.log).to.have.been.calledTwice;
  });

});
