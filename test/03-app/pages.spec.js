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

  it('should be able to trigger start()', function(done) {
    testing.done.set(done);
    testing.app.addIndex(
      function() {
        module.exports.start = function() {
          expect(this.prepared).to.not.exist;
          expect(this.$data).to.deep.equal({});
          expect(this.vm.$data).to.deep.equal(this.$data);
          expect(this.params).to.deep.equal({});
          expect(this.query).to.deep.equal({});
          expect(this.name).to.equal('index');
          expect(this.manifest).to.deep.equal({man: true});
          expect(this.route).to.equal('$');
          expect(this.$el).to.be.an('object');
          expect(this.$el.addClass).to.exist;

          expect(quasar.global.page).to.be.an('object');
          expect(quasar.global.page.scope).to.deep.equal(this.scope);

          testing.done();
        };
      },
      null,
      {
        man: true
      }
    );
    testing.app.start();
  });

  it('should be able to trigger prepare()', function(done) {
    testing.done.set(done);
    testing.app.addIndex(function() {
      module.exports.prepare = function() {
        expect(this.params).to.deep.equal({});
        expect(this.query).to.deep.equal({});
        expect(this.name).to.equal('index');
        expect(this.done).to.be.a('function');
        expect(this.manifest).to.deep.equal({});
        expect(this.route).to.equal('$');
        setTimeout(function() {
          this.done({someData: 'value'});
        }.bind(this), 1);
      };
      module.exports.start = function() {
        expect(this.prepared).to.deep.equal({someData: 'value'});
        expect(this.$data).to.deep.equal({});
        expect(this.params).to.deep.equal({});
        expect(this.query).to.deep.equal({});
        expect(this.name).to.equal('index');
        expect(this.manifest).to.deep.equal({});
        expect(this.route).to.equal('$');
        testing.done();
      };
    });
    testing.app.start();
  });

  it('should be able handle prepare() with no callback param', function(done) {
    testing.done.set(done);
    testing.app.addIndex(function() {
      module.exports.prepare = function() {
        quasar.nextTick(function() {
          this.done();
        }.bind(this));
      };
      module.exports.start = function() {
        expect(this.prepared).to.not.exist;
        testing.done();
      };
    });
    testing.app.start();
  });

  it('should be able to trigger vue() with no prepare()', function(done) {
    testing.done.set(done);
    testing.app.addIndex(function() {
      module.exports.vue = function() {
        expect(this.prepared).to.not.exist;
        expect(this.params).to.deep.equal({});
        expect(this.query).to.deep.equal({});
        expect(this.name).to.equal('index');
        expect(this.manifest).to.deep.equal({});
        expect(this.route).to.equal('$');
        return {
          data: {
            my: 'vue-scope'
          }
        };
      };
      module.exports.start = function() {
        expect(this.prepared).to.not.exist;
        expect(this.$data).to.deep.equal({my: 'vue-scope'});
        expect(this.vm.$data).to.deep.equal({my: 'vue-scope'});
        expect(this.params).to.deep.equal({});
        expect(this.query).to.deep.equal({});
        expect(this.manifest).to.deep.equal({});
        testing.done();
      };
    });
    testing.app.start();
  });

  it('should be able to trigger vue() with ready inner method', function(done) {
    testing.done.set(done);
    testing.app.var.hit = 0;
    testing.app.addIndex(function() {
      module.exports.vue = function() {
        return {
          data: {
            some: 'value'
          },
          ready: function() {
            expect(this.$el).to.exist;
            expect(this.$data).to.deep.equal({some: 'value'});
            testing.app.var.hit++;
          }
        };
      };
      module.exports.start = function() {
        expect(testing.app.var.hit).to.equal(1);
        expect(this.$data).to.deep.equal({some: 'value'});
        expect(this.prepare).to.not.exist;
        expect(this.params).to.deep.equal({});
        expect(this.query).to.deep.equal({});
        expect(this.name).to.equal('index');
        expect(this.manifest).to.deep.equal({});
        expect(this.route).to.equal('$');
        expect(this.$el).to.be.an('object');
        testing.done();
      };
    });
    testing.app.start();
  });

  it('should be able to trigger vue() with prepare()', function(done) {
    testing.done.set(done);
    testing.app.addIndex(function() {
      module.exports.prepare = function() {
        expect(this.params).to.deep.equal({});
        expect(this.query).to.deep.equal({});
        expect(this.done).to.be.a('function');
        quasar.nextTick(function() {
          this.done({someData: 'value'});
        }.bind(this));
      };
      module.exports.vue = function() {
        expect(this.prepared).to.deep.equal({someData: 'value'});
        expect(this.params).to.deep.equal({});
        expect(this.query).to.deep.equal({});
        return {
          data: {
            my: 'vue-scope'
          }
        };
      };
      module.exports.start = function() {
        expect(this.prepared).to.deep.equal({someData: 'value'});
        expect(this.vm.$data).to.deep.equal({my: 'vue-scope'});
        expect(this.params).to.deep.equal({});
        expect(this.query).to.deep.equal({});
        expect(this.manifest).to.deep.equal({});
        testing.done();
      };
    });
    testing.app.start();
  });

  it('should be able to handle vue as an object', function(done) {
    testing.done.set(done);
    testing.app.addIndex(function() {
      module.exports.vue = {
        data: {
          my: 'vue-scope'
        }
      };
      module.exports.start = function() {
        expect(this.vm.$data).to.deep.equal({my: 'vue-scope'});
        expect(this.$data).to.deep.equal({my: 'vue-scope'});
        testing.done();
      };
    });
    testing.app.start();
  });

  it('should be able to load page CSS', function(done) {
    testing.done.set(done);
    testing.app.addIndex(function() {
      module.exports.config = {
        css: '/pages/index/css/page.css'
      };
      module.exports.start = function() {
        testing.assert.pageCSS('/pages/index/css/page.css');
        testing.done();
      };
    }, [{
      url: 'css/page.css',
      content: 'body {}'
    }]);
    testing.app.start();
  });

  it('should be able to load page HTML', function(done) {
    testing.done.set(done);
    testing.app.addIndex(function() {
      module.exports.config = {
        html: 'page html content'
      };
      module.exports.start = function() {
        expect($('#quasar-view').html()).to.equal('page html content');
        testing.done();
      };
    });
    testing.app.start();
  });

  it('should be able to be $data reactive', function(done) {
    testing.done.set(done);
    testing.app.addIndex(function() {
      module.exports.config = {
        html: 'I am {{name}}.'
      };
      module.exports.vue = {
        data: {
          name: 'Quasar'
        }
      };
      module.exports.start = function() {
        expect(this.$el.html()).to.equal('I am Quasar.');
        this.vm.$data.name = 'reactive';
        quasar.nextTick(function() {
          expect(this.$el.html()).to.equal('I am reactive.');
          testing.done();
        }.bind(this));
      };
    });
    testing.app.start();
  });

  it('should be able to register multiple pages', function(done) {
    testing.done.set(done);
    testing.app.addIndex(function() {
      module.exports.config = {
        html: 'index html content',
        css: '/pages/index/css/page.css'
      };
      module.exports.start = function() {
        expect(this.name).to.equal('index');
        expect($('#quasar-view').html()).to.equal('index html content');

        expect(quasar.global.page).to.be.an('object');
        expect(quasar.global.page.$data).to.deep.equal(this.$data);

        testing.assert.pageCSS('/pages/index/css/page.css');
        quasar.navigate.to.route('#/secondpage');
      };
    });
    testing.app.addPage(
      'secondpage',
      [{
        url: 'js/script.secondpage.js',
        content: function() {
          module.exports.config = {
            html: 'second page html content',
            css: '/pages/secondpage/css/secondpage.css'
          };
          module.exports.start = function() {
            expect(this.name).to.equal('secondpage');
            expect(this.route).to.equal('$');

            expect(quasar.global.page).to.be.an('object');
            expect(quasar.global.page.vm).to.deep.equal(this.vm);
            expect(quasar.global.page.$data).to.deep.equal(this.$data);

            expect($('#quasar-view').html()).to.equal('second page html content');
            testing.assert.pageCSS('/pages/secondpage/css/secondpage.css');
            testing.done();
          };
        }
      }]
    );
    testing.app.start();
  });

  it('should be able to call dispose() when changing page', function(done) {
    testing.done.set(done);
    testing.app.addIndex(function() {
      module.exports.start = function() {
        expect(quasar.global.page).to.be.an('object');
        expect(quasar.global.page.$data).to.deep.equal(this.$data);
        quasar.navigate.to.route('#/secondpage');
      };

      module.exports.dispose = function() {
        testing.app.var.disposeHasBeenCalled = true;
      };
    });
    testing.app.addPage(
      'secondpage',
      [{
        url: 'js/script.secondpage.js',
        content: function() {
          module.exports.prepare = function() {
            expect(testing.app.var.disposeHasBeenCalled).to.equal(true);
            testing.done();
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
        module.exports.start = function() {
          testing.done();
        };
      }, [], {
        hashes: ['$']
      });
      testing.app.start();
    });

    it('should be able to handle multiple hashes', function(done) {
      testing.done.set(done);
      testing.app.addIndex(function() {
        module.exports.start = function() {
          if (this.params.age) {
            expect(this.params.age).to.equal('5');
            expect(this.params.name).to.equal('Razvan');
            testing.done();
            return;
          }
          quasar.navigate.to.route('#/index/5/shop/Razvan');
        };
      }, [], {
        hashes: ['$', ':age/shop/:name']
      });
      testing.app.start();
    });

    it('should be able to handle multiple hashes without $', function(done) {
      testing.done.set(done);
      testing.app.addIndex(function() {
        module.exports.start = function() {
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
        module.exports.start = function() {
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
        module.exports.start = function() {
          quasar.navigate.to.route('#/razvan?q=string&think=big');
        };
      });
      testing.app.addPage(
        'razvan',
        [
          {
            url: 'js/script.razvan.js',
            content: function() {
              module.exports.start = function() {
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

      testing.done.set(function() {
        quasar.nextTick(function() {
          expect(times).to.equal(6);
          done();
        });
      });

      quasar.global.events.on('app:page:requiring', fn);
      quasar.global.events.on('app:page:layouting', fn);
      quasar.global.events.on('app:page:preparing', fn);
      quasar.global.events.on('app:page:vueing', fn);
      quasar.global.events.on('app:page:starting', fn);
      quasar.global.events.on('app:page:ready', fn);

      testing.app.addIndex(function() {
        module.exports.start = function() {
          testing.done();
        };
      });
      testing.app.start();
    });

  });

});
