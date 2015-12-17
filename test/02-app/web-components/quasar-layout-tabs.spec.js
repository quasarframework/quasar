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
            <quasar-navigation>
              <quasar-tab>TabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTab 1</quasar-tab>
              <quasar-tab>TabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTab 2</quasar-tab>
              <quasar-tab>TabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTab 3</quasar-tab>
              <quasar-tab>TabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTab 4</quasar-tab>
              <quasar-tab>TabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTab 5</quasar-tab>
              <quasar-tab>TabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTab 6</quasar-tab>
              <quasar-tab>TabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTab 7</quasar-tab>
              <quasar-tab>TabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTab 8</quasar-tab>
              <quasar-tab>TabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTab 9</quasar-tab>
              <quasar-tab>TabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTab 10</quasar-tab>
              <quasar-tab>TabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTab 11</quasar-tab>
              <quasar-tab>TabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTab 12</quasar-tab>
              <quasar-tab>TabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTab 13</quasar-tab>
              <quasar-tab>TabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTab 14</quasar-tab>
              <quasar-tab>TabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTab 15</quasar-tab>
            </quasar-navigation>
          </quasar-header>
          <quasar-page></quasar-page>
        </quasar-layout>
      */}),
      function() {
        var
          nav = $('.quasar-navigation'),
          scroller = nav.find('> .tabsContainer'),
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
            <quasar-navigation>
              <quasar-tab>TabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTab 1</quasar-tab>
              <quasar-tab>TabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTab 2</quasar-tab>
              <quasar-tab>TabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTab 3</quasar-tab>
              <quasar-tab>TabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTab 4</quasar-tab>
              <quasar-tab>TabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTab 5</quasar-tab>
              <quasar-tab>TabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTab 6</quasar-tab>
              <quasar-tab>TabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTab 7</quasar-tab>
              <quasar-tab>TabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTab 8</quasar-tab>
              <quasar-tab>TabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTab 9</quasar-tab>
              <quasar-tab>TabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTab 10</quasar-tab>
              <quasar-tab>TabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTab 11</quasar-tab>
              <quasar-tab>TabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTab 12</quasar-tab>
              <quasar-tab>TabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTab 13</quasar-tab>
              <quasar-tab>TabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTab 14</quasar-tab>
              <quasar-tab>TabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTabTab 15</quasar-tab>
            </quasar-navigation>
          </quasar-header>
          <quasar-page></quasar-page>
        </quasar-layout>
      */}),
      function() {
        var
          nav = $('.quasar-navigation'),
          scroller = nav.find('> .tabsContainer'),
          content = scroller.find('> .tabsContent'),
          leftScroll = nav.find('> .left-scroll'),
          rightScroll = nav.find('> .right-scroll'),
          first = content.find('.quasar-tab:first'),
          last = content.find('.quasar-tab:last')
          ;

        q.nextTick(function() {
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

  it('should be able to handle navigation tab click/tap', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-layout>
          <quasar-header>
            <quasar-navigation>
              <quasar-tab>Tab 1</quasar-tab>
            </quasar-navigation>
          </quasar-header>
          <quasar-page></quasar-page>
        </quasar-layout>
      */}),
      function() {
        var clicked = 0;

        $('.tabsContent .quasar-tab').click(function() {
          var $this = $(this);

          clicked++;
          expect($this.hasClass('active')).to.equal(true);
          if (clicked === 1) {
            q.nextTick(function() {
              $this.click();
              q.nextTick(function() {
                expect($this.hasClass('active')).to.equal(true);
                testing.done();
              });
            });
          }
        }).click();
      }
    );
  });

});
