'use strict';

var
  gulp = require('gulp'),
  config = require('../gulp-config'),
  plugins = config.plugins
  ;

gulp.task('banner', function() {
  return gulp.src(config.banner.src)
    .pipe(plugins.pipes.banner())
    .pipe(gulp.dest(config.banner.dest));
});
