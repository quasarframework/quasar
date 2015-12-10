'use strict';

var
  __routes = [],
  __onRouteChange = null,
  __onRouteNotFound = null;

function getAllRoutes() {
  return _.clone(__routes, true);
}

function destroyRouter() {
  removeAllRoutes();
  window.onhashchange = null;
  __onRouteChange = null;
  __onRouteNotFound = null;
}

function routerIsRunning() {
  return window.onhashchange !== null;
}

function hasRoute(path) {
  if (!path) {
    throw new Error('Missing path');
  }

  return _.some(__routes, function(route) {
    return route.path === path;
  });
}

function addRoute(route) {
  if (!route) {
    throw new Error('Missing route');
  }
  if (!route.path) {
    throw new Error('Route has no path');
  }
  if (!route.before && !route.on && !route.after) {
    throw new Error('Missing route methods');
  }
  if (hasRoute(route.path)) {
    throw new Error('Route already registered. Use overwrite.');
  }

  __routes.push(route);
}

function getRoute(path) {
  if (!path) {
    throw new Error('Missing path');
  }
  return _.find(__routes, {path: path});
}

function removeAllRoutes() {
  __routes = [];
}

function removeRoute(path) {
  if (!path) {
    throw new Error('Missing path');
  }

  __routes = _.filter(__routes, function(route) {
    return route.path !== path;
  });
}

function overwriteRoute(route) {
  if (!route) {
    throw new Error('Missing route');
  }
  if (!route.path) {
    throw new Error('Route has no path');
  }
  if (!hasRoute(route.path)) {
    throw new Error('Route not registered');
  }

  _.remove(__routes, {path: route.path});
  addRoute(route);
}

function navigateToRoute(path) {
  if (!path) {
    throw new Error('Path missing');
  }
  if (!_(path).startsWith('#')) {
    throw new Error('Route should start with #');
  }

  window.location.hash = path;
}

function getArrayFromPath(path) {
  var tokens = path.split('/');

  tokens.shift();
  return tokens;
}

function getCleanPath(path) {
  var result = {};
  var hashIndexOfQuery = path.indexOf('?');

  result.path = path;
  result.hashParams = hashIndexOfQuery >= 0 ? path.substring(0, hashIndexOfQuery) : path;
  result.hashQuery = hashIndexOfQuery >= 0 ? path.substring(path.indexOf('?') + 1) : '';
  result.hashQueryArray = result.hashQuery ? result.hashQuery.split('&') : [];

  var cleanedHashParams = result.hashParams.replace(/\/+$/, '');

  if (result.hashParams !== cleanedHashParams) {
    result.path = cleanedHashParams;
    result.path += result.hashQuery ? '?' + result.hashQuery : '';
  }

  return result;
}

function matchPath(path) {
  var hashParts = getCleanPath(path);
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
    if (route.path.search(/:/) > 0) {
      var routeSlices = route.path.split('/');

      tester = hashParts.hashParams;

      for (var x = 0; x < routeSlices.length; x++) {
        if (x < testerSlices.length && routeSlices[x].charAt(0) === ':') {
          params[routeSlices[x].replace(/:/, '')] = testerSlices[x];
          tester = tester.replace(testerSlices[x], routeSlices[x]);
        }
      }
    }
    if (route.path === tester) {
      route.params = params;
      route.url = path;
      route.query = query;
      return route;
    }
  }

  return null;
}

function getNextRouteStep(state) {
  if (state === 'before') {
    return 'on';
  }
  if (state === 'on') {
    return 'after';
  }

  return null;
}

function executeRouteStep(route, state, previousArgs) {
  var nextState = getNextRouteStep(state);

  if (!route.hasOwnProperty(state)) {
    executeRouteStep(route, nextState);
    return;
  }

  route.state = state;
  route.next = function() {
    if (nextState) {
      executeRouteStep(route, nextState, Array.prototype.slice.call(arguments));
    }
  };

  route[state].apply(route, previousArgs);
}

function runRoute(route) {
  if (__onRouteChange) {
    __onRouteChange(route);
  }
  executeRouteStep(route, 'before');
}

function triggerRoute(path) {
  if (!path || path === '' || path === '#') {
    path = '#/';
  }

  var route = matchPath(path);

  if (!route) {
    if (!__onRouteNotFound) {
      console.log('No valid route for', path);
    }
    else {
      __onRouteNotFound(getArrayFromPath(path));
    }

    return;
  }

  runRoute(route);
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

function startRouter(config) {
  config = config || {};

  __onRouteChange = config.onRouteChange;
  __onRouteNotFound = config.onRouteNotFound;

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
  stop: {
    router: destroyRouter
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
  reload: {
    current: {
      route: reloadCurrentRoute
    }
  }
});
