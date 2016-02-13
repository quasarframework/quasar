'use strict';

describe('Router', function() {

  var events = [
    'app:route:change',
    'app:route:notfound',
    'app:route:trigger',
    'app:route:started',
    'app:router:started',
    'app:router:stopped'
  ];

  beforeEach(function() {
    this.hash = window.location.hash;
  });

  afterEach(function() {
    quasar.events.off(events.join(' '));
    quasar.stop.router();
    window.location.hash = this.hash;
  });

  var msToWaitBeforeHashChanges = 75;
  var routeOne = {
    hash: '#/route-one',
    trigger: function() {}
  };
  var routeTwo = {
    hash: '#/route-two',
    trigger: function() {}
  };
  var routeThree = {
    hash: '#/route-three',
    trigger: function() {}
  };


  it('should be able to get all routes', function() {
    var result = quasar.get.all.routes();

    expect(result).to.be.an('array');
    expect(result).to.have.length(0);
  });

  it('should be able to destroy router', function() {
    quasar.stop.router();
    expect(quasar.router.is.running()).to.be.equal(false);
  });

  it('should be able to add a route and verify it', function() {
    expect(quasar.get.all.routes()).to.have.length(0);
    quasar.add.route(routeOne);
    expect(quasar.has.route(routeOne.hash)).to.equal(true);
    expect(quasar.get.all.routes()).to.have.length(1);

    quasar.add.route(routeTwo);
    expect(quasar.has.route(routeTwo.hash)).to.equal(true);
    expect(quasar.get.all.routes()).to.have.length(2);

    expect(function() {
      quasar.add.route();
    }).to.throw(/Missing route/);

    expect(function() {
      quasar.add.route({});
    }).to.throw(/Route has no hash/);
  });

  it('should say if route is already registered', function() {
    expect(function() {
      quasar.has.route();
    }).to.throw(/Missing hash/);

    expect(quasar.has.route(routeOne.hash)).to.equal(false);
    quasar.add.route(routeOne);
    expect(quasar.has.route(routeOne.hash)).to.equal(true);
  });

  it('should be able to remove all routes', function() {
    expect(quasar.remove.all.routes).to.be.a('function');
    quasar.add.route(routeOne);
    quasar.remove.all.routes();
    expect(quasar.has.route(routeOne.hash)).to.equal(false);
    expect(quasar.get.all.routes()).to.have.length(0);
  });

  it('should be able to remove a route', function() {
    expect(quasar.remove.route).to.be.a('function');
    quasar.add.route(routeOne);
    quasar.add.route(routeTwo);
    quasar.remove.route(routeOne.hash);
    expect(quasar.has.route(routeOne.hash)).to.equal(false);
    expect(quasar.has.route(routeTwo.hash)).to.equal(true);
    expect(quasar.get.all.routes()).to.have.length(1);

    expect(function() {
      quasar.remove.route();
    }).to.throw(/Missing hash/);
  });

  it('should throw error when trying to add same route', function() {
    quasar.add.route(routeOne);
    expect(function() {
      quasar.add.route(routeOne);
    }).to.throw(/Route already registered/);
  });

  it('should be able to retrieve route by hash', function() {
    expect(quasar.get.route).to.be.a('function');
    expect(function() {
      quasar.get.route();
    }).to.throw(/Missing hash/);

    var result = quasar.get.route(routeOne.hash);

    expect(result).to.not.be.ok;

    quasar.add.route(routeOne);
    result = quasar.get.route(routeOne.hash);

    expect(result).to.be.an('object');
    expect(result.hash).to.equal(routeOne.hash);
  });

  it('should be able to overwrite a route', function() {
    var newRoute = $.extend({}, routeOne);

    newRoute.trigger = function() { var i = 0; };
    expect(routeOne).to.not.deep.equal(newRoute);

    quasar.add.route(routeOne);
    quasar.overwrite.route(newRoute);

    expect(quasar.get.route(routeOne.hash)).to.deep.equal(newRoute);

    expect(function() {
      quasar.overwrite.route();
    }).to.throw(/Missing route/);

    expect(function() {
      quasar.overwrite.route({});
    }).to.throw(/Route has no hash/);

    expect(function() {
      quasar.overwrite.route({
        hash: 'bogus',
        trigger: function() {}
      });
    }).to.throw(/Route not registered/);
  });

  it('should be able to navigate to route', function() {
    expect(quasar.navigate.to.route).to.be.a('function');
    quasar.navigate.to.route('#/quasar');

    expect(quasar.get.current.route).to.be.a('function');
    expect(quasar.get.current.route()).to.equal('#/quasar');

    expect(function() {
      quasar.navigate.to.route();
    }).to.throw(/Hash missing/);

    expect(function() {
      quasar.navigate.to.route('/quasar');
    }).to.throw(/Route should start with #/);
  });

  it('should be able to initialize and trigger a route', function(done) {
    quasar.add.route({
      hash: '#/',
      trigger: function() { done(); }
    });
    expect(quasar.start.router).to.be.a('function');
    quasar.start.router();
    expect(quasar.get.all.routes()).to.have.length(1);
  });

  it('should be able to trigger route', function(done) {
    var times = 0;

    quasar.add.route({
      hash: '#/quasar',
      trigger: function() {
        expect(times).to.equal(0);
        done();
      }
    });
    quasar.start.router();
    quasar.navigate.to.route('#/quasar');
  });

  it('should throw error when adding route with no methods', function() {
    expect(function() {
      quasar.add.route({hash: '#/quasar'});
    }).to.throw(/Missing route trigger method/);
  });

  it('should be able to refresh a route', function(done) {
    var times = 0;

    expect(quasar.reload.current.route).to.be.a('function');
    quasar.add.route({
      hash: '#/quasar',
      trigger: function() {
        times++;
        if (times == 2) {
          done();
        }
      }
    });
    quasar.start.router();
    quasar.navigate.to.route('#/quasar');
    quasar.reload.current.route();
  });

  it('should be able to register and trigger route with parameters', function(done) {
    quasar.add.route({
      hash: '#/page/:number',
      trigger: function() {
        expect(this.params).to.be.an('object');
        expect(this.params.number).to.equal('10');
        done();
      }
    });
    quasar.start.router();
    quasar.navigate.to.route('#/page/10');
  });

  it('should be able to capture query string', function(done) {
    quasar.add.route({
      hash: '#/page',
      trigger: function() {
        expect(this.query).to.be.an('object');
        expect(this.query.test).to.equal('true');
        expect(this.query.tset).to.equal('false');
        expect(this.query.empty).to.equal('');
        expect(this.query.empty2).to.equal('');
        expect(this.query.complex).to.equal(' this');
        done();
      }
    });
    quasar.start.router();
    quasar.navigate.to.route('#/page?empty=&empty2&test=true&tset=false&complex=%20this');
  });

  it('should be able to capture the query string (scenario #2)', function(done) {
    quasar.navigate.to.route('#/?test=true');
    quasar.add.route({
      hash: '#/',
      trigger: function() {
        expect(this.query).to.be.an('object');
        expect(this.query.test).to.equal('true');
        done();
      }
    });
    quasar.start.router();
  });

  it('should be able to provide the correct url property for trigger()', function(done) {
    quasar.add.route({
      hash: '#/page/:number',
      trigger: function() {
        expect(this.url).to.equal('#/page/10?think=big');
        done();
      }
    });
    quasar.start.router();
    quasar.navigate.to.route('#/page/10?think=big');
  });

  it('should trigger multiple routes', function(done) {
    quasar.add.route({
      hash: '#/route1',
      trigger: function() { quasar.navigate.to.route('#/route2'); }
    });
    quasar.add.route({
      hash: '#/route2',
      trigger: function() { done(); }
    });
    quasar.start.router();
    quasar.navigate.to.route('#/route1');
  });

  it('should trigger route method only once', function(done) {
    var times = 0;

    quasar.add.route({
      hash: '#/route1',
      trigger: function() {
        times++;
        expect(times).to.equal(1);
        setTimeout(function() {done();}, msToWaitBeforeHashChanges);
      }
    });
    quasar.start.router();
    quasar.navigate.to.route('#/route1');
  });

  it('should trigger routes correctly on browser back/forward', function(done) {
    quasar.add.route(routeOne);
    quasar.add.route(routeTwo);
    quasar.add.route(routeThree);
    quasar.start.router();

    quasar.navigate.to.route(routeOne.hash);

    setTimeout(function() {
      quasar.navigate.to.route(routeTwo.hash);
      setTimeout(function() {
        quasar.navigate.to.route(routeThree.hash);
        setTimeout(function() {
          expect(quasar.get.current.route()).to.equal(routeThree.hash);
          window.history.go(-1);
          setTimeout(function() {
            expect(quasar.get.current.route()).to.equal(routeTwo.hash);
            window.history.go(-1);
            setTimeout(function() {
              expect(quasar.get.current.route()).to.equal(routeOne.hash);
              window.history.go(1);
              setTimeout(function() {
                expect(quasar.get.current.route()).to.equal(routeTwo.hash);
                window.history.go(1);
                setTimeout(function() {
                  expect(quasar.get.current.route()).to.equal(routeThree.hash);
                  window.history.go(-1);
                  setTimeout(function() {
                    expect(quasar.get.current.route()).to.equal(routeTwo.hash);
                    done();
                  }, msToWaitBeforeHashChanges);
                }, msToWaitBeforeHashChanges);
              }, msToWaitBeforeHashChanges);
            }, msToWaitBeforeHashChanges);
          }, msToWaitBeforeHashChanges);
        }, msToWaitBeforeHashChanges);
      }, msToWaitBeforeHashChanges);
    }, msToWaitBeforeHashChanges);
  });

  it('should trigger route change and route trigger events', function(done) {
    var events = 0;

    quasar.add.route(routeOne);
    quasar.events.on('app:route:change', function(hash) {
      if (events === 0) {
        expect(hash).to.equal('#/');
      }
      else {
        expect(hash).to.equal(routeOne.hash);
      }
      events++;
    });
    quasar.events.on('app:route:trigger', function(route) {
      expect(route).to.be.an('object');
      expect(route.hash).to.be.ok;
      expect(events).to.equal(2);
      done();
    });
    quasar.start.router();
    quasar.navigate.to.route(routeOne.hash);
  });

  it('should trigger route not found event', function(done) {
    quasar.events.on('app:route:notfound', function(hashParts) {
      expect(hashParts).to.be.an('array');
      done();
    });
    quasar.start.router();
    quasar.navigate.to.route(routeOne.hash);
  });

  it('should trigger start and stop events', function(done) {
    quasar.stop.router();
    var events = 0;

    quasar.events.on('app:router:started', function() {
      events++;
    });
    quasar.events.on('app:router:stopped', function() {
      expect(events).to.equal(1);
      done();
    });
    quasar.start.router();
    quasar.stop.router();
  });

});
