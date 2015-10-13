'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  plugins = config.plugins,
  fs = require('fs');

gulp.task('banner', function() {
  var banner = fs.readFileSync('./config/version-banner.tpl', 'utf8');
  var pkg = require('../../package.json');
  var year = new Date().getFullYear();

  return gulp.src(config.banner.src)
  .pipe(plugins.header(banner, {
    pkg: pkg,
    year: year
  }))
  .pipe(gulp.dest(config.banner.dest));
});
