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
  if (max <= min) {
    return min
  }
  return Math.min(max, Math.max(min, val))
}

export function normalizeToInterval (val, min, max) {
  if (max <= min) {
    return min
  }

  const size = (max - min + 1)

  let index = val % size
  if (index < min) {
    index = size + index
  }

  return index
}
