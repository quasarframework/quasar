'use strict';

var
  notifyNode = $('<div id="__quasar_notifiers">'),
  dismissers = [],
  types = [
    {
      name: 'success',
      defaults: {icon: 'check'}
    },
    {
      name: 'error',
      defaults: {icon: 'whatshot'}
    },
    {
      name: 'info',
      defaults: {icon: 'info'}
    },
    {
      name: 'warning',
      defaults: {icon: 'warning'}
    }
  ];

$('body').append(notifyNode);


function dismissAll() {
  _.forEach(dismissers, function(dismiss) {
    dismiss();
  });
}

function Notify(options) {
  var dismiss = function() {
    this.dismiss();
  }.bind(this);

  _.merge(
    this,
    {
      timeout: 7000,
      onDismiss: $.noop,
      dismissable: true,
      vue: {
        methods: {
          ____pan: function(event) {
            var
              el = $(this.$el),
              delta = event.deltaX,
              opacity = .9 - Math.abs(delta) / 180
              ;

            el.velocity('stop');

            if (opacity < .05) {
              el.css('opacity', '0');
              dismiss();
              return;
            }

            if (event.isFinal) {
              el.velocity({
                translateX: [0, delta],
                opacity: .9
              });
              return;
            }

            el.css({
              transform: 'translateX(' + delta + 'px)',
              opacity: opacity
            });
          }
        }
      }
    },
    options
  );

  this.node = $('<div class="quasar-notifier layout items-center wrap non-selectable z-4" v-touch:pan="____pan">');

  this.node.append(
    (this.icon ? '<quasar-icon>' + this.icon + '</quasar-icon> ' : '') +
    '<div class="layout flex">' + this.html + '</div>'
  );

  if (this.button) {
    var button = $('<a>' + this.button.label + '</a>');

    this.node.append(button);
    button.click(function() {
      this.dismiss();
      if (_.isFunction(this.button.fn)) {
        this.button.fn();
      }
    }.bind(this));
  }

  $('<a class="quasar-notifier-dismiss-all"><quasar-icon>delete</quasar-icon></a>')
    .click(dismissAll)
    .appendTo(this.node);

  if (this.dismissable && !quasar.runs.with.touch && quasar.runs.on.desktop) {
    this.node.css('cursor', 'pointer');
    this.node.click(function() {this.dismiss();}.bind(this));
  }

  if (this.timeout > 0) {
    this.timer = setTimeout(function() {
      this.dismiss();
    }.bind(this), this.timeout);
  }

  this.vm.el = this.node[0];
  this.vm = new Vue(this.vm);

  this.node.css('display', 'none').appendTo(notifyNode).slideToggle();
  notifyNode.append('<div style="clear: both;">');

  if (dismissers.length > 5) {
    dismissers.shift()();
  }
  dismissers.push(this.dismiss.bind(this));

  return {
    node: this.node,
    dismiss: this.dismiss.bind(this),
    vm: this.vm
  };
}

Notify.prototype.dismiss = function() {
  if (this.dismissed) {
    return;
  }

  if (this.timer) {
    clearTimeout(this.timer);
  }

  this.node.slideToggle(200, function() {
    this.node.next().remove();
    this.vue.$destroy(true);
    this.onDismiss();
  }.bind(this));

  this.dismissed = true;

  dismissers = _.without(dismissers, this.dismiss);
};


function notify(options, defaults) {
  if (!options) {
    throw new Error('Missing notify options.');
  }

  if (_.isString(options)) {
    options = {html: options};
  }

  _.merge(options, defaults);

  if (!options.html) {
    throw new Error('Missing notify content/HTML.');
  }

  return new Notify(options);
}


q.notify = notify;
_.forEach(types, function(type) {
  q.notify[type.name] = function(opts) {
    notify(opts, type.defaults);
  };
});
