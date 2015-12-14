'use strict';

describe('Environment', function() {

  it('should have detectors', function() {
    expect(quasar.runs.on).to.exist;
    expect(quasar.runs.with).to.exist;
    expect(quasar.runs.with.touch).to.exist;
  });

});
