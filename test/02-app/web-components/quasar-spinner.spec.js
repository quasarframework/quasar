'use strict';

describe.skip('Tag: quasar-spinner', function() {

  beforeEach(function() {
    testing.app.reset();
    testing.app.prepare();
  });
  afterEach(function() {
    testing.app.reset();
  });

  var spinners = [
    'android', 'ios', 'bubbles', 'circles', 'crescent', 'dots', 'lines', 'ripple'
  ];

  spinners.forEach(function(spinner) {
    it('should be able to render ' + spinner + ' spinner', function(done) {
      testing.done.set(done);
      testing.app.var.spinner = spinner;
      testing.app.tag(
        '<quasar-spinner ' + spinner + '></quasar-spinner>',
        function() {
          expect(_html).to.include('<div class="spinner spinner-' + testing.app.var.spinner + '"><svg ');
          expect(_html).to.include('</svg></div>');
          testing.done();
        }
      );
    });
  });

  it('should be able to render spinner with size', function(done) {
    testing.done.set(done);
    testing.app.tag(
      '<quasar-spinner android size="10em"></quasar-spinner>',
      function() {
        expect(_html).to.include('<div class="spinner spinner-android"><svg ');
        expect(_html).to.include('height: 10em; width: 10em;');
        expect(_html).to.include('</svg></div>');
        testing.done();
      }
    );
  });

  it('should default to android if no spinner type specified and not on iOS', function(done) {
    testing.done.set(done);
    testing.app.tag(
      '<quasar-spinner></quasar-spinner>',
      function() {
        expect(_html).to.include('<div class="spinner spinner-android"><svg ');
        expect(_html).to.include('</svg></div>');
        setTimeout(testing.done, 50);
      }
    );
  });

  it('should default to android if no spinner type specified and not on iOS', function(done) {
    testing.done.set(done);
    testing.app.tag(
      '<quasar-spinner></quasar-spinner>',
      function() {
        expect(_html).to.include('<div class="spinner spinner-android"><svg ');
        expect(_html).to.include('</svg></div>');
        testing.done();
      }
    );
  });

});
