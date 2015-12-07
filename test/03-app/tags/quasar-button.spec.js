'use strict';

describe('Tag: quasar-button', function() {

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
      '<quasar-button>Quasar Button Label</quasar-button>',
      function() {
        expect(_html).to.include('<button ');
        expect(_html).to.include('Quasar Button Label</button>');
        testing.done();
      }
    );
  });

  it('should be able to render with circular param', function(done) {
    testing.done.set(done);
    testing.app.tag(
      '<quasar-button circular>Quasar Button Label</quasar-button>',
      function() {
        expect(_html).to.include('<button ');
        expect(_html).to.include('circular icon');
        expect(_html).to.include('Quasar Button Label</button>');
        testing.done();
      }
    );
  });

  it('should be able to render with flat param', function(done) {
    testing.done.set(done);
    testing.app.tag(
      '<quasar-button flat>Quasar Button Label</quasar-button>',
      function() {
        expect(_html).to.include('<button ');
        expect(_html).to.include('flat squared');
        expect(_html).to.include('Quasar Button Label</button>');
        testing.done();
      }
    );
  });

  it('should not break with unknown param', function(done) {
    testing.done.set(done);
    testing.app.tag(
      '<quasar-button qwerty>Quasar Button Label</quasar-button>',
      function() {
        expect(_html).to.include('<button ');
        expect(_html).to.include('qwerty');
        expect(_html).to.include('Quasar Button Label</button>');
        testing.done();
      }
    );
  });

});
