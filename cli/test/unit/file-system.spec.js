'use strict';

var
  fs = require('fs'),
  fse = require('fs-extra'),
  path = require('path'),
  quasarfs = require('../../lib/file-system')
  ;

describe('file-system', function() {

  describe('path', function() {

    it('should tell CLI working path', function() {
      expect(quasarfs.getWorkingPath()).to.equal(process.cwd());
    });

    it('should get app root', function() {
      expect(quasarfs.getAppPath()).to.equal(process.cwd());
    });

    it('should return undefined when calling get app root not inside an app folder', function() {
      var cwd = process.cwd();

      process.chdir('/');
      expect(quasarfs.getAppPath()).to.not.exist;
      process.chdir(cwd);
    });

    it('should be able to join paths', function() {
      expect(quasarfs.joinPath('a', 'b', 'c')).to.equal('a/b/c');
    });

    it('should get path to assets', function() {
      expect(
        quasarfs.getPathToAsset('app')
      ).to.equal(
        path.join(process.cwd(), 'assets/app')
      );
    });

    it('should get path to a folder within the app', function() {
      expect(
        quasarfs.getPathToFolderFromApp('cmds/whatever.js')
      ).to.equal(
        path.join(process.cwd(), 'cmds/whatever.js')
      );
    });

  });

  describe('inode', function() {
    var dest = path.join(process.cwd(), '.tmp');
    var finalDest = path.join(process.cwd(), '.tmp2');

    describe('folder', function() {
      var src = quasarfs.getPathToAsset('page/___page___');

      it('should copy', function() {
        quasarfs.copy(src, dest);
        expect(fs.existsSync(dest)).to.equal(true);
        expect(fs.existsSync(dest + '/assets')).to.equal(true);
      });
      it('should test', function() {
        expect(quasarfs.exists(dest)).to.equal(true);
        expect(quasarfs.exists(dest + '/assets')).to.equal(true);
        expect(quasarfs.exists(dest + '/script.___page___.js')).to.equal(true);
      });
      it('should rename', function() {
        quasarfs.move(dest, finalDest);
        expect(fs.existsSync(finalDest)).to.equal(true);
        expect(fs.existsSync(finalDest + '/assets')).to.equal(true);
      });
      it('should remove', function() {
        quasarfs.remove(finalDest);
        expect(fs.existsSync(finalDest)).to.equal(false);
      });
    });

    describe('file', function() {
      var src = quasarfs.getPathToAsset('page/___page___/script.___page___.js');

      it('should copy', function() {
        quasarfs.copy(src, dest);
        expect(fs.existsSync(dest)).to.equal(true);
      });
      it('should test', function() {
        expect(quasarfs.exists(dest)).to.equal(true);
      });
      it('should rename', function() {
        quasarfs.move(dest, finalDest);
        expect(fs.existsSync(finalDest)).to.equal(true);
      });
      it('should remove', function() {
        quasarfs.remove(finalDest);
        expect(fs.existsSync(finalDest)).to.equal(false);
      });
      it('should be able to generate symlink', function() {
        expect(fs.existsSync(finalDest)).to.equal(false);
        quasarfs.symlink('../', finalDest);
        expect(fs.existsSync(src)).to.equal(true);
        quasarfs.remove(finalDest);
      });
    });
  });

});
