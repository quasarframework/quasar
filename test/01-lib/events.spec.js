'use strict';

describe('Events', function() {

  beforeEach(function() {
    this.emitter = quasar.create.events.emitter();
    this.emptyFn = function() {};
  });

  after(function() {
    delete this.emitter;
    delete this.emptyFn;
  });

  it('should be able to create emitter', function() {
    expect(this.emitter).to.be.an('object');
  });

  it('should be able to bind an event', function() {
    this.emitter.on('someEvent', this.emptyFn);
    expect(this.emitter.hasEvent('someEvent')).to.equal(true);

    this.emitter.on('someOtherEvent', this.emptyFn);
    expect(this.emitter.hasEvent('someOtherEvent')).to.equal(true);
  });

  it('should throw error when supplying on() with faulty parameters', function() {
    expect(function() {
      this.emitter.on();
    }.bind(this)).to.throw(/Missing event name/);

    expect(function() {
      this.emitter.on('event');
    }.bind(this)).to.throw(/Missing callback/);

    expect(function() {
      this.emitter.on('event', 'string');
    }.bind(this)).to.throw(/Callback is not a function/);

    this.emitter.on('event', this.emptyFn);
    expect(function() {
      this.emitter.on('event', this.emptyFn);
    }.bind(this)).to.throw(/Event name already has specified callback/);
  });

  it('should be able to get events list', function() {
    this.emitter.on('someEvent', this.emptyFn);
    this.emitter.on('someOtherEvent', this.emptyFn);
    expect(this.emitter.getEventsList()).to.deep.equal(['someEvent', 'someOtherEvent']);
  });

  it('should be able to unbind an event completely', function() {
    this.emitter.on('someEvent', this.emptyFn);
    this.emitter.off('someEvent');
    expect(this.emitter.hasEvent('someEvent')).to.equal(false);
  });

  it('should be able to unbind a callback from an event', function() {
    this.emitter.on('someEvent', this.emptyFn);
    this.emitter.off('someEvent', this.emptyFn);
    expect(this.emitter.hasEvent('someEvent', this.emptyFn)).to.equal(false);
  });

  it('should throw error when supplying off() with faulty parameters', function() {
    expect(function() {
      this.emitter.off();
    }.bind(this)).to.throw(/Missing event name/);

    expect(function() {
      this.emitter.off('event');
    }.bind(this)).to.throw(/Unregistered event name/);

    this.emitter.on('event', this.emptyFn);

    expect(function() {
      this.emitter.off('event', 'string');
    }.bind(this)).to.throw(/Callback is not a function/);

    expect(function() {
      this.emitter.off('event', function() {});
    }.bind(this)).to.throw(/Event is not registered with specified callback/);
  });

  it('should be able to trigger event', function(done) {
    this.emitter.on('event', function() {
      done();
    });
    this.emitter.trigger('event');
  });

  it('should be able to trigger event with parameters', function(done) {
    this.emitter.on('event', function() {
      expect(Array.prototype.slice.call(arguments)).to.deep.equal(['first', 'second', 1, {think: 'big'}]);
      done();
    });
    this.emitter.trigger('event', 'first', 'second', 1, {think: 'big'});
  });

  it('should be able to register event callback with context', function(done) {
    this.emitter.on(
      'event',
      function(param) {
        expect(param).to.equal('param');
        expect(this.prop).to.equal(true);
        done();
      },
      {prop: true}
    );
    this.emitter.trigger('event', 'param');
  });

  it('should throw error when supplying trigger() with faulty parameters', function() {
    expect(function() {
      this.emitter.trigger();
    }.bind(this)).to.throw(/Missing event name/);

    // Should not throw for unregistered event:
    this.emitter.trigger('event');
  });

  it('should be able to trigger event callback once', function() {
    var
      times = 0,
      callback = function() {
        times++;
      };

    this.emitter.once('event', callback);
    this.emitter.trigger('event');
    this.emitter.trigger('event');
    expect(times).to.equal(1);
  });

  it('should be able to tell if event is registered with a specific callback', function() {
    this.emitter.on('event', this.emptyFn);
    expect(this.emitter.hasEvent('event', this.emptyFn)).to.equal(true);
    expect(this.emitter.hasEvent('event', function() {})).to.equal(false);
  });

  it('should throw error when supplying hasEvent() with faulty parameters', function() {
    expect(function() {
      this.emitter.hasEvent();
    }.bind(this)).to.throw(/Missing event name/);

    this.emitter.on('event', this.emptyFn);
    expect(function() {
      this.emitter.hasEvent('event', 'string');
    }.bind(this)).to.throw(/Callback is not a function/);
  });

  it('should be able to inject events methods to an object', function(done) {
    var object = {};

    quasar.make.events.emitter(object);
    expect(object.on).to.be.a('function');
    expect(object.off).to.be.a('function');
    expect(object.once).to.be.a('function');
    expect(object.trigger).to.be.a('function');

    object.on('event', function() {
      done();
    });
    expect(object.hasEvent('event'));
    object.trigger('event');
  });

  it('should throw error when trying to inject events methods to an object and supplying faulty params', function() {
    expect(function() {
      quasar.make.events.emitter();
    }).to.throw(/Missing object/);
  });

  it('should tell if object is an event emitter', function() {
    expect(quasar.is.events.emitter(this.emitter)).to.equal(true);
    expect(quasar.is.events.emitter({some: 'object'})).to.equal(false);
  });

  it('should throw error when trying to tell if object is emitter and supplying faulty params', function() {
    expect(function() {
      quasar.is.events.emitter();
    }).to.throw(/Missing object/);
  });

});
