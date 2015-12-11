
module.exports = function(done) {
  setTimeout(function() {
    done({
      template: require('raw!./layout.main.html'),
      data: {
        text: ''
      },
      ready: function() {
        console.log('Layout main ready');
      },
      destroyed: function() {
        console.log('Layout main destroyed');
      }
    });
  }, 100);
};
