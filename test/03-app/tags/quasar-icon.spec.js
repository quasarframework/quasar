'use strict';

describe('Tag: quasar-icon', function() {

  beforeEach(function() {
    testing.app.reset();
    testing.app.prepare();
  });
  afterEach(function() {
    testing.app.reset();
  });

  it('should be able to render without attribs', function(done) {
    testing.done.set(done);
    testing.app.tag(
      '<quasar-icon></quasar-icon>',
      function() {
        expect(_html).to.equal('<i class="icon"></i>');
        testing.done();
      }
    );
  });

  it('should be able to render with attribs', function(done) {
    testing.done.set(done);
    testing.app.tag(
      '<quasar-icon alarm></quasar-icon>',
      function() {
        expect(_html).to.equal('<i class="icon alarm"></i>');
        testing.done();
      }
    );
  });

  it('should be able to render with binded attribs', function(done) {
    done();
    return;
    testing.done.set(done);
    testing.app.tag(
      '<quasar-icon :name=></quasar-icon>',
      function() {
        expect(_html).to.equal('<i class="icon alarm"></i>');
        testing.done();
      }
    );
  });

});
