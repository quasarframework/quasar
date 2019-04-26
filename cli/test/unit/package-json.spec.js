'use strict';

var path = require('path');

describe('lib: package-json', function() {

  before(function() {
    this.pkg = require('../../lib/package-json');
  });


  it('should return package.json path from this project when calling getPath', function() {
    var result = this.pkg.getPath(__dirname);
    var value = path.join(path.normalize(path.join(__dirname, '../../')), 'package.json');

    expect(result).to.equal(value);
  });

  it('should return version when calling getVersion()', function() {
    var result;

    expect(function() {
      result = this.pkg.getVersion();
    }.bind(this)).to.not.throw();

    expect(result).to.exist;
  });

  it('should set version when calling setVersion()', function() {
    var content = this.pkg.getContent();

    expect(function() {
      var version = this.pkg.getVersion();

      this.pkg.setVersion(version);
    }.bind(this)).to.not.throw();

    var newContent = this.pkg.getContent();

    expect(content).to.deep.equal(newContent);
  });

  it('should return current version when calling getVersion()', function() {
    var result;

    expect(function() {
      result = this.pkg.getVersion();
    }.bind(this)).not.to.throw();

    expect(result).to.exist;
  });

});
