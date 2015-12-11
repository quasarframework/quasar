'use strict';

describe('App Pages', function() {

  beforeEach(function() {
    testing.app.reset();
    testing.app.prepare();
  });
  after(function() {
    testing.app.reset();
  });


  it('should be able to start app', function(done) {
    testing.done.set(done);
    testing.app.addIndex('testing.done();');
    testing.app.start();
  });

  it('should be able to handle page exports as an object', function(done) {
    testing.done.set(done);
    testing.app.addIndex(
      function() {
        module.exports = {
          ready: function() {
            expect($(this.$el).html()).to.equal('');
            testing.done();
          }
        };
      }
    );
    testing.app.start();
  });

  it('should be able to handle page exports as a function', function(done) {
    testing.done.set(done);
    testing.app.addIndex(
      function() {
        module.exports = function(callback) {
          expect(this.params).to.deep.equal({});
          expect(this.query).to.deep.equal({});
          expect(this.name).to.equal('index');
          expect(this.manifest).to.deep.equal({man: true});
          expect(this.route).to.equal('$');

          quasar.nextTick(function() {
            callback({
              ready: function() {
                var el = $(this.$el), vm = this;

                expect(el.html()).to.equal('');
                expect(vm).to.be.an('object');
                expect(vm.$data).to.be.an('object');
                quasar.nextTick(function() {
                  expect(quasar.global.page.name).to.equal('index');
                  expect(quasar.global.page.vm).to.deep.equal(vm);
                  testing.done();
                });
              }
            });
          });
        };
      },
      null,
      {man: true}
    );
    testing.app.start();
  });

  it('should be able to handle page exports as a function with immediate call', function(done) {
    testing.done.set(done);
    testing.app.addIndex(
      function() {
        module.exports = function(callback) {
          callback({
            template: 'quasar rocks!',
            ready: function() {
              var el = $(this.$el), vm = this;

              expect(el.html()).to.equal('quasar rocks!');
              expect(vm).to.be.an('object');
              expect(vm.$data).to.be.an('object');
              quasar.nextTick(function() {
                expect(quasar.global.page.name).to.equal('index');
                expect(quasar.global.page.vm).to.deep.equal(vm);
                testing.done();
              });
            }
          });
        };
      },
      null,
      {man: true}
    );
    testing.app.start();
  });

  it('should be able to handle HTML for page exports as an object', function(done) {
    testing.done.set(done);
    testing.app.addIndex(
      function() {
        module.exports = {
          template: 'some template {{msg}}',
          data: {
            msg: 'msg'
          },
          ready: function() {
            var el = $(this.$el);

            expect(el.html()).to.equal('some template msg');
            this.$data.msg = 'message';
            Vue.nextTick(function() {
              expect(el.html()).to.equal('some template message');
              testing.done();
            });
          }
        };
      }
    );
    testing.app.start();
  });

  it('should be able to handle HTML for page exports as a function', function(done) {
    testing.done.set(done);
    testing.app.addIndex(
      function() {
        module.exports = function(callback) {
          quasar.nextTick(function() {
            callback({
              template: 'template {{msg}}',
              data: {
                msg: 'msg'
              },
              ready: function() {
                var el = $(this.$el), vm = this;

                expect(el.html()).to.equal('template msg');
                this.$data.msg = 'message';
                Vue.nextTick(function() {
                  expect(el.html()).to.equal('template message');
                  testing.done();
                });
              }
            });
          });
        };
      }
    );
    testing.app.start();
  });

  it('should be able to load page CSS', function(done) {
    testing.done.set(done);
    testing.app.addIndex(
      function() {
        module.exports = {
          ready: function() {
            testing.assert.pageCSS('/pages/index/css/page.css');
            testing.done();
          }
        };
      },
      null,
      {css: '/pages/index/css/page.css'}
    );
    testing.app.start();
  });

  it('should be able to register multiple pages', function(done) {
    testing.done.set(done);
    testing.app.addIndex(
      function() {
        module.exports = function(callback) {
          expect(this.name).to.equal('index');
          expect(this.manifest).to.deep.equal({
            css: '/pages/index/css/page.css'
          });

          callback({
            template: 'index html content',
            ready: function() {
              expect($(this.$el).html()).to.equal('index html content');
              expect($('.quasar-page').html()).to.equal('index html content');

              testing.assert.pageCSS('/pages/index/css/page.css');
              quasar.navigate.to.route('#/secondpage');
            }
          });
        };
      },
      null,
      {css: '/pages/index/css/page.css'}
    );
    testing.app.addPage(
      'secondpage',
      [{
        url: 'js/script.secondpage.js',
        content: function() {
          module.exports = function(callback) {
            expect(this.name).to.equal('secondpage');
            expect(this.manifest).to.deep.equal({
              css: '/pages/secondpage/css/page.css'
            });

            callback({
              template: 'second html content',
              ready: function() {
                expect($(this.$el).html()).to.equal('second html content');
                expect($('.quasar-page').html()).to.equal('second html content');

                testing.assert.pageCSS('/pages/secondpage/css/page.css');
                testing.done();
              }
            });
          };
        }
      }],
      {css: '/pages/secondpage/css/page.css'}
    );
    testing.app.start();
  });

  it('should call $destroy on Vue instances', function(done) {
    testing.app.var.called = false;
    testing.done.set(done);
    testing.app.addIndex(
      function() {
        module.exports = {
          ready: function() {
            quasar.navigate.to.route('#/secondpage');
          },
          destroyed: function() {
            testing.app.var.called = true;
          }
        };
      }
    );
    testing.app.addPage(
      'secondpage',
      [{
        url: 'js/script.secondpage.js',
        content: function() {
          module.exports = {
            ready: function() {
              expect(testing.app.var.called).to.equal(true);
              testing.done();
            }
          };
        }
      }]
    );
    testing.app.start();
  });

  describe('hashes', function() {

    it('should be able to handle $', function(done) {
      testing.done.set(done);
      testing.app.addIndex(function() {
        module.exports = {
          ready: function() {
            testing.done();
          }
        };
      }, [], {
        hashes: ['$']
      });
      testing.app.start();
    });

    it('should be able to handle multiple hashes', function(done) {
      testing.done.set(done);
      testing.app.addIndex(function() {
        module.exports = function(callback) {
          if (this.params.age) {
            expect(this.params.age).to.equal('5');
            expect(this.params.name).to.equal('Razvan');
            testing.done();
            return;
          }

          callback({
            ready: function() {
              quasar.navigate.to.route('#/index/5/shop/Razvan');
            }
          });
        };
      }, [], {
        hashes: ['$', ':age/shop/:name']
      });
      testing.app.start();
    });

    it('should be able to handle multiple hashes without $', function(done) {
      testing.done.set(done);
      testing.app.addIndex(function() {
        module.exports = function(callback) {
          expect(this.params.age).to.equal('5');
          expect(this.params.name).to.equal('Razvan');
          testing.done();
        };
      }, [], {
        hashes: [':age/shop/:name']
      });
      testing.app.start();
      quasar.navigate.to.route('#/index/5/shop/Razvan');
    });

    it('should be able to handle hashes & query string', function(done) {
      testing.done.set(done);
      testing.app.addIndex(function() {
        module.exports = function() {
          expect(this.params.age).to.equal('5');
          expect(this.params.name).to.equal('Razvan');
          expect(this.query.q).to.equal('string');
          expect(this.query.think).to.equal('big');
          expect(this.route).to.equal(':age/shop/:name');
          testing.done();
        };
      }, [], {
        hashes: [':age/shop/:name']
      });
      testing.app.start();
      quasar.navigate.to.route('#/index/5/shop/Razvan?q=string&think=big');
    });

    it('should be able to handle hashes & query string on multiple pages', function(done) {
      testing.done.set(done);
      testing.app.addIndex(function() {
        module.exports = function() {
          quasar.navigate.to.route('#/razvan?q=string&think=big');
        };
      });
      testing.app.addPage(
        'razvan',
        [
          {
            url: 'js/script.razvan.js',
            content: function() {
              module.exports = function() {
                expect(this.query.q).to.equal('string');
                expect(this.query.think).to.equal('big');
                expect(this.route).to.be.a('string');
                if (this.route === '$') {
                  expect(this.params).to.deep.equal({});
                  quasar.navigate.to.route('#/razvan/5/think/big?q=string&think=big');
                }
                else if (this.route === ':age/think/:name') {
                  expect(this.params.age).to.equal('5');
                  expect(this.params.name).to.equal('big');
                  testing.done();
                }
              };
            }
          }
        ],
        {
          hashes: ['$', ':age/think/:name']
        }
      );
      testing.app.start();
    });

    it('should trigger global page events', function(done) {
      var
        times = 0,
        fn = function() {
          times++;
        };

      testing.app.var.events = [
        'app:page:require',
        'app:page:post-require',
        'app:page:prepare',
        'app:page:post-prepare',
        'app:page:render',
        'app:page:post-render',
        'app:page:ready'
      ];

      testing.done.set(function() {
        quasar.nextTick(function() {
          expect(times).to.equal(testing.app.var.events.length);
          quasar.global.events.off(testing.app.var.events.join(' '));
          done();
        });
      });

      quasar.global.events.on(testing.app.var.events.join(' '), fn);

      testing.app.addIndex(function() {
        module.exports = {
          ready: function() {
            testing.done();
          }
        };
      });
      testing.app.start();
    });

  });

});
