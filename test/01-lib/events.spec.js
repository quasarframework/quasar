'use strict';

describe('Events', function() {

  beforeEach(function() {
    this.emitter = quasar.create.events.emitter();
    this.emptyFn = function() {};
    this.times = 0;
    this.fn = function() { this.times++; }.bind(this);
  });

  after(function() {
    delete this.emitter;
    delete this.emptyFn;
  });

  it('should be able to create emitter', function() {
    expect(this.emitter).to.be.an('object');
  });

  it('should be able to register an event', function() {
    this.emitter.on('someEvent', this.emptyFn);
    expect(this.emitter.hasSubscriber('someEvent')).to.equal(true);

    this.emitter.on('someOtherEvent', this.emptyFn);
    expect(this.emitter.hasSubscriber('someOtherEvent')).to.equal(true);
  });

  it('should throw error when supplying on() with faulty parameters', function() {
    expect(function() {
      this.emitter.on();
    }.bind(this)).to.throw(/Missing event\(s\) name\(s\)/);

    expect(function() {
      this.emitter.on('event');
    }.bind(this)).to.throw(/Missing callback/);

    expect(function() {
      this.emitter.on('event', 'string');
    }.bind(this)).to.throw(/Callback is not a function/);
  });

  it('should not trigger callback multiple times if registered multiple times', function() {
    this.emitter.on('event', this.fn);
    this.emitter.on('event', this.fn);
    this.emitter.trigger('event');
    expect(this.times).to.equal(1);
  });

  it('should be able to get events list', function() {
    this.emitter.on('someEvent', this.emptyFn);
    this.emitter.on('someOtherEvent', this.emptyFn);
    expect(this.emitter.getEventsList()).to.deep.equal(['someEvent', 'someOtherEvent']);
  });

  it('should be able to remove an event completely', function() {
    this.emitter.on('someEvent', this.emptyFn);
    this.emitter.off('someEvent');
    expect(this.emitter.hasSubscriber('someEvent')).to.equal(false);
  });

  it('should be able to remove a callback from an event', function() {
    this.emitter.on('someEvent', this.emptyFn);
    this.emitter.off('someEvent', this.emptyFn);
    expect(this.emitter.hasSubscriber('someEvent', this.emptyFn)).to.equal(false);
  });

  it('should be able to remove a callback from an event but retain other callbacks', function() {
    this.emitter.on('event1', this.emptyFn);
    this.emitter.on('event1', this.fn);
    this.emitter.off('event1', this.emptyFn);
    expect(this.emitter.hasSubscriber('event1', this.emptyFn)).to.equal(false);
    expect(this.emitter.hasSubscriber('event1', this.fn)).to.equal(true);
  });

  it('should be able to remove all events', function() {
    this.emitter.on('event1', this.emptyFn);
    this.emitter.on('event2', this.emptyFn);
    this.emitter.off();
    expect(this.emitter.hasSubscriber('event1')).to.equal(false);
    expect(this.emitter.hasSubscriber('event2')).to.equal(false);
  });

  it('should throw error when supplying off() with faulty parameters', function() {
    expect(function() {
      this.emitter.off('event', 'string');
    }.bind(this)).to.throw(/Callback is not a function/);

    // Should not throw on unregistered event/callback
    this.emitter.off('event', this.emptyFn);

    // Should not throw on unregistered callback
    this.emitter.on('event', this.emptyFn);
    this.emitter.off('event', this.fn);
    expect(this.emitter.hasSubscriber('event', this.emptyFn)).to.equal(true);
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
    var emitter = this.emitter;

    emitter.on(
      'event',
      function(param) {
        expect(param).to.equal('param');
        expect(this.prop).to.equal(true);
        quasar.nextTick(function() {
          // expect to still have this event registered
          expect(emitter.hasSubscriber('event')).to.equal(true);
          done();
        });
      },
      {prop: true}
    );
    emitter.trigger('event', 'param');
  });

  it('should be able to trigger all events at once', function() {
    // Should not throw for unregistered event:
    this.emitter.trigger('event');
    // SHould not throw when no events are registered
    this.emitter.trigger();

    this.emitter.on('event1', this.fn);
    this.emitter.on('event2', this.fn);
    this.emitter.trigger();
    expect(this.times).to.equal(2);
    expect(this.emitter.getEventsList()).to.deep.equal(['event1', 'event2']);
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

  it('should tell if callbacks are registered for an event', function() {
    expect(this.emitter.hasSubscriber('event')).to.equal(false);
    this.emitter.on('event', this.fn);
    expect(this.emitter.hasSubscriber('event')).to.equal(true);
    this.emitter.off('event');
    expect(this.emitter.hasSubscriber('event')).to.equal(false);
  });

  it('should tell if a callback is registered for an event', function() {
    expect(this.emitter.hasSubscriber('event', this.fn)).to.equal(false);
    this.emitter.on('event', this.emptyFn);
    expect(this.emitter.hasSubscriber('event', this.fn)).to.equal(false);
    this.emitter.on('event', this.fn);
    expect(this.emitter.hasSubscriber('event', this.fn)).to.equal(true);
    this.emitter.off('event', this.fn);
    expect(this.emitter.hasSubscriber('event', this.fn)).to.equal(false);
  });

  it('should tell if a callback is registered for any of the specified events', function() {
    expect(this.emitter.hasSubscriber('event1', this.fn)).to.equal(false);
    expect(this.emitter.hasSubscriber('event2', this.fn)).to.equal(false);
    expect(this.emitter.hasSubscriber('event1 event2', this.fn)).to.equal(false);
    this.emitter.on('event1', this.emptyFn);
    expect(this.emitter.hasSubscriber('event1 event2', this.fn)).to.equal(false);
    this.emitter.on('event2', this.fn);
    expect(this.emitter.hasSubscriber('event1 event2', this.fn)).to.equal(true);
    this.emitter.off('event2', this.fn);
    expect(this.emitter.hasSubscriber('event1 event2', this.fn)).to.equal(false);
  });

  it('should tell if a callback is registered for any events', function() {
    expect(this.emitter.hasSubscriber('event1 event2', this.fn)).to.equal(false);
    expect(this.emitter.hasSubscriber(this.fn)).to.equal(false);
    this.emitter.on('event1', this.emptyFn);
    expect(this.emitter.hasSubscriber(this.fn)).to.equal(false);
    this.emitter.on('event2', this.fn);
    expect(this.emitter.hasSubscriber(this.fn)).to.equal(true);
    this.emitter.off('event2', this.fn);
    expect(this.emitter.hasSubscriber(this.fn)).to.equal(false);
  });

  it('should tell if an emitter has any events/callbacks at all', function() {
    expect(this.emitter.hasSubscriber(this.fn)).to.equal(false);
    expect(this.emitter.hasSubscriber()).to.equal(false);
    this.emitter.on('event1', this.emptyFn);
    expect(this.emitter.hasSubscriber()).to.equal(true);
    this.emitter.on('event2', this.fn);
    expect(this.emitter.hasSubscriber()).to.equal(true);
    this.emitter.off();
    expect(this.emitter.hasSubscriber()).to.equal(false);
  });

  it('should throw error when supplying hasSubscriber() with faulty parameters', function() {
    this.emitter.on('event', this.emptyFn);
    expect(function() {
      this.emitter.hasSubscriber('event', 'string');
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
    expect(object.hasSubscriber('event')).to.equal(true);
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

  it('should throw error when trying to inject events methods to an object which is already an emitter', function() {
    var object = {};

    quasar.make.events.emitter(object);
    expect(function() {
      quasar.make.events.emitter(object);
    }).to.throw(/Object is already an emitter/);
  });

  it('should throw error when trying to tell if object is emitter and supplying faulty params', function() {
    expect(function() {
      quasar.is.events.emitter();
    }).to.throw(/Missing object/);
  });

  it('should be able to register multiple events at once', function() {
    this.emitter.on('event1   event2 ', this.emptyFn);
    expect(this.emitter.hasSubscriber('event1')).to.equal(true);
    expect(this.emitter.hasSubscriber('event2')).to.equal(true);
  });

  it('should be able to remove multiple events at once', function() {
    this.emitter.on(' event1   event2 ', this.emptyFn);
    this.emitter.off('  event2    event1    ');
    expect(this.emitter.hasSubscriber('event1')).to.equal(false);
    expect(this.emitter.hasSubscriber('event2')).to.equal(false);

    var
      times = 0,
      fn = function() {
        times++;
      },
      secondFn = function() {
        times++;
      };

    this.emitter.on('event1 event2', fn);
    this.emitter.on('event1', secondFn);
    this.emitter.trigger('   event1 event2');
    expect(times).to.equal(3);
  });

  it('should be able to trigger multiple events at once', function() {
    this.emitter.on('    event1 event2', this.fn);
    this.emitter.trigger('event2         event1');
    expect(this.times).to.equal(2);
  });

});
