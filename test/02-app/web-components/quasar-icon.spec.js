'use strict';

describe('Tag: i', function() {

  beforeEach(function() {
    testing.app.reset();
    testing.app.prepare();
  });
  after(function() {
    testing.app.reset();
  });

  it('should be able to render without attribs', function(done) {
    testing.done.set(done);
    testing.app.tag(
      '<i></i>',
      function() {
        expect(_html).to.include('<i class="i non-selectable"></i>');
        testing.done();
      }
    );
  });

  it('should be able to render with attribs', function(done) {
    testing.done.set(done);
    testing.app.tag(
      '<i>tab</i>',
      function() {
        Vue.nextTick(function() {
          expect(testing.app.html()).to.include('<i class="i non-selectable">tab</i>');
          testing.done();
        });
      }
    );
  });

  it('should be able to render with multiple attribs', function(done) {
    testing.done.set(done);
    testing.app.tag(
      '<i>more_vert</i>',
      function() {
        Vue.nextTick(function() {
          expect(testing.app.html()).to.include('<i class="i non-selectable">more_vert</i>');
          testing.done();
        });
      }
    );
  });

});
