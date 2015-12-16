'use strict';

describe.only('quasar-layout components', function() {

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

  it('should be able to render', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-layout>
          <quasar-header>
            <quasar-row>
              <quasar-title>Text {{text}}</quasar-title>
            </quasar-row>
            <quasar-navigation>
              <quasar-tab>Tab 1</quasar-tab>
            </quasar-navigation>
          </quasar-header>
          <quasar-page></quasar-page>
          <quasar-footer>
            <quasar-row>
              <quasar-title>Some text</quasar-title>
            </quasar-row>
          </quasar-footer>
        </quasar-layout>
      */}),
      function() {
        expect(_html.match(/class="([\w\s])*quasar-layout/)).to.exist;
        expect(_html.match(/class="([\w\s])*quasar-header/)).to.exist;
        expect(_html.match(/class="([\w\s])*quasar-page/)).to.exist;
        expect(_html.match(/class="([\w\s])*quasar-footer/)).to.exist;
        testing.done();
      }
    );
  });

  !testing.phantomjs && it('should be able to handle scroll-shadow along no additional attribs', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-layout scroll-shadow>
          <quasar-header>
            <quasar-row>
              <quasar-title>Quasar</quasar-header>
            </quasar-row>
          </quasar-header>
          <quasar-page>
            <div style="height: 5000px"></div>
          </quasar-page>
        </quasar-layout>
      */}),
      function() {
        var
          header = $('.quasar-header'),
          content = $('.quasar-page')
          ;

        expect(header.hasClass('shadow')).to.equal(false);
        content.scrollTop(500);
        setTimeout(function() {
          expect(header.hasClass('shadow')).to.equal(false);
          testing.done();
        }, 100);
      }
    );
  });

  !testing.phantomjs && it('should be able to handle keep-marginals & scroll-shadow types', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-layout keep-marginals scroll-shadow>
          <quasar-header>
            <quasar-row>
              <quasar-title>Quasar</quasar-header>
            </quasar-row>
          </quasar-header>
          <quasar-page></quasar-page>
        </quasar-layout>
      */}),
      function() {
        var
          header = $('.quasar-header'),
          content = $('.quasar-page')
          ;

        content.append('<div style="height: 5000px">');
        expect(header.hasClass('shadow')).to.equal(false);
        expect(testing.isAllVisible(header)).to.equal(true);
        content.scrollTop(500);
        setTimeout(function() {
          expect(header.hasClass('shadow')).to.equal(true);
          expect(testing.isAllVisible(header)).to.equal(true);
          content.scrollTop(0);
          setTimeout(function() {
            expect(header.hasClass('shadow')).to.equal(false);
            testing.done();
          }, 100);
        }, 100);
      }
    );
  });

  !testing.phantomjs && it('should be able to handle retract-header & scroll-shadow types', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-layout retract-header scroll-shadow>
          <quasar-header>
            <quasar-row>
              <quasar-title>Quasar</quasar-header>
            </quasar-row>
          </quasar-header>
          <quasar-page></quasar-page>
        </quasar-layout>
      */}),
      function() {
        var
          header = $('.quasar-header'),
          content = $('.quasar-page')
          ;

        content.append('<div style="height: 5000px">');
        $(window).scrollTop(0);
        expect(header.hasClass('shadow')).to.equal(false);
        expect(testing.isAllVisible(header)).to.equal(true);
        $(window).scrollTop(500);
        setTimeout(function() {
          expect(header.hasClass('shadow')).to.equal(true);
          expect(testing.isAllVisible(header)).to.equal(false);
          $(window).scrollTop(0);
          setTimeout(function() {
            expect(header.hasClass('shadow')).to.equal(false);
            expect(testing.isAllVisible(header)).to.equal(true);
            $(window).scrollTop(1);
            setTimeout(function() {
              expect(testing.isPartVisible(header)).to.equal(true);
              testing.done();
            }, 100);
          }, 100);
        }, 100);
      }
    );
  });

  !testing.phantomjs && it('should be able to handle shrink-header & scroll-shadow types', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-layout shrink-header scroll-shadow>
          <quasar-header>
            <quasar-row>
              <quasar-title>Quasar</quasar-header>
            </quasar-row>
            <quasar-row id="second-row">
              <quasar-title>Second Row</quasar-header>
            </quasar-row>
          </quasar-header>
          <quasar-page></quasar-page>
        </quasar-layout>
      */}),
      function() {
        var
          header = $('.quasar-header'),
          content = $('.quasar-page'),
          row = $('#second-row')
          ;

        content.append('<div style="height: 5000px">');
        $(window).scrollTop(0);
        expect(header.hasClass('shadow')).to.equal(false);
        expect(testing.isAllVisible(header)).to.equal(true);
        expect(testing.isAllVisible(row)).to.equal(true);
        $(window).scrollTop(1);
        setTimeout(function() {
          expect(header.hasClass('shadow')).to.equal(true);
          expect(testing.isAllVisible(header)).to.equal(true);
          expect(testing.isAllVisible(row)).to.equal(true);
          $(window).scrollTop(0);
          setTimeout(function() {
            expect(header.hasClass('shadow')).to.equal(false);
            expect(testing.isAllVisible(row)).to.equal(true);
            testing.done();
          }, 100);
        }, 100);
      }
    );
  });

  !testing.phantomjs && it('should be able to handle footer on scroll', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-layout>
          <quasar-page></quasar-page>
          <quasar-footer>
            <quasar-row>
              <quasar-title>Footer</quasar-title>
            </quasar-row>
          </quasar-footer>
        </quasar-layout>
      */}),
      function() {
        var footer = $('.quasar-footer');

        $('.quasar-page').append('<div style="height: 5000px">');
        $(window).scrollTop(0);
        expect(footer.hasClass('shadow')).to.equal(false);
        expect(testing.isAllVisible(footer)).to.equal(false);
        $(window).scrollTop(5000);
        setTimeout(function() {
          expect(testing.isAllVisible(footer)).to.equal(true);
          $(window).scrollTop(0);
          setTimeout(function() {
            expect(testing.isAllVisible(footer)).to.equal(false);
            testing.done();
          }, 100);
        }, 100);
      }
    );
  });

  !testing.phantomjs && it('should be able to handle keep-footer', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-layout keep-footer>
          <quasar-page></quasar-page>
          <quasar-footer>
            <quasar-row>
              <quasar-title>Footer</quasar-title>
            </quasar-row>
          </quasar-footer>
        </quasar-layout>
      */}),
      function() {
        var footer = $('.quasar-footer');

        $('.quasar-page').append('<div style="height: 5000px">');
        $(window).scrollTop(0);
        expect(testing.isAllVisible(footer)).to.equal(true);
        $(window).scrollTop(5000);
        setTimeout(function() {
          expect(testing.isAllVisible(footer)).to.equal(true);
          testing.done();
        }, 100);
      }
    );
  });

  !testing.phantomjs && it('should be able to handle footer with keep-marginals', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-layout keep-marginals keep-footer>
          <quasar-page></quasar-page>
          <quasar-footer>
            <quasar-row>
              <quasar-title>Footer</quasar-title>
            </quasar-row>
          </quasar-footer>
        </quasar-layout>
      */}),
      function() {
        var
          footer = $('.quasar-footer'),
          content = $('.quasar-page')
          ;

        content.append('<div style="height: 5000px">');
        content.scrollTop(0);
        expect(testing.isAllVisible(footer)).to.equal(true);
        content.scrollTop(5000);
        setTimeout(function() {
          expect(testing.isAllVisible(footer)).to.equal(true);
          testing.done();
        }, 100);
      }
    );
  });

  !testing.phantomjs && it('should be able to handle keep-footer and shrink-header', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-layout keep-footer shrink-header>
          <quasar-page></quasar-page>
          <quasar-footer>
            <quasar-row>
              <quasar-title>Footer</quasar-title>
            </quasar-row>
          </quasar-footer>
        </quasar-layout>
      */}),
      function() {
        var footer = $('.quasar-footer');

        $('.quasar-page').append('<div style="height: 5000px">');
        $(window).scrollTop(0);
        expect(testing.isAllVisible(footer)).to.equal(true);
        $(window).scrollTop(5000);
        setTimeout(function() {
          expect(testing.isAllVisible(footer)).to.equal(true);
          testing.done();
        }, 100);
      }
    );
  });

  !testing.phantomjs && it('should be able to handle keep-footer and retract-header', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-layout keep-footer retract-header>
          <quasar-page></quasar-page>
          <quasar-footer>
            <quasar-row>
              <quasar-title>Footer</quasar-title>
            </quasar-row>
          </quasar-footer>
        </quasar-layout>
      */}),
      function() {
        var footer = $('.quasar-footer');

        $('.quasar-page').append('<div style="height: 5000px">');
        $(window).scrollTop(0);
        expect(testing.isAllVisible(footer)).to.equal(true);
        $(window).scrollTop(5000);
        setTimeout(function() {
          expect(testing.isAllVisible(footer)).to.equal(true);
          testing.done();
        }, 100);
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

  it.skip('should be able to handle navigation scroll', function(done) {
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

        q.nextTick(function() {
          expect(nav.hasClass('scrollable')).to.equal(true);
          expect(scroller[0].scrollLeft).to.equal(0);
          expect(leftScroll.hasClass('invisible')).to.equal(true);
          expect(rightScroll.hasClass('invisible')).to.equal(false);
          rightScroll.click();
          setTimeout(function() {
            expect(scroller[0].scrollLeft).to.be.above(0);
            expect(leftScroll.hasClass('invisible')).to.equal(false);
            expect(rightScroll.hasClass('invisible')).to.equal(true);
            leftScroll.click();
            setTimeout(function() {
              expect(scroller[0].scrollLeft).to.equal(0);
              expect(leftScroll.hasClass('invisible')).to.equal(true);
              testing.done();
            }, 20);
          }, 20);
        });
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
              }, 20);
            }, 20);
          }, 20);
        });
      }
    );
  });

});
