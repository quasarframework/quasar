'use strict';

var cache = require('./cache/ajax-cache');

function isURL(target) {
  return target.indexOf('http') === 0;
}

function processTarget(target, local) {
  if (isURL(target) || local || !quasar.config.requests.baseURL) {
    return target;
  }

  return quasar.config.requests.baseURL + '/' + target;
}


function xhrCall(type, config) {
  config = config || {};

  if (!config.url) {
    throw new Error('Missing URL');
  }

  config.url = processTarget(config.url, config.local);

  config.type = type;
  config.xhrFields = _.merge({
    withCredentials: true
  }, config.xhrFields || {});

  if (quasar.config.requests.failFnHandler) {
    config.error = function() {
      var shouldHaltExecution = quasar.config.requests.failFnHandler.apply(this, arguments);

      if (shouldHaltExecution === true) {
        throw new Error('Halting default failure handlers');
      }
      return true;
    };
  }

  if (type === 'GET') {
    config.dataType = config.dataType || 'json';
  }

  if (config.data && (_.isArray(config.data) || _.isObject(config.data))) {
    config.data = JSON.stringify(config.data);
  }

  return $.ajax(config);
}

function getStore(commonConfig) {
  if (!commonConfig) {
    throw new Error('Missing config');
  }

  if (!commonConfig.url) {
    throw new Error('Missing url from config');
  }

  return {
    make: {
      a: {
        get: {
          request: function(config) {
            config = config || {};
            config = $.extend({}, commonConfig, config);
            return xhrCall('GET', config);
          }
        },
        post: {
          request: function(config) {
            config = config || {};
            config = $.extend({}, commonConfig, config);
            return xhrCall('POST', config);
          }
        },
        put: {
          request: function(config) {
            config = config || {};
            config = $.extend({}, commonConfig, config);
            return xhrCall('PUT', config);
          }
        },
        del: {
          request: function(config) {
            config = config || {};
            config = $.extend({}, commonConfig, config);
            return xhrCall('DELETE', config);
          }
        }
      }
    }
  };
}

function makeRequest(type, config) {
  return xhrCall(type, config);
}

function makeGetRequest(config) {
  return xhrCall('GET', config);
}

function makePostRequest(config) {
  return xhrCall('POST', config);
}

function makePutRequest(config) {
  return xhrCall('PUT', config);
}

function makeDelRequest(config) {
  return xhrCall('DELETE', config);
}

function makeGroupRequest() {
  if (arguments.length === 0) {
    throw new Error('Missing parameters');
  }

  return $.when.apply(null, arguments);
}

_.merge(quasar, {
  config: {
    requests: {
      baseURL: '',
      failFnHandler: null,
      use: {
        cache: true
      }
    }
  },
  get: {
    store: getStore
  },
  make: {
    a: {
      request: makeRequest,
      get: {
        request: makeGetRequest
      },
      post: {
        request: makePostRequest
      },
      put: {
        request: makePutRequest
      },
      del: {
        request: makeDelRequest
      },
      group: {
        request: makeGroupRequest
      }
    }
  },
  abort: {
    all: {
      requests: cache.abortAllRequests
    }
  },
  clear: {
    requests: {
      cache: cache.resetRequestCache
    }
  }
});
