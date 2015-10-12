/**
* Pants module.
* @module my/pants
* @see module:my/shirt
*/

require('./test.js');
console.log('loaded');

window.a = 'a';

/**
* [wow description]
* @param  {[type]} gee [description]
* @param  {[type]} gux [description]
* @return {[type]}     [description]
*/
function wow(gee, gux) {
  if (gux) {
    gux++;
  }

  return gee;
}

/**
* Generate a wee effect
* @param  {String} version version to output
* @param  {Function} varax   varax server
* @return {String}         version
*/
function wee(version, varax) {
  /** {Number} gee, wee, foo variable */
  var foo = 1;

  foo++;
  if (varax) {
    varax++;
  }

  return version;
}

wow();
wee();

module.exports = function() {
  console.log('waaa');
};
