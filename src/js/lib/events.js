'use strict';

function on(eventName, callback, context, once) {
  if (!eventName) {
    throw new Error('Missing event name');
  }
  if (!callback) {
    throw new Error('Missing callback');
  }
  if (!_.isFunction(callback)) {
    throw new Error('Callback is not a function');
  }

  if (!this.events.hasOwnProperty(eventName)) {
    this.events[eventName] = [];
  }

  if (_.some(this.events[eventName], function(item) {
    return item.cb === callback;
  })) {
    throw new Error('Event name already has specified callback');
  }

  this.events[eventName].push({
    cb: callback,
    context: context,
    once: once
  });
}

function off(eventName, callback) {
  if (!eventName) {
    throw new Error('Missing event name');
  }

  if (!this.events.hasOwnProperty(eventName)) {
    throw new Error('Unregistered event name');
  }

  if (!callback) {
    delete this.events[eventName];
    return;
  }

  if (!_.isFunction(callback)) {
    throw new Error('Callback is not a function');
  }

  var item = _.find(this.events[eventName], function(item) {
    return item.cb === callback;
  });

  if (!item) {
    throw new Error('Event is not registered with specified callback');
  }

  this.events[eventName] = _.without(this.events[eventName], item);
}

function once(eventName, callback, context) {
  return on.call(this, eventName, callback, context, true);
}

function trigger(eventName) {
  if (!eventName) {
    throw new Error('Missing event name');
  }

  if (!this.events.hasOwnProperty(eventName)) {
    // Nothing to trigger
    return;
  }

  var args = Array.prototype.slice.call(arguments, 1);
  var onceList = [];

  _.forEach(this.events[eventName], function(item) {
    item.cb.apply(item.context, args);
    if (item.once) {
      onceList.push(item);
    }
  });

  _.forEach(onceList, function(item) {
    this.events[eventName] = _.without(this.events[eventName], item);
  }.bind(this));
}

function hasEvent(eventName, callback) {
  if (!eventName) {
    throw new Error('Missing event name');
  }

  var result = this.events.hasOwnProperty(eventName);

  if (!result) {
    return false;
  }

  if (callback) {
    if (!_.isFunction(callback)) {
      throw new Error('Callback is not a function');
    }

    return _.some(this.events[eventName], function(item) {
      return item.cb === callback;
    });
  }

  return true;
}

function getEventsList() {
  return _.keys(this.events);
}

function createEventsEmitter() {
  var props = {
    events: {}
  };

  return {
    on: on.bind(props),
    off: off.bind(props),
    once: once.bind(props),
    trigger: trigger.bind(props),

    hasEvent: hasEvent.bind(props),
    getEventsList: getEventsList.bind(props)
  };
}

function makeEventsEmitter(object) {
  if (!_.isObject(object)) {
    throw new Error('Missing object');
  }

  _.merge(object, createEventsEmitter());
}

function isEventsEmitter(object) {
  if (!_.isObject(object)) {
    throw new Error('Missing object');
  }

  return _.isFunction(object.on) &&
    _.isFunction(object.off) &&
    _.isFunction(object.once) &&
    _.isFunction(object.trigger) &&
    _.isFunction(object.hasEvent) &&
    _.isFunction(object.getEventsList);
}

module.exports = {
  create: {
    events: {
      emitter: createEventsEmitter
    }
  },
  make: {
    events: {
      emitter: makeEventsEmitter
    }
  },
  is: {
    events: {
      emitter: isEventsEmitter
    }
  }
};
