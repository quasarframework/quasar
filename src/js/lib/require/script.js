'use strict';

var
  modulesCache = {},
  states = {
    LOADING: 1,
    READY: 2
  };

// Named "eval" is mandatory for
// executing in the global scope.
var globalEval = eval;

function resolveModule(base, relativePath) {
  var resolved = quasar.get.normalized.path(relativePath + '.js', base);

  if (!modulesCache[resolved]) {
    modulesCache[resolved] = {location: resolved};
  }

  return modulesCache[resolved];
}

function load(module, callback, request) {
  module.state = states.READY;

  if (request && request.status !== 200) {
    module.error = request;
    callback(module.error, module);
    return;
  }

  var requires = {};

  if (!module.text) {
    module.text = request.response;
  }

  module.text.replace(/(?:^|[^\w\$_.])require\s*\(\s*["']([^"']*)["']\s*\)/g, function(_, id) {
    requires[id] = true;
  });

  var deps = Object.keys(requires);
  var count = deps.length;

  if (count === 0) {
    callback(module.error, module);
    return;
  }

  var loaded = function(error) {
    count--;

    if (count === 0) {
      callback(error, module);
    }
  };

  deps.map(function(dependency) {
    deepLoad(
      resolveModule(module.location, dependency),
      loaded
    );
  });
}

function deepLoad(module, callback) {
  if (module.state === states.LOADING) {
    setTimeout(function() {
      deepLoad(module, callback);
    }, 25);
    return;
  }
  else if (module.state === states.READY) {
    quasar.nextTick(function() {
      callback(module.error, module);
    });
    return;
  }

  if (module.text) {
    quasar.nextTick(function() {
      load(module, callback);
    });
    return;
  }

  module.state = states.LOADING;

  var request = new XMLHttpRequest();

  request.onload = function() {
    load(module, callback, request);
  };

  request.open('GET', module.location, true);
  request.send();
}

function getModuleExports(module) {
  if (module.exports) {
    return module.exports;
  }

  var fn;

  if (module.factoryFn) {
    fn = module.factoryFn;
  }
  else {
    fn = globalEval('(function(require,exports,module){' + module.text + '\n})//# sourceURL=' + module.location);
  }

  fn(
    function(id) {
      return getModuleExports(resolveModule(module.location, id));
    }, // require
    module.exports = {}, // exports
    module // module
  );

  return module.exports;
}

function requireScript(resource, callback) {
  var
    module,
    /* eslint-disable */
    deferred = $.Deferred()
    /* eslint-enable */
    ;

  callback = callback || function() {};

  if (_.isFunction(resource)) {
    module = {location: '', text: '' + resource, factoryFn: resource};
  }
  else {
    module = resolveModule('', resource);
  }

  deepLoad(module, function(err) {
    if (err) {
      callback(err);
      deferred.reject(err);
      return;
    }

    if (!module.exports) {
      getModuleExports(module);
    }

    callback(resource.error, module.exports);
    deferred.resolve(module.exports);
  });

  return deferred;
}

function clearRequireCache() {
  modulesCache = {};
}

module.exports = {
  require: requireScript,
  clearCache: clearRequireCache
};
