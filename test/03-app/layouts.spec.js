'use strict';

describe('App Layouts', function() {

  beforeEach(function() {
    testing.app.reset();
    testing.app.prepare();
  });
  after(function() {
    testing.app.reset();
  });

  function getPageContent(content) {
    return '<div class="quasar-content">' + content + '</div>';
  }

  //
  //
  // PLEASE ALTERNATE LAYOUT NAMES BETWEEN TESTS,
  // OTHERWISE IT WON'T WORK! due to layout name caching
  //
  //

  it('should be able to load layout', function(done) {
    testing.done.set(done);
    testing.app.var.getPageContent = getPageContent;
    testing.app.addLayout('main', function() {
      module.exports.html = 'layout <quasar-content></quasar-content>';
      module.exports.vue = {
        data: {
          value: 'quasar'
        }
      };
      module.exports.start = function() {
        expect(this.vm).to.be.an('object');
        expect(this.vm.$data.value).to.equal('quasar');
        expect(this.scope).to.be.an('object');
        expect(this.scope.value).to.equal('quasar');
        this.scope.value = 'other';
        expect(this.vm.$data.value).to.equal('other');
      };
    });
    testing.app.addIndex(
      function() {
        module.exports.config = {
          html: 'page content',
          layout: 'main'
        };
        module.exports.start = function() {
          expect($('#quasar-view').html()).to.equal('layout ' + testing.app.var.getPageContent('page content'));
          testing.done();
        };
      }
    );
    testing.app.start();
  });

  it('should be able to maintain layout', function(done) {
    testing.done.set(done);
    testing.app.var.getPageContent = getPageContent;
    testing.app.addIndex(
      function() {
        module.exports.config = {
          html: 'index content',
          layout: 'qqq'
        };
        module.exports.start = function() {
          expect($('#quasar-view').html()).to.equal('layout ' + testing.app.var.getPageContent('index content'));
          testing.app.var.layout = quasar.global.layout;
          quasar.navigate.to.route('#/page');
        };
      }
    );
    testing.app.addPage(
      'page',
      [{
        url: 'js/script.page.js',
        content: function() {
          module.exports.config = {
            html: 'page content',
            layout: 'qqq'
          };
          module.exports.start = function() {
            expect($('#quasar-view').html()).to.equal('layout ' + testing.app.var.getPageContent('page content'));
            expect(quasar.global.layout).to.deep.equal(testing.app.var.layout);
            testing.done();
          };
        }
      }]
    );
    testing.app.addLayout('qqq', function() {
      module.exports.html = 'layout <quasar-content></quasar-content>';
    });
    testing.app.start();
  });

  it('should be able to remove layout', function(done) {
    testing.done.set(done);
    testing.app.var.getPageContent = getPageContent;
    testing.app.addIndex(
      function() {
        module.exports.config = {
          html: 'content',
          layout: 'yyy'
        };
        module.exports.start = function() {
          expect($('#quasar-view').html()).to.equal(testing.app.var.getPageContent('content') + ' yyy');
          expect(quasar.global.layout).to.not.deep.equal({});
          quasar.navigate.to.route('#/nolayout');
        };
      }
    );
    testing.app.addPage(
      'nolayout',
      [{
        url: 'js/script.nolayout.js',
        content: function() {
          module.exports.config = {
            html: 'page content'
          };
          module.exports.start = function() {
            expect($('#quasar-view').html()).to.equal('page content');
            expect(quasar.global.layout).to.deep.equal({});
            testing.done();
          };
        }
      }]
    );
    testing.app.addLayout('yyy', function() {
      module.exports.html = '<quasar-content></quasar-content> yyy';
    });
    testing.app.start();
  });

});
