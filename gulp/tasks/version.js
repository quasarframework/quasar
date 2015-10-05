var gulp = require('gulp'),
    config = require('../config'),
    $ = config.$,
    _ = require('lodash'),
    fs = require('fs'),
    semver = require('semver'),
    recommend = require('conventional-recommended-bump');
 

function bumpVersion(version) {
    gulp.src('package.json')
        .pipe($.bump({ version: version }))
        .pipe(gulp.dest('./'));
}

function updateChangelog() {
    gulp.src('CHANGELOG.md')
        .pipe($.conventionalChangelog({ preset: 'angular' }))
        .pipe(gulp.dest('./'));
}

function commit(importance, version) {
    gulp.src(['package.json', 'CHANGELOG.md', config.dist.dest+'/**/*'])
        .pipe($.git.add())
        .pipe($.git.commit('Bump release version: '+importance+' - v'+version));
}

function tag(version) {
    $.git.tag('v'+version, 'Release v'+version);
}


function getNewVersion(importance) {
    var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    return semver.inc(pkg.version, importance);
}



function release(importance) {
    var version = getNewVersion(importance);

    bumpVersion(version);
    updateChangelog();
    commit(importance, version);
    tag(version);
}

_.each([
    'prepatch', 'patch',
    'preminor', 'minor',
    'premajor', 'major',
    'prerelease'
], function(importance) {
    gulp.task(importance, ['dist'], function() { release(importance); });
});

gulp.task('recommend-version', function() {
    recommend({ preset: 'angular' }, function(err, recommendation) {
        $.util.log('Recommending a', $.util.colors.yellow(recommendation), 'version.');
    });
});