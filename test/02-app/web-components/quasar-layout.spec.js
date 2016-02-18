'use strict';

!testing.phantomjs && describe.skip('quasar-screen components', function() {

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
        <quasar-screen>
          <quasar-header>
            <quasar-row>
              <quasar-title>Text {{text}}</quasar-title>
            </quasar-row>
            <quasar-navigation>
              <quasar-navigation-link>Tab 1</quasar-navigation-link>
            </quasar-navigation>
          </quasar-header>
          <quasar-page></quasar-page>
          <quasar-footer>
            <quasar-row>
              <quasar-title>Some text</quasar-title>
            </quasar-row>
          </quasar-footer>
        </quasar-screen>
      */}),
      function() {
        expect(_html.match(/class="([\w\s])*quasar-screen/)).to.exist;
        expect(_html.match(/class="([\w\s])*quasar-header/)).to.exist;
        expect(_html.match(/class="([\w\s])*quasar-page/)).to.exist;
        expect(_html.match(/class="([\w\s])*quasar-footer/)).to.exist;
        testing.done();
      }
    );
  });

  it('should be able to handle scroll-shadow along no additional attribs', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-screen scroll-shadow>
          <quasar-header>
            <quasar-row>
              <quasar-title>Quasar</quasar-header>
            </quasar-row>
          </quasar-header>
          <quasar-page>
            <div style="height: 5000px"></div>
          </quasar-page>
        </quasar-screen>
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

  it('should be able to add shadow', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-screen shadow>
          <quasar-header>
            <quasar-row>
              <quasar-title>Quasar</quasar-header>
            </quasar-row>
          </quasar-header>
          <quasar-page>
            <div style="height: 5000px"></div>
          </quasar-page>
        </quasar-screen>
      */}),
      function() {
        expect($('.quasar-header').hasClass('shadow')).to.equal(true);
        testing.done();
      }
    );
  });

  it('should be able to handle keep-marginals & scroll-shadow types', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-screen keep-marginals scroll-shadow>
          <quasar-header>
            <quasar-row>
              <quasar-title>Quasar Header</quasar-header>
            </quasar-row>
          </quasar-header>
          <quasar-page></quasar-page>
        </quasar-screen>
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

  it.skip('should be able to handle retract-header & scroll-shadow types', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-screen retract-header scroll-shadow>
          <quasar-header>
            <quasar-row>
              <quasar-title>Quasar</quasar-header>
            </quasar-row>
          </quasar-header>
          <quasar-page></quasar-page>
        </quasar-screen>
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

  it.skip('should be able to handle shrink-header & scroll-shadow types', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-screen shrink-header scroll-shadow>
          <quasar-header>
            <quasar-row>
              <quasar-title>Quasar</quasar-header>
            </quasar-row>
            <quasar-row id="second-row">
              <quasar-title>Second Row</quasar-header>
            </quasar-row>
          </quasar-header>
          <quasar-page></quasar-page>
        </quasar-screen>
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

  it('should be able to handle footer on scroll', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-screen>
          <quasar-page></quasar-page>
          <quasar-footer>
            <quasar-row>
              <quasar-title>Footer</quasar-title>
            </quasar-row>
          </quasar-footer>
        </quasar-screen>
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

  it('should be able to handle keep-header', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-screen keep-header>
          <quasar-header>
            <quasar-row>
              <quasar-title>Footer</quasar-title>
            </quasar-row>
          </quasar-header>
          <quasar-page></quasar-page>
        </quasar-screen>
      */}),
      function() {
        var header = $('.quasar-header');

        $('.quasar-page').append('<div style="height: 5000px">');
        $(window).scrollTop(0);
        expect(testing.isAllVisible(header)).to.equal(true);
        $(window).scrollTop(5000);
        setTimeout(function() {
          expect(testing.isAllVisible(header)).to.equal(true);
          testing.done();
        }, 100);
      }
    );
  });

  it('should be able to handle keep-footer', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-screen keep-footer>
          <quasar-page></quasar-page>
          <quasar-footer>
            <quasar-row>
              <quasar-title>Footer</quasar-title>
            </quasar-row>
          </quasar-footer>
        </quasar-screen>
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

  it('should be able to handle footer with keep-marginals', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-screen keep-marginals keep-footer>
          <quasar-page></quasar-page>
          <quasar-footer>
            <quasar-row>
              <quasar-title>Footer</quasar-title>
            </quasar-row>
          </quasar-footer>
        </quasar-screen>
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

  it('should be able to handle keep-footer and shrink-header', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-screen keep-footer shrink-header>
          <quasar-page></quasar-page>
          <quasar-footer>
            <quasar-row>
              <quasar-title>Footer</quasar-title>
            </quasar-row>
          </quasar-footer>
        </quasar-screen>
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

  it('should be able to handle keep-footer and retract-header', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-screen keep-footer retract-header>
          <quasar-page></quasar-page>
          <quasar-footer>
            <quasar-row>
              <quasar-title>Footer</quasar-title>
            </quasar-row>
          </quasar-footer>
        </quasar-screen>
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

  it('should be able to render drawer', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-screen>
          <quasar-drawer>
            <quasar-drawer-header>
              <div style="width: 100px; height: 100px; background-color: black;"></div>
              <div><strong>Razvan Stoenescu</strong></div>
              <div>Quasar Framework rocks!</div>
            </quasar-drawer-header>

            <quasar-drawer-link v-for="n in 14">
              <i>alarm</i>
              Message {{n + 1}}
            </quasar-drawer-link>

            <quasar-drawer-divider></quasar-drawer-divider>
            <quasar-drawer-header>Subheader</quasar-drawer-header>

            <quasar-drawer-link v-for="n in 5">
              <i>alarm</i>
              Message {{n + 1}}
            </quasar-drawer-link>
          </quasar-drawer>
          <quasar-page></quasar-page>
      */}),
      function() {
        expect(_html.match(/class="([\w\s])*quasar-screen/)).to.exist;
        expect(_html.match(/class="([\w\s])*quasar-drawer/)).to.exist;
        expect(_html.match(/class="([\w\s])*quasar-page/)).to.exist;
        expect(_html.match(/class="([\w\s])*quasar-drawer-header/)).to.exist;
        expect(_html.match(/class="([\w\s])*quasar-drawer-link/)).to.exist;
        expect(_html.match(/class="([\w\s])*quasar-drawer-divider/)).to.exist;
        testing.done();
      }
    );
  });

});
