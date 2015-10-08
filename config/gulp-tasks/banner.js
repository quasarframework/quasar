var
    gulp = require('gulp'),
    config = require('../gulp-config'),
    $ = config.$,
    fs = require('fs')
;

function pad(n) {
    if (n < 10) {
        return '0' + n;
    }

    return n;
}

gulp.task('banner', function() {
    var banner = fs.readFileSync('./config/version-banner.tpl', 'utf8');
    var pkg = require('../../package.json');
    var year = (new Date().getFullYear());

    return gulp.src(config.banner.src)
        .pipe($.header(banner, {
            pkg: pkg,
            year: year
        }))
        .pipe(gulp.dest(config.banner.dest));
});