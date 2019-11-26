export function parseSize (size) {
  const match = /([\d\.]+)(\S+)/g.exec(size) || []
  return {
    size: parseFloat(match[1]) || 0,
    unit: match[2] || 'px'
  }
}

export const sizeUnits = [
  'px',
  '%',
  'em',
  'rem',
  'ex',
  'ch',
  'vw',
  'vh',
  'vmin',
  'vmax',
  'fr'
]
