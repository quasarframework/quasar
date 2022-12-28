export function getCssClassesAsObject (cssClasses) {
  if (typeof cssClasses === 'string') {
    return cssClasses
      .split(' ')
      .reduce((acc, curr) => ({ ...acc, [ curr ]: true }), {})
  }

  if (Array.isArray(cssClasses)) {
    return cssClasses
      .map(getCssClassesAsObject)
      .filter(Boolean)
      .reduce((acc, curr) => ({ ...acc, ...curr }), {})
  }

  return cssClasses
}
