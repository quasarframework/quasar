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
    return '<div class="quasar-page">' + content + '<div class="__quasar_page_css"></div></div>';
  }

  //
  //
  // PLEASE ALTERNATE LAYOUT NAMES BETWEEN TESTS,
  // OTHERWISE IT WON'T WORK! due to layout name caching
  //
  //

  it('should be able to load layout script', function(done) {
    testing.done.set(done);
    testing.app.var.getPageContent = getPageContent;
    testing.app.addLayout('main', function() {
      testing.done();
    });
    testing.app.addIndex(
      function() {
      },
      null,
      {layout: 'main'}
    );
    testing.app.start();
  });

  it('should be able to load layout with exports as object', function(done) {
    testing.done.set(done);
    testing.app.var.getPageContent = getPageContent;
    testing.app.addLayout('qqmain', function() {
      module.exports = {
        template: 'layout {{name}} <quasar-page></quasar-page>',
        data: {
          name: 'framework'
        },
        ready: function() {
          var el = $(this.$el);

          expect(el.html()).to.include('layout framework');
          this.$data.name = 'quasar';
          Vue.nextTick(function() {
            expect(el.html()).to.equal('layout quasar ' + testing.app.var.getPageContent('page content'));
          });
        }
      };
    });
    testing.app.addIndex(
      function() {
        module.exports = {
          template: 'page content',
          ready: function() {
            Vue.nextTick(function() {
              expect($('#quasar-app').html()).to.equal('layout quasar ' + testing.app.var.getPageContent('page content'));
              testing.done();
            });
          }
        };
      },
      null,
      {layout: 'qqmain'}
    );
    testing.app.start();
  });

  it('should be able to load layout with exports as function with immediate call', function(done) {
    testing.done.set(done);
    testing.app.var.getPageContent = getPageContent;
    testing.app.addLayout('quasar-main', function() {
      module.exports = function(callback) {
        callback({
          template: 'layout {{name}} <quasar-page></quasar-page>',
          data: {
            name: 'framework'
          },
          ready: function() {
            var el = $(this.$el);

            expect(el.html()).to.include('layout framework');
            this.$data.name = 'quasar';
            Vue.nextTick(function() {
              expect(el.html()).to.include('layout quasar');
            });
          }
        });
      };
    });
    testing.app.addIndex(
      function() {
        module.exports = {
          template: 'page content',
          ready: function() {
            Vue.nextTick(function() {
              expect($('#quasar-app').html()).to.equal('layout quasar ' + testing.app.var.getPageContent('page content'));
              testing.done();
            });
          }
        };
      },
      null,
      {layout: 'quasar-main'}
    );
    testing.app.start();
  });

  it('should be able to load layout with exports as function', function(done) {
    testing.done.set(done);
    testing.app.var.getPageContent = getPageContent;
    testing.app.addLayout('ppmain', function() {
      module.exports = function(callback) {
        quasar.nextTick(function() {
          callback({
            template: 'layout {{name}} <quasar-page></quasar-page>',
            data: {
              name: 'framework'
            },
            ready: function() {
              var el = $(this.$el);

              expect(el.html()).to.include('layout framework');
              this.$data.name = 'quasar';
              Vue.nextTick(function() {
                expect(el.html()).to.include('layout quasar');
              });
            }
          });
        });
      };
    });
    testing.app.addIndex(
      function() {
        module.exports = {
          template: 'page content',
          ready: function() {
            Vue.nextTick(function() {
              expect($('#quasar-app').html()).to.equal('layout quasar ' + testing.app.var.getPageContent('page content'));
              testing.done();
            });
          }
        };
      },
      null,
      {layout: 'ppmain'}
    );
    testing.app.start();
  });

  it('should be able to maintain layout', function(done) {
    testing.done.set(done);
    testing.app.var.getPageContent = getPageContent;
    testing.app.addPage(
      'page',
      [{
        url: 'script.page.js',
        content: function() {
          module.exports = {
            template: 'page content',
            ready: function() {
              expect($('#quasar-app').html()).to.equal('layout ' + testing.app.var.getPageContent('page content'));
              expect(quasar.layout).to.deep.equal(testing.app.var.layout);
              testing.done();
            }
          };
        }
      }],
      {layout: 'quasar'}
    );
    testing.app.addIndex(
      function() {
        module.exports = {
          template: 'index content',
          ready: function() {
            expect($('#quasar-app').html()).to.equal('layout ' + testing.app.var.getPageContent('index content'));
            testing.app.var.layout = quasar.layout;
            quasar.navigate.to.route('#/page');
          }
        };
      },
      null,
      {layout: 'quasar'}
    );
    testing.app.addLayout('quasar', function() {
      module.exports = {
        template: 'layout <quasar-page></quasar-page>'
      };
    });
    testing.app.start();
  });

  it('should be able to remove layout', function(done) {
    testing.done.set(done);
    testing.app.var.getPageContent = getPageContent;
    testing.app.addIndex(
      function() {
        module.exports = {
          template: 'content',
          ready: function() {
            expect($('#quasar-app').html()).to.equal(testing.app.var.getPageContent('content') + ' yyy');
            expect(quasar.layout).to.be.an('object');
            quasar.navigate.to.route('#/nolayout');
          }
        };
      },
      null,
      {layout: 'yyy'}
    );
    testing.app.addPage(
      'nolayout',
      [{
        url: 'script.nolayout.js',
        content: function() {
          module.exports = {
            template: 'page content',
            ready: function() {
              expect($('#quasar-app').html()).to.equal('<div class="quasar-layout">' + testing.app.var.getPageContent('page content') + '</div>');
              expect(quasar.layout.name).to.equal('__default');
              testing.done();
            }
          };
        }
      }]
    );
    testing.app.addLayout('yyy', function() {
      module.exports = {
        template: '<quasar-page></quasar-page> yyy'
      };
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
      'app:layout:prepare',
      'app:layout:post-prepare',
      'app:layout:render',
      'app:layout:post-render',
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
      module.exports = {
        template: 'Quasar Framework <quasar-page></quasar-page>'
      };
    });
    testing.app.addIndex(
      function() {
        module.exports = {
          ready: function() {
            quasar.nextTick(function() {
              testing.done();
            });
          }
        };
      },
      null,
      {layout: 'xmain'}
    );
    testing.app.start();
  });

});
