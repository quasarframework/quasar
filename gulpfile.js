'use strict';

var requireDir = require('require-dir');

global.gulp = require('gulp');
global.plugins = require('gulp-load-plugins')();
global.config = require('./gulp/gulp-config');

requireDir('./gulp/tasks/', {recurse: true});
