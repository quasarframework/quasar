'use strict';

Vue.component('quasar-toolbar', {
  template: '<div class="quasar-toolbar layout vertical"><slot></slot></div>',
  ready: function() {
    var
      header = $(this.$el),
      page = header.parent('.quasar-page, quasar-page'),
      content = page.find('.quasar-content, quasar-content'),
      footer = page.find('.quasar-footer, quasar-footer'),
      manager = header.getAttributesManager()
      ;

    if (footer.length > 0 && !manager.hasEmpty('keep')) {
      content.css('padding-bottom', footer.height() + 20 + 'px');
    }

    manager.withEmpty('scroll-shadow', function() {
      var target = manager.hasEmpty('retract') || manager.hasEmpty('shrink') ? $(window) : content;

      target.scroll(function() {
        var shouldHaveShadow = target.scrollTop() > 0;

        header[shouldHaveShadow ? 'addClass' : 'removeClass']('shadow');
      });
    });

    manager.withEmpty('keep', function() {
      page.addClass('fixed-top layout vertical window-height');

      content.addClass('scroll flex');
      footer.removeClass('fixed-bottom');
    });

    manager.withEmpty('shrink', function() {
      header.addClass('fixed-top').css('z-index', 1);
      content.css('padding-top', header.height() + 20 + 'px');

      var headerHeight = header.height();

      $(window).scroll(function() {
        var
          offset = $(window).scrollTop(),
          translate = Math.min(headerHeight, offset)
          ;

        header.css('height', Math.max(64, headerHeight - Math.min(headerHeight, offset)) + 'px');
        header.find('.quasar-toolbar-row:not(:first-of-type)').css('display', offset > 0 ? 'none' : '');
      });
    });

    manager.withEmpty('retract', function() {
      header.addClass('fixed-top').css('z-index', 1);
      content.css('padding-top', header.height() + 20 + 'px');

      var
        lastOffset = 0,
        lastTranslate = 0,
        headerHeight = header.height()
        ;

      $(window).scroll(function() {
        var
          offset = $(window).scrollTop(),
          delta = offset - lastOffset,
          translate = Math.max(0, Math.min(headerHeight, lastTranslate + delta))
          ;

        header.css({'transform': 'translate3d(0,-' + translate + 'px, 0)'});
        lastOffset = offset;
        lastTranslate = translate;
      });
    });
  }
});


Vue.component('quasar-toolbar-navigation', {
  template: '<div class="quasar-toolbar-row quasar-toolbar-navigation layout horizontal center"><slot></slot></div>',
  compiled: function() {
    if (quasar.runs.on.ios) {
      $(this.$el).addClass('quasar-footer');
    }
  }
});

Vue.component('quasar-toolbar-tab', {
  template: '<div class="quasar-toolbar-tab layout flex-auto center-justified center"><slot></slot></div>'
});



Vue.component('quasar-toolbar-row', {
  template: '<div class="quasar-toolbar-row layout horizontal center"><slot></slot></div>'
});

Vue.component('quasar-toolbar-button', {
  template: '<div class="quasar-toolbar-button"><slot></slot></div>'
});

Vue.component('quasar-toolbar-title', {
  template: '<div class="quasar-toolbar-title layout flex"><slot></slot></div>'
});

Vue.component('quasar-footer', {
  template: '<div class="quasar-toolbar quasar-footer fixed-bottom"><slot></slot></div>'
});
