'use strict';

function execute() {
  $(function() {
    quasar.require.script('js/app');
  });
}

_.merge(q, {
  boot: function() {
    /* istanbul ignore if */
    if (quasar.runs.on.cordova) {
      $.getScript('cordova.js', function() {
        document.addEventListener('deviceready', execute, false);
      });
      return; // <<< EARLY EXIT
    }

    execute();
  }
});
