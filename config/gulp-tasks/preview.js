'use strict';

var
    gulp = require('gulp'),
    config = require('../gulp-config'),
    browserSync = require('browser-sync').create(),
    runSequence = require('run-sequence'),
    //pngquant = require('imagemin-pngquant'),
    named = require('vinyl-named'),
    webpack = require('webpack'),
    stream = require('webpack-stream')
;

// inject browserSync to config so other
// modules (like CSS) can stream to it
config.browser = browserSync;

function browserReloadAfter(tasks) {
    return function() {
        runSequence(
            tasks,
            function() {
                browserSync.reload();
            }
        );
    };
}


gulp.task('preview:html:lint', function() {
    return gulp.src(config.preview.html.src)
        .pipe(config.$.html5Lint());
});
gulp.task('preview:html', ['preview:html:lint'], function() {
    return gulp.src(config.preview.html.src)
        .pipe(config.$.changed(config.preview.html.dest))
        .pipe(gulp.dest(config.preview.html.dest));
});

gulp.task('preview:image', function() {
    return gulp.src(config.preview.image.src)
        .pipe(config.$.changed(config.preview.image.dest))
        .pipe(config.$.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(config.preview.image.dest));
});

gulp.task('preview:style:lint', function() {
    gulp.src(config.preview.style.watch)
        .pipe(config.$.scssLint({customReport: config.$.scssLintStylish}));
});
gulp.task('preview:style', ['preview:style:lint'], function() {
    return gulp.src(config.preview.style.entry)
        .pipe(config.$.changed(config.preview.style.dest))
        .pipe(config.$.sourcemaps.init())
        .pipe(config.$.sass().on('error', config.$.sass.logError))
        .pipe(config.$.autoprefixer(config.style.autoprefixer))
        .pipe(config.$.sourcemaps.write())
        .pipe(gulp.dest(config.preview.style.dest))
        .pipe(config.browser.stream());
});

gulp.task('preview:script:lint', function() {
    return gulp.src(config.preview.script.watch)
        .pipe(config.$.eslint())
        .pipe(config.$.eslint.format());
});
gulp.task('preview:script', ['preview:script:lint'], function() {
    return gulp.src(config.preview.script.entry)
        .pipe(named())
        .pipe(stream({devtool: 'sourcemap'}, webpack))
        .pipe(gulp.dest(config.preview.script.dest));
});


gulp.task('preview:deps:style', ['development:style'], function() {
    return gulp.src(config.preview.deps.src+'/**/*.css')
        .pipe(config.$.changed(config.preview.deps.dest))
        .pipe(gulp.dest(config.preview.deps.dest))
        .pipe(config.browser.stream());
});
gulp.task('preview:deps:script', ['development:script'], function() {
    return gulp.src(config.preview.deps.src+'/**/*.js')
        .pipe(config.$.changed(config.preview.deps.dest))
        .pipe(gulp.dest(config.preview.deps.dest));
});
gulp.task('preview:deps', ['dev'], function() {
    return gulp.src(config.preview.deps.src)
        .pipe(config.$.changed(config.preview.deps.dest))
        .pipe(gulp.dest(config.preview.deps.dest));
});

gulp.task('preview:build', [
    'preview:deps', 'preview:script',
    'preview:style', 'preview:html', 'preview:image'
]);
gulp.task('preview:serve', function() {
    browserSync.init(config.preview.server, function() {
        // quasar sources
        gulp.watch(config.style.watch, ['preview:deps:style']);
        gulp.watch(config.script.watch, browserReloadAfter('preview:deps:script'));

        // demo sources
        gulp.watch(config.preview.style.watch, ['preview:style']);
        gulp.watch(config.preview.script.watch, browserReloadAfter('preview:script'));
        gulp.watch(config.preview.html.src, browserReloadAfter('preview:html'));
        gulp.watch(config.preview.image.src, browserReloadAfter('preview:image'));
    });
});
