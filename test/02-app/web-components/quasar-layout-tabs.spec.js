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
              <quasar-tab v-for="n in 30">TabTabTabTabTabTabTab {{n}}</quasar-tab>
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
              <quasar-tab v-for="n in 25">TabTabTabTabTabTabTab {{n}}</quasar-tab>
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
    testing.app.addPage(
      'second',
      [{
        url: 'script.second.js',
        content: function() {
          module.exports = {
            template: 'page content',
            ready: function() {
              q.nextTick(function() {
                expect($('.tabsContent .quasar-tab:last').hasClass('active')).to.equal(true);
                testing.done();
              });
            }
          };
        }
      }],
      {layout: 'tab-test'}
    );
    testing.app.addIndex(
      function() {
        module.exports = {
          template: 'index content',
          ready: function() {
            q.nextTick(function() {
              expect($('.tabsContent .quasar-tab:first').hasClass('active')).to.equal(true);
              $('.tabsContent .quasar-tab:last').click();
            });
          }
        };
      },
      null,
      {layout: 'tab-test'}
    );
    testing.app.addLayout('tab-test', function() {
      module.exports = {
        template: testing.line(true, function() {/*
          <quasar-layout>
            <quasar-header>
              <quasar-navigation>
                <quasar-tab page="index">Index</quasar-tab>
                <quasar-tab page="second">Second</quasar-tab>
              </quasar-navigation>
            </quasar-header>
            <quasar-page></quasar-page>
          </quasar-layout>
        */})
      };
    });
    testing.app.start();
  });

  it('should be able to handle navigation tab click/tap with route attribute', function(done) {
    testing.done.set(done);
    testing.app.addPage(
      'second',
      [{
        url: 'script.second.js',
        content: function() {
          module.exports = {
            template: 'page content',
            ready: function() {
              q.nextTick(function() {
                expect($('.tabsContent .quasar-tab:last').hasClass('active')).to.equal(true);
                $('.tabsContent .quasar-tab:last').click();
              });
            }
          };
        }
      }],
      {layout: 'tab-test-2'}
    );
    testing.app.addPage(
      'third',
      [{
        url: 'script.third.js',
        content: function() {
          module.exports = {
            template: 'page content',
            ready: function() {
              q.nextTick(function() {
                expect($('.tabsContent .quasar-tab:last').hasClass('active')).to.equal(false);
                testing.done();
              });
            }
          };
        }
      }],
      {layout: 'tab-test-2'}
    );
    testing.app.addIndex(
      function() {
        module.exports = {
          template: 'index content',
          ready: function() {
            q.nextTick(function() {
              expect($('.tabsContent .quasar-tab:first').hasClass('active')).to.equal(true);
              $('.tabsContent .quasar-tab:first').click();
            });
          }
        };
      },
      null,
      {layout: 'tab-test-2'}
    );
    testing.app.addLayout('tab-test-2', function() {
      module.exports = {
        methods: {
          getThirdRoute: function() {
            return '#/third';
          }
        },
        template: testing.line(true, function() {/*
          <quasar-layout>
            <quasar-header>
              <quasar-navigation>
                <quasar-tab page="index" route="#/second">Index</quasar-tab>
                <quasar-tab page="second" :route="getThirdRoute">Second</quasar-tab>
              </quasar-navigation>
            </quasar-header>
            <quasar-page></quasar-page>
          </quasar-layout>
        */})
      };
    });
    testing.app.start();
  });

});
