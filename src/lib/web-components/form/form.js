'use strict';

var template = $(require('raw!./form.html'));

Vue.component('quasar-checkbox', {
  template: template.find('#checkbox').html(),
  props: ['model'],
  ready: function() {
    var el = $(this.$el);

    el.getAttributesManager().with('inline', function() {
      el.addClass('inline');
    });
  }
});

Vue.component('quasar-radio', {
  template: template.find('#radio').html(),
  props: ['options', 'model'],
  ready: function() {
    var el = $(this.$el);

    el.getAttributesManager().with('inline', function() {
      el.addClass('layout inline');
    });
  }
});

Vue.component('quasar-switch', {
  template: template.find('#switch').html(),
  props: ['model'],
  ready: function() {
    var el = $(this.$el);

    el.getAttributesManager().with('inline', function() {
      el.addClass('layout inline');
    });
  }
});


function modelToPosition(model, min, max, size) {
  return (model - min) / (max - min) * size;
}

Vue.component('quasar-range', {
  template: template.find('#range').html(),
  props: ['model', 'min', 'max', 'precision'],
  data: function() {
    return {
      position: 0,
      tooltip: ''
    };
  },
  methods: {
    pan: function(event) {
      var
        size = this.el.width() - 21,
        range = this.max - this.min,
        value = (this.model - this.min) / range,
        percentage = Math.min(1, Math.max(0, value + event.deltaX / size)),
        newValue = (this.min + percentage * range).toFixed(this.precision)
        ;

      this.position = percentage * size;
      this.tooltip = newValue;

      if (event.isFinal) {
        this.model = newValue;
        this.tooltip = '';
      }
    }
  },
  watch: {
    model: function(value) {
      this.position = modelToPosition(value, this.min, this.max, this.el.width() - 21);
    },
    min: function(value) {
      if (this.model < value) {
        this.model = value;
        return;
      }
      this.position = modelToPosition(this.model, value, this.max, this.el.width() - 21);
    },
    max: function(value) {
      if (this.model > value) {
        this.model = value;
        return;
      }
      this.position = modelToPosition(this.model, this.min, value, this.el.width() - 21);
    }
  },
  ready: function() {
    this.el = $(this.$el);

    this.gc = {
      update: function() {
        this.position = modelToPosition(this.model, this.min, this.max, this.el.width() - 21);
      }.bind(this)
    };

    $(window).resize(this.gc.update);
    this.gc.update();
  },
  destroy: function() {
    $(window).off('resize', this.gc.update);
  }
});


Vue.component('quasar-text', {
  template: '<input class="quasar-text layout items-center" v-model="model" type="text">',
  props: ['model'],
  ready: function() {
    var el = $(this.$el);

    el.getAttributesManager().with('inline', function() {
      el.addClass('inline');
    });
  }
});
