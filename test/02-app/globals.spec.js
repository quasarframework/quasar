'use strict';

describe('App globals', function() {

  it('should have a global events emitter', function() {
    expect(quasar.is.events.emitter(quasar.events)).to.equal(true);
  });

});
