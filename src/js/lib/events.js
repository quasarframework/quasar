'use strict';

function parseEventNames(eventNames) {
  return _.trim(eventNames).replace(/\s\s+/g, ' ').split(' ');
}

function remove(events, eventName, item) {
  events[eventName] = _.without(events[eventName], item);
  if (_.isEmpty(events[eventName])) {
    delete events[eventName];
  }
}

function on(eventNames, callback, context, once) {
  if (!eventNames) {
    throw new Error('Missing event(s) name(s)');
  }
  if (!callback) {
    throw new Error('Missing callback');
  }
  if (!_.isFunction(callback)) {
    throw new Error('Callback is not a function');
  }

  _.forEach(parseEventNames(eventNames), function(eventName) {
    if (!this.events.hasOwnProperty(eventName)) {
      this.events[eventName] = [];
    }

    if (_.some(this.events[eventName], function(item) {
      return item.cb === callback;
    })) {
      // Event name already has specified callback
      return;
    }

    this.events[eventName].push({
      cb: callback,
      context: context,
      once: once
    });
  }.bind(this));
}

function off(eventNames, callback) {
  if (!eventNames) {
    this.events = {};
    return;
  }

  if (callback && !_.isFunction(callback)) {
    throw new Error('Callback is not a function');
  }

  _.forEach(parseEventNames(eventNames), function(eventName) {
    if (!this.events.hasOwnProperty(eventName)) {
      // Unregistered event name
      return;
    }

    if (!callback) {
      delete this.events[eventName];
      return;
    }

    var item = _.find(this.events[eventName], function(item) {
      return item.cb === callback;
    });

    if (!item) {
      // Event is not registered with specified callback
      return;
    }

    remove(this.events, eventName, item);
  }.bind(this));
}

function once(eventNames, callback, context) {
  on.call(this, eventNames, callback, context, true);
}

function trigger(eventNames) {
  if (!eventNames) {
    eventNames = getEventsList.call(this).join(' ');
  }

  var args = Array.prototype.slice.call(arguments, 1);

  _.forEach(parseEventNames(eventNames), function(eventName) {
    if (!this.events.hasOwnProperty(eventName)) {
      // Nothing to trigger
      return;
    }

    var onceList = [];

    _.forEach(this.events[eventName], function(item) {
      item.cb.apply(item.context, args);
      if (item.once) {
        onceList.push(item);
      }
    });

    _.forEach(onceList, function(item) {
      remove(this.events, eventName, item);
    }.bind(this));
  }.bind(this));
}

function hasSubscriber(eventNames, callback) {
  if (!eventNames) {
    return !_.isEmpty(this.events);
  }

  if (_.isFunction(eventNames)) {
    callback = eventNames;
    eventNames = getEventsList.call(this).join(' ');
  }

  if (callback && !_.isFunction(callback)) {
    throw new Error('Callback is not a function');
  }

  var foundSubscriber = false;

  _.forEach(parseEventNames(eventNames), function(eventName) {
    var result = this.events.hasOwnProperty(eventName);

    if (!result) {
      return;
    }

    if (callback) {
      result = _.some(this.events[eventName], function(item) {
        return item.cb === callback;
      });

      if (result) {
        foundSubscriber = true;
      }
      return;
    }

    foundSubscriber = true;
  }.bind(this));

  return foundSubscriber;
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

    hasSubscriber: hasSubscriber.bind(props),
    getEventsList: getEventsList.bind(props)
  };
}

function makeEventsEmitter(object) {
  if (!_.isObject(object)) {
    throw new Error('Missing object');
  }

  if (isEventsEmitter(object)) {
    throw new Error('Object is already an emitter');
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
    _.isFunction(object.hasSubscriber) &&
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
