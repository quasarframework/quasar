'use strict';

require('../events/events');

var __routes = [];

function getAllRoutes() {
  return _.clone(__routes, true);
}

function stopRouter() {
  removeAllRoutes();
  window.onhashchange = null;
  quasar.global.events.trigger('app:router:stopped');
}

function routerIsRunning() {
  return window.onhashchange !== null;
}

function hasRoute(hash) {
  if (!hash) {
    throw new Error('Missing hash');
  }

  return _.some(__routes, function(route) {
    return route.hash === hash;
  });
}

function addRoute(route) {
  if (!route) {
    throw new Error('Missing route');
  }
  if (!route.hash) {
    throw new Error('Route has no hash');
  }
  if (!route.trigger) {
    throw new Error('Missing route trigger method');
  }
  if (hasRoute(route.hash)) {
    throw new Error('Route already registered. Use overwrite.');
  }

  __routes.push(route);
}

function getRoute(hash) {
  if (!hash) {
    throw new Error('Missing hash');
  }
  return _.find(__routes, {hash: hash});
}

function removeAllRoutes() {
  __routes = [];
}

function removeRoute(hash) {
  if (!hash) {
    throw new Error('Missing hash');
  }

  __routes = _.filter(__routes, function(route) {
    return route.hash !== hash;
  });
}

function overwriteRoute(route) {
  if (!route) {
    throw new Error('Missing route');
  }
  if (!route.hash) {
    throw new Error('Route has no hash');
  }
  if (!hasRoute(route.hash)) {
    throw new Error('Route not registered');
  }

  _.remove(__routes, {hash: route.hash});
  addRoute(route);
}

function navigateToRoute(hash) {
  if (!hash) {
    throw new Error('Hash missing');
  }
  if (!_(hash).startsWith('#')) {
    throw new Error('Route should start with #');
  }

  window.location.hash = hash;
}

function getArrayFromHash(hash) {
  var tokens = hash.split('/');

  tokens.shift();
  return tokens;
}

function getCleanHash(hash) {
  var result = {};
  var hashIndexOfQuery = hash.indexOf('?');

  result.hash = hash;
  result.hashParams = hashIndexOfQuery >= 0 ? hash.substring(0, hashIndexOfQuery) : hash;
  result.hashQuery = hashIndexOfQuery >= 0 ? hash.substring(hash.indexOf('?') + 1) : '';
  result.hashQueryArray = result.hashQuery ? result.hashQuery.split('&') : [];

  var cleanedHashParams = result.hashParams.replace(/\/+$/, '');

  if (result.hashParams !== cleanedHashParams) {
    result.hash = cleanedHashParams;
    result.hash += result.hashQuery ? '?' + result.hashQuery : '';
  }

  return result;
}

function matchHash(hash) {
  var hashParts = getCleanHash(hash);
  var testerSlices = hashParts.hashParams.split('/');
  var tester = hashParts.hashParams;
  var params = {};
  var query = {};

  // parse querystring
  if (hashParts.hashQueryArray.length > 0) {
    for (var q = 0; q < hashParts.hashQueryArray.length; q++) {
      var keyValue = hashParts.hashQueryArray[q].split('=');

      query[keyValue[0]] = keyValue[1] ? decodeURIComponent(keyValue[1]) : '';
    }
  }

  // parse hash parameters
  for (var i = 0; i < __routes.length; i++) {
    var route = __routes[i];

    // dynamic parts
    if (route.hash.search(/:/) > 0) {
      var routeSlices = route.hash.split('/');

      tester = hashParts.hashParams;

      for (var x = 0; x < routeSlices.length; x++) {
        if (x < testerSlices.length && routeSlices[x].charAt(0) === ':') {
          params[routeSlices[x].replace(/:/, '')] = testerSlices[x];
          tester = tester.replace(testerSlices[x], routeSlices[x]);
        }
      }
    }
    if (route.hash === tester) {
      route.params = params;
      route.url = hash;
      route.query = query;
      return route;
    }
  }

  return null;
}

function triggerRoute(hash) {
  if (!hash || hash === '' || hash === '#') {
    hash = '#/';
  }

  quasar.global.events.trigger('app:route:change', hash);

  var route = matchHash(hash);

  if (!route) {
    quasar.global.events.trigger('app:route:notfound', getArrayFromHash(hash));
    return;
  }

  quasar.global.events.trigger('app:route:trigger', route);
  route.trigger.apply(route);
}

function bindHashChange() {
  var lastHash = '';

  window.onhashchange = function() {
    var hash = window.location.hash;

    if (hash !== lastHash) {
      lastHash = hash;
      triggerRoute(hash);
    }
  };
}

function startRouter() {
  quasar.global.events.trigger('app:router:started');
  bindHashChange();
  triggerRoute(window.location.hash);
}

function getCurrentRoute() {
  return window.location.hash;
}

function reloadCurrentRoute() {
  triggerRoute(getCurrentRoute());
}

_.merge(q, {
  get: {
    all: {
      routes: getAllRoutes
    },
    route: getRoute,
    current: {
      route: getCurrentRoute
    }
  },
  add: {
    route: addRoute
  },
  has: {
    route: hasRoute
  },
  router: {
    is: {
      running: routerIsRunning
    }
  },
  remove: {
    all: {
      routes: removeAllRoutes
    },
    route: removeRoute
  },
  overwrite: {
    route: overwriteRoute
  },
  navigate: {
    to: {
      route: navigateToRoute
    }
  },
  start: {
    router: startRouter
  },
  stop: {
    router: stopRouter
  },
  reload: {
    current: {
      route: reloadCurrentRoute
    }
  }
});
