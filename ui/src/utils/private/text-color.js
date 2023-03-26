export function getTextColor (color, textColor) {
  return color != null ? textColor || `on-${ color }` : textColor
}
