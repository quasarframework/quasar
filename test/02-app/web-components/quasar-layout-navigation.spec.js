'use strict';

!testing.phantomjs && describe('quasar-layout tabs', function() {

  beforeEach(function() {
    testing.app.reset();
    testing.app.prepare();
    $(window).scrollTop(0);
  });
  afterEach(function() {
    testing.app.reset();
  });

  after(function() {
    $(window).scrollTop(0);
  });

  it('should be able to handle navigation scroll', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-layout>
          <quasar-header>
            <quasar-navigation manual>
              <quasar-navigation-link v-for="n in 30">TabTabTabTabTabTabTab {{n}}</quasar-navigation-link>
            </quasar-navigation>
          </quasar-header>
          <quasar-page></quasar-page>
        </quasar-layout>
      */}),
      function() {
        var
          nav = $('.quasar-navigation'),
          scroller = nav.find('> .quasar-navigation-container'),
          leftScroll = nav.find('> .left-scroll'),
          rightScroll = nav.find('> .right-scroll')
          ;

        setTimeout(function() {
          expect(nav.hasClass('scrollable')).to.equal(true);
          expect(scroller[0].scrollLeft).to.equal(0);
          expect(leftScroll.hasClass('invisible')).to.equal(true);
          expect(rightScroll.hasClass('invisible')).to.equal(false);
          rightScroll.click();
          setTimeout(function() {
            expect(scroller[0].scrollLeft).to.be.above(0);
            expect(leftScroll.hasClass('invisible')).to.equal(false);
            expect(rightScroll.hasClass('invisible')).to.equal(false);
            leftScroll.click();
            setTimeout(function() {
              expect(scroller[0].scrollLeft).to.equal(0);
              expect(leftScroll.hasClass('invisible')).to.equal(true);
              testing.done();
            }, 50);
          }, 50);
        }, 50);
      }
    );
  });

  it('should be able to make tab visible on click when scrolled', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-layout>
          <quasar-header>
            <quasar-navigation manual>
              <quasar-navigation-link v-for="n in 25">TabTabTabTabTabTabTab {{n}}</quasar-navigation-link>
            </quasar-navigation>
          </quasar-header>
          <quasar-page></quasar-page>
        </quasar-layout>
      */}),
      function() {
        var
          nav = $('.quasar-navigation'),
          scroller = nav.find('> .quasar-navigation-container'),
          content = scroller.find('> .quasar-navigation-content'),
          leftScroll = nav.find('> .left-scroll'),
          rightScroll = nav.find('> .right-scroll'),
          first = content.find('.quasar-navigation-link:first'),
          last = content.find('.quasar-navigation-link:last')
          ;

        quasar.nextTick(function() {
          expect(nav.hasClass('scrollable')).to.equal(true);
          scroller[0].scrollLeft = 100;
          setTimeout(function() {
            expect(leftScroll.hasClass('invisible')).to.equal(false);
            first.click();
            setTimeout(function() {
              expect(scroller[0].scrollLeft).to.equal(0);
              expect(leftScroll.hasClass('invisible')).to.equal(true);
              expect(rightScroll.hasClass('invisible')).to.equal(false);
              last.click();
              setTimeout(function() {
                expect(leftScroll.hasClass('invisible')).to.equal(false);
                expect(rightScroll.hasClass('invisible')).to.equal(true);
                testing.done();
              }, 50);
            }, 50);
          }, 50);
        });
      }
    );
  });

});
