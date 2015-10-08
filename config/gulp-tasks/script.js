var
	gulp = require('gulp'),
	config = require('../gulp-config'),
	$ = config.$,
	named = require('vinyl-named'),
    webpack = require('webpack'),
    stream = require('webpack-stream')
;

gulp.task('script:lint', function() {
    return gulp.src(config.script.watch)
        .pipe($.eslint())
        .pipe($.eslint.format());
});


gulp.task('dev:script:deps', function() {
    return gulp.src(config.script.deps)
        .pipe($.newer(config.script.dest + '/' + config.script.depsName + '.js'))
        .pipe($.sourcemaps.init())
        .pipe($.concat(config.script.depsName+'.js'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.script.dest));
});

gulp.task('prod:script:deps', function() {
    return gulp.src(config.script.deps)
        .pipe($.newer(config.script.dest + '/' + config.script.depsName + '.min.js'))
        .pipe($.concat(config.script.depsName+'.min.js'))
        .pipe($.uglify())
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.script.dest));
});


gulp.task('dev:script', ['script:lint'], function() {
    return gulp.src(config.script.entry)
        .pipe(named())
        .pipe(stream({devtool: 'sourcemap'}, webpack))
        .pipe(gulp.dest(config.script.dest));
});

gulp.task('prod:script', ['script:lint'], function() {
    return gulp.src(config.script.entry)
        .pipe(named())
        .pipe(stream({}, webpack))
        .pipe($.uglify())
        .pipe($.rename({extname: '.min.js'}))
        .pipe(gulp.dest(config.script.dest));
});


gulp.task('development:script', ['dev:script', 'dev:script:deps']);
gulp.task('production:script', ['prod:script', 'prod:script:deps']);