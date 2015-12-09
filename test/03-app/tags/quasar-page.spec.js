'use strict';

describe('quasar-page components', function() {

  beforeEach(function() {
    testing.app.reset();
    testing.app.prepare();
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
        <quasar-page>
          <quasar-header>
            <quasar-row>
              <quasar-title>Text {{text}}</quasar-title>
            </quasar-row>
            <quasar-navigation>
              <quasar-tab>Tab 1</quasar-tab>
            </quasar-navigation>
          </quasar-header>
          <quasar-content></quasar-content>
          <quasar-footer>
            <quasar-row>
              <quasar-title>Some text</quasar-title>
            </quasar-row>
          </quasar-footer>
        </quasar-page>
      */}),
      function() {
        expect(_html.match(/class="([\w\s])*quasar-page/)).to.exist;
        expect(_html.match(/class="([\w\s])*quasar-header/)).to.exist;
        expect(_html.match(/class="([\w\s])*quasar-content/)).to.exist;
        expect(_html.match(/class="([\w\s])*quasar-footer/)).to.exist;
        testing.done();
      }
    );
  });

  !testing.phantomjs && it('should be able to handle scroll-shadow along no additional attribs', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-page scroll-shadow>
          <quasar-header>
            <quasar-row>
              <quasar-title>Quasar</quasar-header>
            </quasar-row>
          </quasar-header>
          <quasar-content>
            <div style="height: 5000px"></div>
          </quasar-content>
        </quasar-page>
      */}),
      function() {
        var
          header = $('.quasar-header'),
          content = $('.quasar-content')
          ;

        expect(header.hasClass('shadow')).to.equal(false);
        content.scrollTop(500);
        setTimeout(function() {
          expect(header.hasClass('shadow')).to.equal(false);
          testing.done();
        }, 50);
      }
    );
  });

  !testing.phantomjs && it('should be able to handle keep-marginals & scroll-shadow types', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-page keep-marginals scroll-shadow>
          <quasar-header>
            <quasar-row>
              <quasar-title>Quasar</quasar-header>
            </quasar-row>
          </quasar-header>
          <quasar-content>
            <div style="height: 5000px"></div>
          </quasar-content>
        </quasar-page>
      */}),
      function() {
        var
          header = $('.quasar-header'),
          content = $('.quasar-content')
          ;

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
          }, 50);
        }, 50);
      }
    );
  });

  !testing.phantomjs && it('should be able to handle retract-header & scroll-shadow types', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-page retract-header scroll-shadow>
          <quasar-header>
            <quasar-row>
              <quasar-title>Quasar</quasar-header>
            </quasar-row>
          </quasar-header>
          <quasar-content>
            <div style="height: 5000px"></div>
          </quasar-content>
        </quasar-page>
      */}),
      function() {
        var
          header = $('.quasar-header'),
          content = $('.quasar-content')
          ;

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
            }, 50);
          }, 50);
        }, 50);
      }
    );
  });

  !testing.phantomjs && it('should be able to handle shrink-header & scroll-shadow types', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-page shrink-header scroll-shadow>
          <quasar-header>
            <quasar-row>
              <quasar-title>Quasar</quasar-header>
            </quasar-row>
            <quasar-row id="second-row">
              <quasar-title>Second Row</quasar-header>
            </quasar-row>
          </quasar-header>
          <quasar-content>
            <div style="height: 5000px"></div>
          </quasar-content>
        </quasar-page>
      */}),
      function() {
        var
          header = $('.quasar-header'),
          content = $('.quasar-content'),
          row = $('#second-row')
          ;

        $(window).scrollTop(0);
        expect(header.hasClass('shadow')).to.equal(false);
        expect(testing.isAllVisible(header)).to.equal(true);
        expect(testing.isAllVisible(row)).to.equal(true);
        $(window).scrollTop(1);
        setTimeout(function() {
          expect(header.hasClass('shadow')).to.equal(true);
          expect(testing.isAllVisible(header)).to.equal(true);
          expect(testing.isAllVisible(row)).to.equal(false);
          $(window).scrollTop(0);
          setTimeout(function() {
            expect(header.hasClass('shadow')).to.equal(false);
            expect(testing.isAllVisible(row)).to.equal(true);
            testing.done();
          }, 50);
        }, 50);
      }
    );
  });

  !testing.phantomjs && it('should be able to handle footer on scroll', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-page>
          <quasar-content>
            <div style="height: 5000px"></div>
          </quasar-content>
          <quasar-footer>
            <quasar-row>
              <quasar-title>Footer</quasar-title>
            </quasar-row>
          </quasar-footer>
        </quasar-page>
      */}),
      function() {
        var footer = $('.quasar-footer');

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
          }, 50);
        }, 50);
      }
    );
  });

  !testing.phantomjs && it('should be able to handle keep-footer', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-page keep-footer>
          <quasar-content>
            <div style="height: 5000px"></div>
          </quasar-content>
          <quasar-footer>
            <quasar-row>
              <quasar-title>Footer</quasar-title>
            </quasar-row>
          </quasar-footer>
        </quasar-page>
      */}),
      function() {
        var footer = $('.quasar-footer');

        $(window).scrollTop(0);
        expect(testing.isAllVisible(footer)).to.equal(true);
        $(window).scrollTop(5000);
        setTimeout(function() {
          expect(testing.isAllVisible(footer)).to.equal(true);
          testing.done();
        }, 50);
      }
    );
  });

  !testing.phantomjs && it('should be able to handle footer with keep-marginals', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-page keep-marginals>
          <quasar-content>
            <div style="height: 5000px"></div>
          </quasar-content>
          <quasar-footer>
            <quasar-row>
              <quasar-title>Footer</quasar-title>
            </quasar-row>
          </quasar-footer>
        </quasar-page>
      */}),
      function() {
        var
          footer = $('.quasar-footer'),
          content = $('.quasar-content')
          ;

        content.scrollTop(0);
        expect(testing.isAllVisible(footer)).to.equal(true);
        content.scrollTop(5000);
        setTimeout(function() {
          expect(testing.isAllVisible(footer)).to.equal(true);
          testing.done();
        }, 50);
      }
    );
  });

  !testing.phantomjs && it('should be able to handle keep-footer and shrink-header', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-page keep-footer shrink-header>
          <quasar-content>
            <div style="height: 5000px"></div>
          </quasar-content>
          <quasar-footer>
            <quasar-row>
              <quasar-title>Footer</quasar-title>
            </quasar-row>
          </quasar-footer>
        </quasar-page>
      */}),
      function() {
        var footer = $('.quasar-footer');

        $(window).scrollTop(0);
        expect(testing.isAllVisible(footer)).to.equal(true);
        $(window).scrollTop(5000);
        setTimeout(function() {
          expect(testing.isAllVisible(footer)).to.equal(true);
          testing.done();
        }, 50);
      }
    );
  });

  !testing.phantomjs && it('should be able to handle keep-footer and retract-header', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-page keep-footer retract-header>
          <quasar-content>
            <div style="height: 5000px"></div>
          </quasar-content>
          <quasar-footer>
            <quasar-row>
              <quasar-title>Footer</quasar-title>
            </quasar-row>
          </quasar-footer>
        </quasar-page>
      */}),
      function() {
        var footer = $('.quasar-footer');

        $(window).scrollTop(0);
        expect(testing.isAllVisible(footer)).to.equal(true);
        $(window).scrollTop(5000);
        setTimeout(function() {
          expect(testing.isAllVisible(footer)).to.equal(true);
          testing.done();
        }, 50);
      }
    );
  });

  it('should be able to handle navigation tab click/tap', function(done) {
    testing.done.set(done);
    testing.app.tag(
      testing.line(true, function() {/*
        <quasar-page>
          <quasar-header>
            <quasar-navigation>
              <quasar-tab>Tab 1</quasar-tab>
            </quasar-navigation>
          </quasar-header>
          <quasar-content></quasar-content>
        </quasar-page>
      */}),
      function() {
        $('.quasar-tab').click(function() {
          expect($(this).hasClass('active')).to.equal(true);
          testing.done();
        }).click();
      }
    );
  });

});
