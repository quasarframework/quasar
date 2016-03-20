'use strict';

module.exports = {
  template: require('raw!./view.typography.html'),
  data: {
    msg: 'aaa'
  },
  methods: {
    myalert: function() {
      alert('aaa');
    },
    tapped: function() {
      alert('tapped');
    },
    panned: function(args) {
      console.log('panned', args.deltaX, args.deltaY);
    },
    writeVisibilityState: function(state) {
      $(this.$el).find('#visibility').append('App became ' + state + '.<br>');
    }
  },
  ready: function() {
    quasar.add.fab({
      icon: 'mail',
      class: 'secondary',
      fn: function() {
        quasar.dialog({html: 'You tapped on a FAB.', title: 'Good Job', buttons: [{label: 'OK', dismiss: true}]});
      }
    });

    quasar.events.on('app:visibility', this.writeVisibilityState);
  },
  destroyed: function() {
    quasar.events.off('app:visibility', this.writeVisibilityState);
  }
};
