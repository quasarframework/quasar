'use strict';

describe('Tag: quasar-icon', function() {

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
      '<quasar-icon></quasar-icon>',
      function() {
        expect(_html).to.include('<i class="quasar-icon"></i>');
        testing.done();
      }
    );
  });

  it('should be able to render with attribs', function(done) {
    testing.done.set(done);
    testing.app.tag(
      '<quasar-icon tab></quasar-icon>',
      function() {
        Vue.nextTick(function() {
          expect(testing.app.html()).to.include('<i class="quasar-icon">tab</i>');
          testing.done();
        });
      }
    );
  });

  it('should be able to render with multiple attribs', function(done) {
    testing.done.set(done);
    testing.app.tag(
      '<quasar-icon more vert></quasar-icon>',
      function() {
        Vue.nextTick(function() {
          expect(testing.app.html()).to.include('<i class="quasar-icon">more_vert</i>');
          testing.done();
        });
      }
    );
  });

  it('should be able to render with binded attribs', function(done) {
    done();
    return;
    testing.done.set(done);
    testing.app.tag(
      '<quasar-icon :name.literal="tab"></quasar-icon>',
      function() {
        expect(_html).to.include('<i class="quasar-icon">tab</i>');
        testing.done();
      }
    );
  });

});
