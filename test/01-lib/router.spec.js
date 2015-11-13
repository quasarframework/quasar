'use strict';

describe('Router', function() {

  beforeEach(function() {
    this.hash = window.location.hash;
  });

  afterEach(function() {
    quasar.stop.router();
    window.location.hash = this.hash;
  });

  var msToWaitBeforeHashChanges = 75;
  var routeOne = {
    path: '#/route-one',
    on: function() {}
  };
  var routeTwo = {
    path: '#/route-two',
    on: function() {}
  };
  var routeThree = {
    path: '#/route-three',
    on: function() {}
  };


  it('should be able to get all routes', function() {
    expect(quasar.get.all.routes).to.be.a('function');
    var result = quasar.get.all.routes();

    expect(result).to.be.an('array');
    expect(result).to.have.length(0);
  });

  it('should be able to destroy router', function() {
    expect(quasar.stop.router).to.be.a('function');
    expect(quasar.router.is.running).to.be.a('function');
    quasar.stop.router();
    expect(quasar.router.is.running()).to.be.equal(false);
  });

  it('should be able to add a route and verify it', function() {
    expect(quasar.add.route).to.be.a('function');
    expect(quasar.has.route).to.be.a('function');

    expect(quasar.get.all.routes()).to.have.length(0);
    quasar.add.route(routeOne);
    expect(quasar.has.route(routeOne.path)).to.equal(true);
    expect(quasar.get.all.routes()).to.have.length(1);

    quasar.add.route(routeTwo);
    expect(quasar.has.route(routeTwo.path)).to.equal(true);
    expect(quasar.get.all.routes()).to.have.length(2);

    expect(function() {
      quasar.add.route();
    }).to.throw(/Missing route/);

    expect(function() {
      quasar.add.route({});
    }).to.throw(/Route has no path/);
  });

  it('should say if route is already registered', function() {
    expect(function() {
      quasar.has.route();
    }).to.throw(/Missing path/);

    expect(quasar.has.route(routeOne.path)).to.equal(false);
    quasar.add.route(routeOne);
    expect(quasar.has.route(routeOne.path)).to.equal(true);
  });

  it('should be able to remove all routes', function() {
    expect(quasar.remove.all.routes).to.be.a('function');
    quasar.add.route(routeOne);
    quasar.remove.all.routes();
    expect(quasar.has.route(routeOne.path)).to.equal(false);
    expect(quasar.get.all.routes()).to.have.length(0);
  });

  it('should be able to remove a route', function() {
    expect(quasar.remove.route).to.be.a('function');
    quasar.add.route(routeOne);
    quasar.add.route(routeTwo);
    quasar.remove.route(routeOne.path);
    expect(quasar.has.route(routeOne.path)).to.equal(false);
    expect(quasar.has.route(routeTwo.path)).to.equal(true);
    expect(quasar.get.all.routes()).to.have.length(1);

    expect(function() {
      quasar.remove.route();
    }).to.throw(/Missing path/);
  });

  it('should throw error when trying to add same route', function() {
    quasar.add.route(routeOne);
    expect(function() {
      quasar.add.route(routeOne);
    }).to.throw(/Route already registered/);
  });

  it('should be able to retrieve route by path', function() {
    expect(quasar.get.route).to.be.a('function');
    expect(function() {
      quasar.get.route();
    }).to.throw(/Missing path/);

    var result = quasar.get.route(routeOne.path);

    expect(result).to.not.be.ok;

    quasar.add.route(routeOne);

    result = quasar.get.route(routeOne.path);

    expect(result).to.be.an('object');
    expect(result.path).to.equal(routeOne.path);
  });

  it('should be able to overwrite a route', function() {
    var newRoute = _.clone(routeOne, true);

    newRoute.on = function() { console.log('new route'); };
    expect(routeOne).to.not.deep.equal(newRoute);

    quasar.add.route(routeOne);
    quasar.overwrite.route(newRoute);

    expect(quasar.get.route(routeOne.path)).to.deep.equal(newRoute);

    expect(function() {
      quasar.overwrite.route();
    }).to.throw(/Missing route/);

    expect(function() {
      quasar.overwrite.route({});
    }).to.throw(/Route has no path/);

    expect(function() {
      quasar.overwrite.route({
        path: 'bogus',
        on: function() {}
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
    }).to.throw(/Path missing/);

    expect(function() {
      quasar.navigate.to.route('/quasar');
    }).to.throw(/Route should start with #/);
  });

  it('should be able to initialize and trigger a route', function(done) {
    quasar.add.route({
      path: '#/',
      on: function() { done(); }
    });
    expect(quasar.start.router).to.be.a('function');
    quasar.start.router();
    expect(quasar.get.all.routes()).to.have.length(1);
  });

  it('should be able to trigger route', function(done) {
    var times = 0;

    quasar.add.route({
      path: '#/quasar',
      on: function() {
        expect(times).to.equal(0);
        done();
      }
    });
    quasar.start.router();
    quasar.navigate.to.route('#/quasar');
  });

  it('should throw error when adding route with no methods', function() {
    expect(function() {
      quasar.add.route({path: '#/quasar'});
    }).to.throw(/Missing route methods/);
  });

  it('should be able to refresh a route', function(done) {
    var times = 0;

    expect(quasar.reload.current.route).to.be.a('function');
    quasar.add.route({
      path: '#/quasar',
      on: function() {
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
      path: '#/page/:number',
      before: function() {
        expect(this.params).to.be.an('object');
        expect(this.params.number).to.equal('10');
        this.next();
      },
      on: function() {
        expect(this.params).to.be.an('object');
        expect(this.params.number).to.equal('10');
        this.next();
      },
      after: function() {
        expect(this.params).to.be.an('object');
        expect(this.params.number).to.equal('10');
        this.next();
        done();
      }
    });
    quasar.start.router();
    quasar.navigate.to.route('#/page/10');
  });

  it('should be able to capture query string', function(done) {
    quasar.add.route({
      path: '#/page',
      before: function() {
        expect(this.query).to.be.an('object');
        expect(this.query.test).to.equal('true');
        expect(this.query.tset).to.equal('false');
        expect(this.query.empty).to.equal('');
        expect(this.query.empty2).to.equal('');
        expect(this.query.complex).to.equal(' this');
        this.next();
      },
      on: function() {
        expect(this.query).to.be.an('object');
        expect(this.query.test).to.equal('true');
        expect(this.query.tset).to.equal('false');
        expect(this.query.empty).to.equal('');
        expect(this.query.empty2).to.equal('');
        expect(this.query.complex).to.equal(' this');
        this.next();
      },
      after: function() {
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
      path: '#/',
      on: function() {
        expect(this.query).to.be.an('object');
        expect(this.query.test).to.equal('true');
        done();
      }
    });
    quasar.start.router();
  });

  it('should be able to provide the correct url property for before/on/after', function(done) {
    quasar.add.route({
      path: '#/page/:number',
      before: function() {
        expect(this.url).to.equal('#/page/10?think=big');
        this.next();
      },
      on: function() {
        expect(this.url).to.equal('#/page/10?think=big');
        this.next();
      },
      after: function() {
        expect(this.url).to.equal('#/page/10?think=big');
        done();
      }
    });
    quasar.start.router();
    quasar.navigate.to.route('#/page/10?think=big');
  });

  it('should trigger multiple routes', function(done) {
    quasar.add.route({
      path: '#/route1',
      on: function() { quasar.navigate.to.route('#/route2'); }
    });
    quasar.add.route({
      path: '#/route2',
      on: function() { done(); }
    });
    quasar.start.router();
    quasar.navigate.to.route('#/route1');
  });

  it('should trigger all route methods (only once)', function(done) {
    var times = 0;

    quasar.add.route({
      path: '#/route1',
      before: function() {
        times++;
        expect(times).to.equal(1);
        expect(this.next).to.be.a('function');
        this.next('before-result');
      },
      on: function(result) {
        times++;
        expect(times).to.equal(2);
        expect(result).to.equal('before-result');
        expect(this.next).to.be.a('function');
        this.next('on-result');
      },
      after: function(result) {
        times++;
        expect(times).to.equal(3);
        expect(result).to.equal('on-result');
        done();
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

    quasar.navigate.to.route(routeOne.path);

    setTimeout(function() {
      quasar.navigate.to.route(routeTwo.path);
      setTimeout(function() {
        quasar.navigate.to.route(routeThree.path);
        setTimeout(function() {
          expect(quasar.get.current.route()).to.equal(routeThree.path);
          window.history.go(-1);
          setTimeout(function() {
            expect(quasar.get.current.route()).to.equal(routeTwo.path);
            window.history.go(-1);
            setTimeout(function() {
              expect(quasar.get.current.route()).to.equal(routeOne.path);
              window.history.go(1);
              setTimeout(function() {
                expect(quasar.get.current.route()).to.equal(routeTwo.path);
                window.history.go(1);
                setTimeout(function() {
                  expect(quasar.get.current.route()).to.equal(routeThree.path);
                  window.history.go(-1);
                  setTimeout(function() {
                    expect(quasar.get.current.route()).to.equal(routeTwo.path);
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

  it('should call onRouteChange', function(done) {
    quasar.add.route(routeOne);
    quasar.start.router({
      onRouteChange: function(route) {
        expect(route).to.be.an('object');
        expect(route.path).to.be.ok;
        done();
      }
    });
    quasar.navigate.to.route(routeOne.path);
  });

  it('should call onRouteNotFound', function(done) {
    quasar.start.router({
      onRouteNotFound: function(route) {
        expect(route).to.be.an('array');
        done();
      }
    });
    quasar.navigate.to.route(routeOne.path);
  });

  it('should log about no valid route when onRouteNotFound() is not specified', function(done) {
    sinon.spy(window.console, 'log');
    quasar.start.router();
    setTimeout(function() {
      expect(window.console.log).to.have.been.calledOnce;
      expect(window.console.log).to.have.been.calledWithMatch('No valid route');
      window.console.log.restore();
      done();
    }, msToWaitBeforeHashChanges);
  });

});
