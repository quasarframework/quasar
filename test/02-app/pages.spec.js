'use strict';

describe('App', function() {

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
        module.exports.render = function(data, opts, manifest) {
          expect(data).to.deep.equal({});
          expect(opts).to.deep.equal({params: {}, query: {}});
          expect(manifest).to.deep.equal({man: true});
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
      module.exports.prepare = function(opts, callback) {
        expect(opts).to.deep.equal({params: {}, query: {}});
        expect(callback).to.be.a('function');
        setTimeout(function() {
          callback({someData: 'value'});
        }, 1);
      };
      module.exports.render = function(data, opts, manifest) {
        expect(data).to.deep.equal({someData: 'value'});
        expect(opts).to.deep.equal({params: {}, query: {}});
        expect(manifest).to.deep.equal({});
        testing.done();
      };
    });
    testing.app.start();
  });

  it('should be able handle prepare() with no callback param', function(done) {
    testing.done.set(done);
    testing.app.addIndex(function() {
      module.exports.prepare = function(opts, callback) {
        setTimeout(function() {
          callback();
        }, 1);
      };
      module.exports.render = function(data) {
        expect(data).to.deep.equal({});
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
        expect($('#__quasar_page_css').html()).to.equal('<link type="text/css" href="/pages/index/css/page.css" rel="stylesheet">');
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
        expect($('#quasar-view').html()).to.equal('index html content');
        expect($('#__quasar_page_css').html()).to.equal('<link type="text/css" href="/pages/index/css/page.css" rel="stylesheet">');
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
            expect($('#quasar-view').html()).to.equal('second page html content');
            expect($('#__quasar_page_css').html()).to.equal('<link type="text/css" href="/pages/secondpage/css/secondpage.css" rel="stylesheet">');
            testing.done();
          };
        }
      }]
    );
    testing.app.start();
  });

});
