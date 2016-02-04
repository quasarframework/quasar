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
    this.tooltip = this.model;

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



var inputVM = {
  props: {
    model: {},
    debounce: Number
  },
  beforeCompile: function() {
    var el = $(this.$el);

    el.getAttributesManager()
    .with('inline', function() {
      el.addClass('inline');
    })
    .with('lazy', function() {
      el.find('> .quasar-input-field').attr('lazy', '');
    });
  }
};

Vue.component('quasar-number', Vue.extend({
  mixins: [inputVM],
  template: template.find('#number').html(),
  props: {
    model: {
      type: Number,
      default: 0,
      coerce: function(value) {
        return parseFloat(value, 10);
      }
    },
    step: {
      type: Number,
      default: 1,
      coerce: function(value) {
        return parseFloat(value, 10);
      }
    },
    min: Number,
    max: Number
  },
  watch: {
    model: function(value) {
      if (_.isNumber(this.min) && value < this.min) {
        this.model = this.min;
      }
      else if (_.isNumber(this.max) && value > this.max) {
        this.model = this.max;
      }
    }
  },
  methods: {
    increment: function(step) {
      this.model += step;
    }
  }
}));
