var
    gulp = require('gulp'),
    config = require('../gulp-config'),
    $ = config.$
;

gulp.task('style:lint', function() {
    gulp.src(config.style.watch)
        .pipe($.scssLint({customReport: $.scssLintStylish}));
});


gulp.task('dev:style:deps', function() {
    return gulp.src(config.style.deps)
        .pipe($.newer(config.style.dest + '/' + config.style.depsName + '.css'))
        .pipe($.sourcemaps.init())
        .pipe($.concat(config.style.depsName+'.css'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.style.dest));
});

gulp.task('prod:style:deps', function() {
    return gulp.src(config.style.deps)
        .pipe($.concat(config.style.depsName+'.min.css'))
        .pipe($.minifyCss({processImport: false}))
        .pipe(gulp.dest(config.style.dest));
});


gulp.task('dev:style', ['style:lint'], function() {
    return gulp.src(config.style.entry)
        .pipe($.changed(config.style.dest))
        .pipe($.sourcemaps.init())
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.autoprefixer(config.autoprefixer))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.style.dest));
});

gulp.task('prod:style', ['style:lint'], function() {
    return gulp.src(config.style.entry)
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.autoprefixer(config.style.autoprefixer))
        .pipe($.minifyCss())
        .pipe($.rename({extname: '.min.css'}))
        .pipe(gulp.dest(config.style.dest));
});


gulp.task('development:style', ['dev:style', 'dev:style:deps']);
gulp.task('production:style', ['prod:style', 'prod:style:deps']);