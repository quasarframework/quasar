export function getCssClassAsObject(cssClasses) {
  if (typeof cssClasses === "string") {
    return { [cssClasses]: true };
  }

  if (Array.isArray(cssClasses)) {
    return cssClasses
      .map(toObject)
      .filter(Boolean)
      .reduce((acc, curr) => ({ ...acc, ...curr }), {});
  }

  return cssClasses;
}
