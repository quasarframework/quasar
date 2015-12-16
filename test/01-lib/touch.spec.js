'use strict';

describe('touch', function() {

  beforeEach(function() {
    this.node = $('<div>').appendTo($('body'));
  });
  afterEach(function() {
    this.node.remove();
  });

  it('should be able to hammerify node', function() {
    var value = this.node.hammer();

    expect(value.addClass).to.be.a('function');
    expect(this.node.getHammer()).to.be.an('object');
  });

  it('should not override Hammer object on node', function() {
    this.node.hammer();

    var hammer = this.node.getHammer();

    this.node.hammer();
    expect(this.node.getHammer()).to.deep.equal(hammer);
  });

  it('should throw error when getting Hammer object on multiple nodes at once', function() {
    expect(function() {
      $('script').getHammer();
    }).to.throw(/Hammer/);
  });

});
