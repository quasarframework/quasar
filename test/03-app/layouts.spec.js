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
      module.exports.html = 'layout {{name}} <quasar-content></quasar-content>';
      module.exports.vue = {
        data: {
          name: 'framework'
        }
      };
      module.exports.start = function() {
        expect(this.vm).to.be.an('object');
        expect(this.vm.$data.name).to.equal('framework');
        expect(this.$data).to.be.an('object');
        expect(this.$data.name).to.equal('framework');
        this.$data.name = 'quasar';
        expect(this.vm.$data.name).to.equal('quasar');
      };
    });
    testing.app.addIndex(
      function() {
        module.exports.config = {
          html: 'page content',
          layout: 'main'
        };
        module.exports.start = function() {
          quasar.nextTick(function() {
            expect($('.quasar-layout').html()).to.equal('layout quasar ' + testing.app.var.getPageContent('page content'));
            testing.done();
          });
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
          expect($('.quasar-layout').html()).to.equal('layout ' + testing.app.var.getPageContent('index content'));
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
            expect($('.quasar-layout').html()).to.equal('layout ' + testing.app.var.getPageContent('page content'));
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
          expect($('.quasar-layout').html()).to.equal(testing.app.var.getPageContent('content') + ' yyy');
          expect(quasar.global.layout).to.be.an('object');
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
            expect($('.quasar-layout').html()).to.equal('page content');
            expect(quasar.global.layout).to.not.exist;
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

  it('should trigger global layout events', function(done) {
    var
      times = 0,
      fn = function() {
        times++;
      };

    testing.app.var.events = [
      'app:layout:require',
      'app:layout:post-require',
      'app:layout:html',
      'app:layout:post-html',
      'app:layout:vue',
      'app:layout:post-vue',
      'app:layout:start',
      'app:layout:post-start',
      'app:layout:ready'
    ];

    testing.done.set(function() {
      quasar.nextTick(function() {
        expect(times).to.equal(testing.app.var.events.length);
        quasar.global.events.off(testing.app.var.events.join(' '));
        done();
      });
    });

    quasar.global.events.on(testing.app.var.events.join(' '), fn);

    testing.app.addLayout('xmain', function() {
      module.exports.html = 'Quasar Framework <quasar-content></quasar-content>';
    });
    testing.app.addIndex(
      function() {
        module.exports.config = {
          html: 'page content',
          layout: 'xmain'
        };
        module.exports.start = function() {
          quasar.nextTick(function() {
            testing.done();
          });
        };
      }
    );
    testing.app.start();
  });

});
