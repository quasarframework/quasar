
module.exports = {
  template: require('raw!./layout.main.html'),
  methods: {
    alertMe: function(n) {
      alert('message ' + n);
    }
  }
};
