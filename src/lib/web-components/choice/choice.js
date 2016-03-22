'use strict';

var template = require('raw!./choice.html');

Vue.component('choice', {
  template: template,
  props: {
    model: {
      required: true
    },
    options: {
      type: Array,
      required: true,
      validator: function(options) {
        return !options.some(function(option) {
          return typeof option.label === 'undefined' || typeof option.value === 'undefined';
        });
      }
    },
    multiple: {
      type: Boolean,
      coerce: function(value) {
        return value ? true : false;
      }
    },
    okLabel: {
      type: String,
      default: 'OK'
    },
    cancelLabel: {
      type: String,
      default: 'Cancel'
    },
    title: {
      type: String,
      default: 'Select'
    },
    message: {
      type: String
    }
  },
  computed: {
    label: function() {
      return this.multiple ? this.getMultipleLabel() : this.getSingleLabel();
    }
  },
  methods: {
    getSingleLabel: function() {
      var model = this.model;

      var option = this.options.find(function(option) {
        return option.value === model;
      });

      return option ? option.label : 'Select';
    },
    getMultipleLabel: function() {
      var model = this.model;

      var options = this.options.filter(function(option) {
        return model.includes(option.value);
      }).map(function(option) {
        return option.label;
      });

      if (options.length === 0) {
        return 'Select';
      }
      else if (options.length > 1) {
        return options[0] + ', ...';
      }
      return options[0];
    },
    mapSingle: function(option) {
      option.selected = option.value === this.model;
      return option;
    },
    mapMultiple: function(option) {
      option.checked = this.model.includes(option.value);
      return option;
    },
    pick: function() {
      var
        self = this,
        mapHandler = this.multiple ? this.mapMultiple : this.mapSingle,
        options = this.options.map(mapHandler.bind(this))
        ;

      var config = {
        title: self.title,
        message: self.message,
        buttons: [
          self.cancelLabel,
          {
            label: self.okLabel,
            handler: function(data) {
              self.model = data;
            }
          }
        ]
      };

      config[this.multiple ? 'checkboxes' : 'radios'] = options;

      quasar.dialog(config);
    }
  }
});
