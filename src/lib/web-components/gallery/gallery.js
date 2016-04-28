'use strict';

var
  galleryTemplate = require('raw!./gallery.html'),
  gallerySliderTemplate = require('raw!./gallery-slider.html')
  ;

Vue.component('gallery', {
  template: galleryTemplate,
  props: {
    src: {
      type: Array,
      required: true
    },
    width: {
      type: String,
      default: '150px'
    }
  }
});

Vue.component('gallery-slider', {
  template: gallerySliderTemplate,
  props: {
    src: {
      type: Array,
      required: true
    }
  },
  data: function() {
    return {
      quickView: false
    };
  },
  methods: {
    toggleQuickView: function() {
      this.quickView = !this.quickView;
    },
    selectImage: function(index) {
      this.$refs.slider.goToSlide(index, true);
      this.toggleQuickView();
    }
  }
});
