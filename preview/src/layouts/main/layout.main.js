
var html = require('raw!./layout.main.html');

module.exports = {
  template: html,
  data: {
    pages: Object.keys(quasar.data.manifest.pages)
  },
  methods: {
    swapTheme: function() {
      quasar.swap.theme();
    }
  }
};
