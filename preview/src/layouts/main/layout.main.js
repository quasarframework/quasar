
module.exports = {
  template: require('raw!./layout.main.html'),
  methods: {
    alertMe: function(n) {
      alert('message ' + n);
    },
    openSettings: function() {
      quasar.notify('This should have opened Settings');
    }
  }
};
