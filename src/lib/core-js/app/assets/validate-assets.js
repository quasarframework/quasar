'use strict';

/* istanbul ignore next */
module.exports.layout = function(layoutVue) {
  var tpl = layoutVue.template;

  if (!tpl) {
    throw new Error('Layout with no template. It defeats its purpose.');
  }

  if (tpl.indexOf('quasar-page') === -1) {
    throw new Error('Layout must contain <quasar-page> tag.');
  }
};
