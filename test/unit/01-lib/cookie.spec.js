'use strict';

describe('Cookies', function() {
  var cookieName = 'quasarTestCookie';

  beforeEach(function() {
    quasar.remove.cookie(cookieName);
  });

  it('should be able to set a cookie', function() {
    expect(document.cookie).to.not.include(cookieName + '=some-value');
    quasar.set.cookie(cookieName, 'some-value');
    expect(document.cookie).to.include(cookieName + '=some-value');
  });

  it('should be able to read a cookie', function() {
    quasar.set.cookie(cookieName, 'some-value');
    expect(quasar.get.cookie(cookieName)).to.equal('some-value');
  });

  it('should be able to verify if a cookie exists', function() {
    expect(quasar.has.cookie(cookieName)).to.equal(false);
    quasar.set.cookie(cookieName, 'some-value');
    expect(quasar.has.cookie(cookieName)).to.equal(true);
  });

  it('should be able to set an existing cookie to another value', function() {
    quasar.set.cookie(cookieName, 'some-value');
    quasar.set.cookie(cookieName, 'some-other-value');
    expect(document.cookie).to.include(cookieName + '=some-other-value');
    expect(quasar.get.cookie(cookieName)).to.equal('some-other-value');
  });

  it('should set & read a cookie according to RFC2068 - unescape quotes', function() {
    quasar.set.cookie(cookieName, '"cooking"');
    expect(quasar.get.cookie(cookieName)).to.equal('cooking');
  });

  it('should read a cookie set without this module and read it according to RFC2068 - unescape quotes', function() {
    document.cookie = cookieName + '="cooking"';
    expect(quasar.get.cookie(cookieName)).to.equal('cooking');
  });

  it('should be able to set a JSON object as cookie and later read it', function() {
    var obj = {
      some: 'value',
      test: {
        test: 'other-value'
      }
    };

    quasar.set.cookie(cookieName, obj);
    expect(document.cookie).to.include(cookieName);
    expect(quasar.get.cookie(cookieName)).to.deep.equal(obj);
  });

  it('should be able to set an empty cookie', function() {
    expect(document.cookie).to.not.include(cookieName);
    quasar.set.cookie(cookieName, '');
    expect(quasar.get.cookie(cookieName)).to.equal('');
  });

  it('should be able to remove a cookie', function() {
    expect(document.cookie).to.not.include(cookieName);
    quasar.set.cookie(cookieName, 'value');
    quasar.remove.cookie(cookieName);
    expect(document.cookie).to.not.include(cookieName);
    expect(quasar.get.cookie(cookieName)).to.equal(undefined);
  });

  it('should be able to get all cookies', function() {
    quasar.set.cookie(cookieName, 'value');
    quasar.set.cookie(cookieName + '2', 'value');
    var cookies = quasar.get.all.cookies();

    expect(cookies).to.be.ok;
    expect(cookies).to.be.an('object');
    expect(cookies[cookieName]).to.be.ok;
    expect(cookies[cookieName]).to.equal('value');
    expect(cookies[cookieName + '2']).to.be.ok;
    expect(cookies[cookieName + '2']).to.equal('value');

    quasar.remove.cookie(cookieName + '2');
  });

});
