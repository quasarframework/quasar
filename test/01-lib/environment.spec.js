'use strict';

describe('Environment', function() {

  it('should have detectors', function() {
    expect(quasar.runs.on).to.exist;
    expect(quasar.runs.with).to.exist;

    expect(quasar.runs.on.cordova).to.exist;
    expect(quasar.runs.on.cordova).to.equal(false);

    expect(quasar.runs.on.mobile).to.exist;
    expect(quasar.runs.with.touch).to.exist;
  });

  it('should have only boolean properties', function() {
    _.each(quasar.runs.on, function(property) {
      expect(property).to.be.boolean;
    });
    _.each(quasar.runs.with, function(property) {
      expect(property).to.be.boolean;
    });
  });

});
