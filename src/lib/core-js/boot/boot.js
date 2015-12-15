'use strict';

function execute() {
  $(function() {
    q.require.script('js/app');
  });
}

_.merge(q, {
  boot: function() {
    /* istanbul ignore if */
    if (q.runs.on.cordova) {
      $.getScript('cordova.js', function() {
        document.addEventListener('deviceready', execute, false);
      });
      return; // <<< EARLY EXIT
    }

    execute();
  }
});
