'use strict';

describe('Request', function() {

  var url = '/some/path/script.php';

  var
    objOne = [{id: 1, comment: 'Hey there'}],
    objTwo = [{id: 2, comment: 'Hello, sir!'}],
    objThree = [{id: 3, category: 'Science'}],

    jsonOne = JSON.stringify(objOne),
    jsonTwo = JSON.stringify(objTwo),
    jsonThree = JSON.stringify(objThree),

    urlOne = '/some/script_one.php',
    urlTwo = '/another/script_two.php',
    urlThree = '/some/other/script_three.php',
    fullURL = 'http://quasar-framework.org/framework.json',

    contentType = {'Content-Type': 'application/json'}
    ;

  beforeEach(function() {
    this.server = sinon.fakeServer.create();
    quasar.clear.requests.cache();
  });
  afterEach(function() {
    this.server.restore();
    quasar.clear.requests.cache();
  });


  describe('basic functionality', function() {

    it('should trigger a <type> request and parse the data it receives', function(done) {
      expect(quasar.make.a.request).to.be.ok;
      expect(quasar.make.a.request).to.be.a('function');

      this.server.respondWith('PUT', urlOne, [200, contentType, jsonOne]);

      quasar.make.a.request('PUT', {url: urlOne}).done(function(data) {
        expect(data).to.deep.equal(objOne);
        done();
      });

      this.server.respond();
    });

    it('should trigger a GET request and parse the data it receives', function(done) {
      expect(quasar.make.a.get.request).to.be.ok;
      expect(quasar.make.a.get.request).to.be.a('function');

      this.server.respondWith('GET', urlOne, [200, contentType, jsonOne]);

      quasar.make.a.get.request({url: urlOne}).done(function(data) {
        expect(data).to.deep.equal(objOne);
        done();
      });

      this.server.respond();
    });

    it('should trigger a POST request and parse the data it receives', function(done) {
      expect(quasar.make.a.post.request).to.be.ok;
      expect(quasar.make.a.post.request).to.be.a('function');

      this.server.respondWith('POST', urlTwo, [201, contentType, jsonOne]);

      quasar.make.a.post.request({url: urlTwo}).done(function(data) {
        expect(data).to.deep.equal(objOne);
        done();
      });

      this.server.respond();
    });

    it('should trigger a PUT request and parse the data it receives', function(done) {
      expect(quasar.make.a.put.request).to.be.ok;
      expect(quasar.make.a.put.request).to.be.a('function');

      this.server.respondWith('PUT', urlThree, [201, contentType, jsonOne]);

      quasar.make.a.put.request({url: urlThree}).done(function(data) {
        expect(data).to.deep.equal(objOne);
        done();
      });

      this.server.respond();
    });

    it('should trigger a DELETE request and parse the data it receives', function(done) {
      expect(quasar.make.a.del.request).to.be.ok;
      expect(quasar.make.a.del.request).to.be.a('function');

      this.server.respondWith('DELETE', fullURL, [200, contentType, jsonOne]);

      quasar.make.a.del.request({url: fullURL}).done(function(data) {
        expect(data).to.deep.equal(objOne);
        done();
      });

      this.server.respond();
    });

    it('should throw when url parameter is missing', function() {
      expect(function() {
        quasar.make.a.get.request();
      }).to.throw(/Missing URL/);

      expect(function() {
        quasar.make.a.post.request();
      }).to.throw(/Missing URL/);

      expect(function() {
        quasar.make.a.put.request();
      }).to.throw(/Missing URL/);

      expect(function() {
        quasar.make.a.del.request();
      }).to.throw(/Missing URL/);
    });

    it('should trigger a GET request to the right URL when base URL is configured', function(done) {
      var url = 'http://quasar-framework.org/framework';
      var initialConfig = quasar.config.requests.baseURL;

      quasar.config.requests.baseURL = url;
      this.server.respondWith('GET', url + '/some/script.php', [200, contentType, jsonOne]);

      quasar.make.a.get.request({url: 'some/script.php'}).done(function(data) {
        expect(data).to.deep.equal(objOne);

        quasar.config.requests.baseURL = initialConfig;
        done();
      });

      this.server.respond();
    });

    it('should avoid using baseURL when trying a local request', function(done) {
      var url = 'http://quasar-framework.org/';
      var initialConfig = quasar.config.requests.baseURL;

      quasar.config.requests.baseURL = url;
      this.server.respondWith('GET', 'some/script.php', [200, contentType, jsonOne]);

      quasar.make.a.get.request({url: 'some/script.php', local: true}).done(function(data) {
        expect(data).to.deep.equal(objOne);

        quasar.config.requests.baseURL = initialConfig;
        done();
      });

      this.server.respond();
    });

    it('should be able to transmit object data over to the server', function(done) {
      this.server.respondWith('POST', urlOne, [200, contentType, jsonOne]);

      quasar.make.a.post.request({
        url: urlOne,
        data: {category: true}
      }).done(function() {
        done();
      });

      this.server.respond();
    });

    it('should be able to transmit array data over to the server', function(done) {
      this.server.respondWith('POST', urlOne, [200, contentType, jsonOne]);

      quasar.make.a.post.request({
        url: urlOne,
        data: [1, 2, 3]
      }).done(function() {
        done();
      });

      this.server.respond();
    });

  });

  describe('error handler', function() {

    before(function() {
      this.initialConfig = quasar.config.requests.failFnHandler;
    });

    after(function() {
      quasar.config.requests.failFnHandler = this.initialConfig;
    });

    it('should be triggered and call fail() when it is configured so', function(done) {
      var triggerHandler = false;

      quasar.config.requests.failFnHandler = function(error) {
        if (error.status && error.status == 404) {
          triggerHandler = true;
          return false;
        }
      };

      this.server.respondWith('GET', url + '/some/script.php', [404, contentType, jsonOne]);

      quasar.make.a.get.request({url: 'some/script.php'}).fail(function() {
        expect(triggerHandler).to.equal(true);
        done();
      });

      this.server.respond();
    });

    it('should be triggered and DON\'T call fail() when it is configured so', function(done) {
      quasar.config.requests.failFnHandler = function() {
        setTimeout(done, 1);
        return true;
      };

      this.server.respondWith('GET', urlOne, [404, contentType, jsonOne]);

      quasar.make.a.get.request({url: urlOne}).fail(function() {
        // because failFnHandler returns true,
        // we should not reach this point:
        throw new Error('Should not call fail()');
      });

      expect(function() {
        this.server.respond();
      }.bind(this)).to.throw(/Halting default failure handlers/);
    });

    it('should not be triggered if request is a success', function(done) {
      quasar.config.requests.failFnHandler = function() {
        throw new Error('Should not be called on success');
      };

      this.server.respondWith('GET', urlOne, [200, contentType, jsonOne]);

      quasar.make.a.get.request({url: urlOne})
        .fail(function() {
          // because of failFnHandler returning false:
          throw new Error('Should not call fail()');
        })
        .done(function() {
          done();
        });

      this.server.respond();
    });

  });

  describe('cache', function() {

    expect(quasar.clear.requests.cache).to.be.a('function');

    beforeEach(function() {
      this.initialConfig = quasar.config.requests.use.cache;
      sinon.spy(window.console, 'log');
    });

    afterEach(function() {
      quasar.config.requests.use.cache = this.initialConfig;
      window.console.log.restore();
    });

    after(function() {
      quasar.clear.requests.cache();
    });

    it('should fetch from cache when cache is enabled', function(done) {
      quasar.config.requests.use.cache = true;

      this.server.respondWith('GET', urlOne, [200, contentType, jsonOne]);

      quasar.make.a.get.request({url: urlOne}).done(function() {
        expect(console.log).to.have.been.calledWithMatch('to-cache');
        quasar.make.a.get.request({url: urlOne}).done(function() {
          expect(console.log).to.have.been.calledWithMatch('from-cache');
          done();
        });
      });

      this.server.respond();
    });

    it('should fetch from server when cache is disabled', function(done) {
      quasar.config.requests.use.cache = false;

      this.server.respondWith('GET', urlOne, [200, contentType, jsonOne]);

      quasar.make.a.get.request({url: urlOne}).done(function() {
        quasar.make.a.get.request({url: urlOne}).done(function() {
          expect(console.log).to.have.been.calledWithMatch('start');
          expect(console.log).to.have.been.calledWithMatch('done');

          expect(console.log).to.not.have.been.calledWithMatch('to-cache');
          expect(console.log).to.not.have.been.calledWithMatch('from-cache');

          done();
        });
        this.server.respond();
      }.bind(this));
      this.server.respond();
    });

    it('should fetch from server when cachable is set to false', function(done) {
      quasar.config.requests.use.cache = true;

      this.server.respondWith('GET', urlOne, [200, contentType, jsonOne]);

      quasar.make.a.get.request({url: urlOne, cachable: false}).done(function() {
        quasar.make.a.get.request({url: urlOne, cachable: false}).done(function() {
          expect(console.log).to.have.been.calledWithMatch('start');
          expect(console.log).to.have.been.calledWithMatch('done');

          expect(console.log).to.not.have.been.calledWithMatch('to-cache');
          expect(console.log).to.not.have.been.calledWithMatch('from-cache');

          done();
        });
        this.server.respond();
      }.bind(this));
      this.server.respond();
    });

  });

  describe('group', function() {

    expect(quasar.make.a.group.request).to.be.ok;
    expect(quasar.make.a.group.request).to.be.a('function');

    it('should succeed if all requests are successful', function(done) {
      this.server.respondWith('GET', urlOne, [200, contentType, jsonOne]);
      this.server.respondWith('DELETE', urlTwo, [200, contentType, jsonTwo]);
      this.server.respondWith('GET', urlThree, [200, contentType, jsonThree]);

      var answers = 0;

      quasar.make.a.group.request(
        quasar.make.a.get.request({url: urlOne}).done(function(data) {
          expect(data).to.deep.equal(objOne);
          answers++;
        }),
        quasar.make.a.del.request({url: urlTwo}).done(function(data) {
          expect(data).to.deep.equal(objTwo);
          answers++;
        }),
        quasar.make.a.get.request({url: urlThree}).done(function(data) {
          expect(data).to.deep.equal(objThree);
          answers++;
        })
      ).done(function(jqXHR) {
        expect(jqXHR).to.be.ok;
        expect(jqXHR).to.be.an('array');

        expect(answers).to.equal(3);
        done();
      }).fail(function() {
        throw new Error('Should have not call fail()');
      });

      this.server.respond();
    });

    it('should succeed if all requests are successful (scenario #2)', function(done) {
      this.server.respondWith('GET', urlOne, [200, contentType, jsonOne]);
      this.server.respondWith('GET', urlTwo, [200, contentType, jsonTwo]);
      this.server.respondWith('GET', urlThree, [200, contentType, jsonThree]);
      this.server.respondWith('GET', fullURL, [200, contentType, jsonThree]);

      quasar.make.a.group.request(
        quasar.make.a.get.request({url: urlOne}),
        quasar.make.a.get.request({url: urlTwo}),
        quasar.make.a.get.request({url: urlThree}),
        quasar.make.a.get.request({url: fullURL})
      ).done(function(jqXHR) {
        expect(jqXHR).to.be.ok;
        expect(jqXHR).to.be.an('array');
        done();
      }).fail(function() {
        throw new Error('Should have not call fail()');
      });

      this.server.respond();
    });

    it('should fail if at least one request fails', function(done) {
      this.server.respondWith('GET', urlOne, [200, contentType, jsonOne]);
      this.server.respondWith('DELETE', urlTwo, [500, contentType, jsonTwo]);
      this.server.respondWith('GET', urlThree, [500, contentType, jsonThree]);

      var answers = 0;

      quasar.make.a.group.request(
        quasar.make.a.get.request({url: urlOne}).done(function(data) {
          expect(data).to.deep.equal(objOne);
          answers++;
        }),
        quasar.make.a.del.request({url: urlTwo}).fail(function() {
          answers++;
        }),
        quasar.make.a.get.request({url: urlThree}).fail(function() {
          answers++;
        })
      ).fail(function(jqXHR) {
        expect(jqXHR).to.be.ok;

        // taking into the account the order of receiving the answers,
        // answers should be 2 because on first fail it aborts
        expect(answers).to.equal(2);
        done();
      }).done(function() {
        throw new Error('Should have not call done()');
      });

      this.server.respond();
    });

    it('should fail if at least one request timeouts', function(done) {
      this.server.respondWith('GET', urlOne, [200, contentType, jsonOne]);

      var answers = 0;

      quasar.make.a.group.request(
        quasar.make.a.get.request({url: urlOne}).done(function(data) {
          expect(data).to.deep.equal(objOne);
          answers++;
        }),
        quasar.make.a.del.request({url: urlTwo}).fail(function() {
          answers++;
        })
      ).fail(function(jqXHR) {
        expect(jqXHR).to.be.ok;
        expect(answers).to.equal(2);
        done();
      }).done(function() {
        throw new Error('Should have not call done()');
      });

      this.server.respond();
    });

    it('should throw error when missing parameters', function() {
      expect(function() {
        quasar.make.a.group.request();
      }).to.throw(/Missing parameters/);
    });

  });

  describe('store', function() {

    expect(quasar.get.store).to.be.a('function');

    it('should be able to make a call with all types', function(done) {
      var store = quasar.get.store({url: urlOne});

      var answers = 0;
      var fn = function() {
        answers++;
        if (answers === 4) {
          done();
        }
      };

      this.server.respondWith('GET', urlOne, [200, contentType, jsonOne]);
      this.server.respondWith('POST', urlOne, [200, contentType, jsonTwo]);
      this.server.respondWith('PUT', urlOne, [200, contentType, jsonTwo]);
      this.server.respondWith('DELETE', urlOne, [200, contentType, jsonTwo]);

      store.make.a.get.request().done(fn);
      store.make.a.post.request().done(fn);
      store.make.a.put.request().done(fn);
      store.make.a.del.request().done(fn);

      this.server.respond();
    });

    it('should be able to overwrite common config', function(done) {
      var store = quasar.get.store({url: urlOne});

      this.server.respondWith('GET', urlTwo, [200, contentType, jsonOne]);

      store.make.a.get.request({url: urlTwo}).done(function() {
        done();
      });

      this.server.respond();
    });

    it('should throw when calling with incorrect parameters', function() {
      expect(function() {
        quasar.get.store();
      }).to.throw(/Missing config/);

      expect(function() {
        quasar.get.store({});
      }).to.throw(/Missing url from config/);
    });

  });

  describe('in progress', function() {

    it('should abort current request', function(done) {
      this.server.respondWith('GET', urlOne, [200, contentType, jsonOne]);
      this.server.respondWith('GET', urlTwo, [200, contentType, jsonOne]);
      this.server.autoRespond = true;
      this.server.autoRespondAfter = 20;

      quasar.make.a.get.request({url: urlOne, requestName: 'one'}).done(function() {
        throw new Error('Should not trigger first response with success');
      });

      quasar.make.a.get.request({url: urlTwo, requestName: 'one'}).done(function() {
        done();
      });
    });

    it('should be able to abort all requests', function(done) {
      this.server.respondWith('GET', urlOne, [200, contentType, jsonOne]);
      this.server.respondWith('GET', urlTwo, [200, contentType, jsonOne]);
      this.server.autoRespond = true;
      this.server.autoRespondAfter = 20;

      var times = 0;
      var fn = function() {
        times++;
        if (times === 2) {
          done();
        }
      };

      quasar.make.a.get.request({url: urlOne}).done(function() {
        throw new Error('Should not trigger first response with success');
      }).fail(fn);

      quasar.make.a.get.request({url: urlTwo}).done(function() {
        throw new Error('Should not trigger second response with success');
      }).fail(fn);

      quasar.abort.all.requests();
    });

    it('should be able to abort all requests BUT avoid aborting persistent ones', function(done) {
      this.server.respondWith('GET', urlOne, [200, contentType, jsonOne]);
      this.server.respondWith('GET', urlTwo, [200, contentType, jsonOne]);
      this.server.autoRespond = true;
      this.server.autoRespondAfter = 20;

      var times = 0;
      var fn = function() {
        times++;
        if (times === 2) {
          done();
        }
      };

      quasar.make.a.get.request({url: urlOne})
        .done(function() {
          throw new Error('Should not trigger first response with success');
        })
        .fail(fn);

      quasar.make.a.get.request({url: urlTwo, persistent: true})
        .done(fn)
        .fail(function() {
          throw new Error('Should not trigger second response with failure');
        });

      quasar.abort.all.requests();
    });

  });

});
