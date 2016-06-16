'use strict';

var
  vm,
  body = $('body'),
  node = $(require('raw!./global-progress.html')),
  appIsInProgress = false,
  timeout
  ;

function isInProgress() {
  return appIsInProgress;
}

function showProgress(options) {
  if (appIsInProgress) {
    return;
  }

  options = options || {};

  timeout = setTimeout(function() {
    body.addClass('dimmed');
    body.append(node);

    vm = new Vue({
      el: node[0],
      data: {
        spinner: options.spinner || 'tail'
      }
    });

    timeout = null;
  }, options.delay || 300);

  appIsInProgress = true;
  quasar.events.trigger('app:global-progress', true);
}

function hideProgress() {
  if (!appIsInProgress) {
    return;
  }

  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  else {
    body.removeClass('dimmed');
    vm.$destroy(true);
  }

  appIsInProgress = false;
  quasar.events.trigger('app:global-progress', false);
}

$.extend(true, quasar, {
  is: {
    in: {
      global: {
        progress: isInProgress
      }
    }
  },
  show: {
    global: {
      progress: showProgress
    }
  },
  hide: {
    global: {
      progress: hideProgress
    }
  }
});
