'use strict';

/*
 * Quasar Page
 */

Vue.component('quasar-page', {
  template: '<div class="quasar-page"><slot></slot></div>',
  ready: function() {
    var
      page = $(this.$el),
      header = page.find('.quasar-header'),
      content = page.find('.quasar-content'),
      footer = page.find('.quasar-footer'),
      manager = page.getAttributesManager()
      ;

    if (footer.length > 0 && !manager.hasEmpty('keep-marginals') && manager.hasEmpty('keep-footer')) {
      content.css('padding-bottom', footer.height() + 20 + 'px');
    }

    manager.withEmpty('keep-footer', function() {
      footer.addClass('fixed-bottom');
    });

    manager.withEmpty('scroll-shadow', function() {
      if (!manager.hasEmpty('keep-marginals retract-header shrink-header')) {
        return;
      }

      var target = manager.hasEmpty('retract-header') || manager.hasEmpty('shrink-header') ? $(window) : content;

      target.scroll(function() {
        var shouldHaveShadow = target.scrollTop() > 0;

        header[shouldHaveShadow ? 'addClass' : 'removeClass']('shadow');
      });
    });

    manager.withEmpty('keep-marginals', function() {
      page.addClass('fixed-top layout vertical window-height');
      content.addClass('scroll flex');
    });

    manager.withEmpty('shrink-header', function() {
      header.addClass('fixed-top').css('z-index', 1);
      content.css('padding-top', header.height() + 20 + 'px');

      var headerHeight = header.height();

      $(window).scroll(function() {
        var
          offset = $(window).scrollTop(),
          translate = Math.min(headerHeight, offset)
          ;

        header.css('height', Math.max(64, headerHeight - Math.min(headerHeight, offset)) + 'px');
        header.find('.quasar-row:not(:first-of-type)').css('display', offset > 0 ? 'none' : '');
      });
    });

    manager.withEmpty('retract-header', function() {
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

/*
 * Quasar Content
 */

Vue.component('quasar-content', {
  template: '<div class="quasar-content"><slot></slot></div>'
});

/*
 * Quasar Headers
 */

Vue.component('quasar-header', {
  template: '<div class="quasar-header quasar-toolbar layout vertical"><slot></slot></div>'
});


Vue.component('quasar-navigation', {
  template: '<div class="quasar-row quasar-navigation layout justify-around"><slot></slot></div>',
  ready: function() {
    $(this.$el).find('a.quasar-tab').click(function() {
      var self = $(this);

      self.siblings().removeClass('active');
      self.addClass('active');
    });
  }
});

Vue.component('quasar-tab', {
  template: '<a class="quasar-tab layout grow-1"><div class="layout grow-1 self-center justify-center"><slot></slot></div></a>'
});

Vue.component('quasar-row', {
  template: '<div class="quasar-row layout horizontal items-center"><slot></slot></div>'
});

Vue.component('quasar-title', {
  template: '<div class="quasar-title layout flex"><slot></slot></div>'
});

Vue.component('quasar-footer', {
  template: '<div class="quasar-footer quasar-toolbar"><slot></slot></div>'
});
