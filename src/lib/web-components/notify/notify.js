'use strict';

var
  notifyNode = $('<div id="__quasar_notifiers" class="column">'),
  dismissers = [],
  types = [
    {
      name: 'positive',
      defaults: {icon: 'check'}
    },
    {
      name: 'negative',
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
  dismissers.forEach(function(dismiss) {
    dismiss();
  });
}

function Notify(options) {
  var dismiss = function() {
    this.dismiss();
  }.bind(this);

  $.extend(true,
    this,
    {
      timeout: 7000,
      onDismiss: $.noop,
      vm: {
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

  this.node = $('<div class="quasar-notifier row items-center justify-between nowrap non-selectable" v-touch:pan="____pan">');

  this.node.append(
    (this.icon ? '<i>' + this.icon + '</i> ' : '') +
    (this.image ? '<img src="' + this.image + '">' : '') +
    '<div class="auto">' + this.html + '</div>'
  );

  if (this.button) {
    var button = $('<a>' + this.button.label + '</a>');

    this.node.append(button);
    button.click(function() {
      this.dismiss();
      if (typeof this.button.fn === 'function') {
        this.button.fn();
      }
    }.bind(this));
  }

  $('<a class="quasar-notifier-dismiss-all"><i>delete</i></a>')
    .click(dismissAll)
    .appendTo(this.node);

  if (this.timeout > 0) {
    this.timer = setTimeout(function() {
      this.dismiss();
    }.bind(this), this.timeout);
  }

  this.vm.el = this.node[0];
  this.vm = new Vue(this.vm);

  quasar.events.trigger('app:notify', this.html);
  this.node.css('display', 'none').appendTo(notifyNode).slideToggle();

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
    this.vm.$destroy(true);
    this.onDismiss();
  }.bind(this));

  this.dismissed = true;

  dismissers = dismissers.filter(function(item) {
    return item !== this.dismiss;
  }.bind(this));
};


function notify(options, defaults) {
  if (!options) {
    throw new Error('Missing notify options.');
  }

  if (typeof options === 'string') {
    options = {html: options};
  }

  $.extend(true, options, defaults);

  if (!options.html) {
    throw new Error('Missing notify content/HTML.');
  }

  return new Notify(options);
}


quasar.notify = notify;
types.forEach(function(type) {
  quasar.notify[type.name] = function(opts) {
    notify(opts, type.defaults);
  };
});
