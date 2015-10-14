describe('.env', function() {

  it('should have detectors', function() {
    expect(quasar.env).to.exist;

    expect(quasar.env.cordova).to.exist;
    expect(quasar.env.cordova).to.equal(false);

    expect(quasar.env.mobile).to.exist;
    expect(quasar.env.touch).to.exist;
  });

  it('should have only boolean properties', function() {
    _(quasar.env).forEach(function(property) {
      expect(property).to.be.boolean;
    });
  });

});
