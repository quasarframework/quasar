'use strict';

var localCache = {
  __data: {},
  __itemTimeout: 30 * 60 * 1000, // milliseconds

  remove: function(cacheId) {
    delete this.__data[cacheId];
  },
  has: function(cacheId) {
    return this.__data.hasOwnProperty(cacheId) &&
      new Date().getTime() - this.__data[cacheId].time < this.__itemTimeout;
  },
  get: function(cacheId) {
    return $.extend(true, {}, this.__data[cacheId]);
  },
  set: function(cacheId, cachedData, statusCode, statusText) {
    this.remove(cacheId);
    this.__data[cacheId] = {
      data: cachedData,
      time: new Date().getTime(),
      statusCode: statusCode,
      statusText: statusText
    };
  },
  empty: function() {
    this.__data = {};
  }
};

var requestsInProgress = {
  __data: {},

  has: function(cacheId) {
    return this.__data.hasOwnProperty(cacheId);
  },
  get: function(cacheId) {
    return this.__data[cacheId];
  },
  set: function(cacheId, jqXHR) {
    if (this.has(cacheId)) {
      this.get(cacheId).abort();
    }
    this.__data[cacheId] = jqXHR;

    var self = this;

    jqXHR.promise().always(function() {
      self.remove(cacheId);
    });
  },
  remove: function(cacheId) {
    delete this.__data[cacheId];
  },
  abortAll: function() {
    // first of all, abort all requests in progress
    Object.keys(this.__data).forEach(function(request) {
      this.__data[request].abort();
    }.bind(this));

    this.__data = {};
  }
};

function log(action, options) {
  console.log(
    '[xhr:' + action + ']',
    (options.type !== 'GET' ? options.type + ' ' : '') + options.url,
    options.data ? options.data : ''
  );
}

$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
  // cache must work only for some of the HTTP verbs
  if (!['GET', 'HEAD'].includes(options.type)) {
    jqXHR.promise().done(function() {
      log('done', options);
    });
    return; // <<<<---- EARLY EXIT
  }

  var cacheId = originalOptions.url;

  if (!options.persistent) {
    requestsInProgress.set(options.requestName || cacheId, jqXHR);
  }

  if (!quasar.config.requests.use.cache || options.hasOwnProperty('cachable') && !options.cachable) {
    jqXHR.promise().done(function() {
      log('done', options);
    });
    return; // <<<<---- EARLY EXIT
  }

  var originalBeforeSend = options.beforeSend || function() {
    return true;
  };

  options.beforeSend = function() {
    if (!localCache.has(cacheId)) {
      jqXHR.promise().done(function(data, textStatus, jqXHR) {
        localCache.set(cacheId, data, jqXHR.status, jqXHR.statusText);
        log('to-cache', options);
      });
    }
    return originalBeforeSend();
  };
});

$.ajaxTransport('+*', function(options, originalOptions, jqXHR, headers, completeCallback) {
  // cache must work only for some of the HTTP verbs
  if (!['GET', 'HEAD'].includes(options.type)) {
    log('start', options);
    return; // <<<<---- EARLY EXIT; abort Ajax hijack
  }

  if (!quasar.config.requests.use.cache || options.hasOwnProperty('cachable') && !options.cachable) {
    log('start', options);
    return; // <<<<---- EARLY EXIT; abort Ajax hijack
  }

  var cacheId = originalOptions.url;

  if (!localCache.has(cacheId)) {
    log('start', options);
    return; // <<<<---- EARLY EXIT; abort Ajax hijack
  }

  return {
    send: function(headers, completeCallback) {
      var cache = localCache.get(cacheId);

      log('from-cache', options);
      completeCallback(cache.statusCode, cache.statusText, {
        json: cache.data
      });
    }
  };
});


module.exports = {
  resetRequestCache: function() {
    localCache.empty();
  },
  abortAllRequests: function() {
    requestsInProgress.abortAll();
  }
};
