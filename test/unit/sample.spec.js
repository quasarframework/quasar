describe('sample test', function() {
  it('should just pass', function(done) {
    expect(quasar).to.be.ok;
    expect(quasar.log()).to.equal('quasar');
    done();
  });
});
