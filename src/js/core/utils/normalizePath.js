
var baseElement = document.createElement('base');
var relativeElement = document.createElement('a');

document.head.appendChild(baseElement);

function normalizePath(relativePath, base) {
  var resolved;

  baseElement.href = base;
  relativeElement.href = relativePath;
  resolved = relativeElement.href;
  baseElement.href = '';

  return resolved;
}

module.exports = normalizePath;
