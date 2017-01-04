const units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB']

export function humanStorageSize (bytes) {
  let u = 0

  while (Math.abs(bytes) >= 1024 && u < units.length - 1) {
    bytes /= 1024
    ++u
  }

  return `${bytes.toFixed(1)} ${units[u]}`
}

export function between (val, min, max) {
  if (val < min) {
    return min
  }

  if (val > max) {
    return max
  }

  return val
}
