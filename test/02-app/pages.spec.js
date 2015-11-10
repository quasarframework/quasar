'use strict';

describe.only('App', function() {

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

  it('should be able to trigger render()', function(done) {
    testing.done.set(done);
    testing.app.addIndex(
      function() {
        module.exports.render = function() {
          expect(this.data).to.deep.equal({});
          expect(this.scope).to.deep.equal({});
          expect(this.vm.$data).to.deep.equal(this.scope);
          expect(this.params).to.deep.equal({});
          expect(this.query).to.deep.equal({});
          expect(this.name).to.equal('index');
          expect(this.manifest).to.deep.equal({man: true});
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
        setTimeout(function() {
          this.done({someData: 'value'});
        }.bind(this), 1);
      };
      module.exports.render = function() {
        expect(this.data).to.deep.equal({someData: 'value'});
        expect(this.scope).to.deep.equal({});
        expect(this.params).to.deep.equal({});
        expect(this.query).to.deep.equal({});
        expect(this.name).to.equal('index');
        expect(this.manifest).to.deep.equal({});
        testing.done();
      };
    });
    testing.app.start();
  });

  it('should be able handle prepare() with no callback param', function(done) {
    testing.done.set(done);
    testing.app.addIndex(function() {
      module.exports.prepare = function() {
        setTimeout(function() {
          this.done();
        }.bind(this), 1);
      };
      module.exports.render = function() {
        expect(this.data).to.deep.equal({});
        testing.done();
      };
    });
    testing.app.start();
  });

  it('should be able to trigger scope() with no prepare()', function(done) {
    testing.done.set(done);
    testing.app.addIndex(function() {
      module.exports.scope = function() {
        expect(this.data).to.deep.equal({});
        expect(this.params).to.deep.equal({});
        expect(this.query).to.deep.equal({});
        expect(this.name).to.equal('index');
        expect(this.manifest).to.deep.equal({});
        return {my: 'vue-scope'};
      };
      module.exports.render = function() {
        expect(this.data).to.deep.equal({});
        expect(this.vm.$data).to.deep.equal({my: 'vue-scope'});
        expect(this.params).to.deep.equal({});
        expect(this.query).to.deep.equal({});
        expect(this.manifest).to.deep.equal({});
        testing.done();
      };
    });
    testing.app.start();
  });

  it('should be able to trigger scope() with prepare()', function(done) {
    testing.done.set(done);
    testing.app.addIndex(function() {
      module.exports.prepare = function() {
        expect(this.params).to.deep.equal({});
        expect(this.query).to.deep.equal({});
        expect(this.done).to.be.a('function');
        setTimeout(function() {
          this.done({someData: 'value'});
        }.bind(this), 1);
      };
      module.exports.scope = function() {
        expect(this.data).to.deep.equal({someData: 'value'});
        expect(this.params).to.deep.equal({});
        expect(this.query).to.deep.equal({});
        return {my: 'scope'};
      };
      module.exports.render = function() {
        expect(this.data).to.deep.equal({someData: 'value'});
        expect(this.vm.$data).to.deep.equal({my: 'scope'});
        expect(this.params).to.deep.equal({});
        expect(this.query).to.deep.equal({});
        expect(this.manifest).to.deep.equal({});
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
      module.exports.render = function() {
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
      module.exports.render = function() {
        expect($('#quasar-view').html()).to.equal('page html content');
        testing.done();
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
      module.exports.render = function() {
        expect(this.name).to.equal('index');
        expect($('#quasar-view').html()).to.equal('index html content');
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
          module.exports.render = function() {
            expect(this.name).to.equal('secondpage');
            expect($('#quasar-view').html()).to.equal('second page html content');
            testing.assert.pageCSS('/pages/secondpage/css/secondpage.css');
            testing.done();
          };
        }
      }]
    );
    testing.app.start();
  });

});
