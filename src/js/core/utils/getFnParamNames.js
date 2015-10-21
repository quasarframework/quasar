var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;

function getFnParamNames(func) {
  var string = func.toString().replace(STRIP_COMMENTS, '');
  var result = string.slice(string.indexOf('(') + 1, string.indexOf(')')).match(ARGUMENT_NAMES);

  if (result === null) {
    result = [];
  }
  return result;
}

module.exports = getFnParamNames;
