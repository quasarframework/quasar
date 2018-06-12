const units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB']

export function humanStorageSize (bytes) {
  let u = 0

  while (parseInt(bytes, 10) >= 1024 && u < units.length - 1) {
    bytes /= 1024
    ++u
  }

  return `${bytes.toFixed(1)} ${units[u]}`
}

export function capitalize (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function between (v, min, max) {
  if (max <= min) {
    return min
  }
  return Math.min(max, Math.max(min, v))
}

export function normalizeToInterval (v, min, max) {
  if (max <= min) {
    return min
  }

  const size = (max - min + 1)

  let index = min + (v - min) % size
  if (index < min) {
    index = size + index
  }

  return index === 0 ? 0 : index // fix for (-a % a) => -0
}

export function pad (v, length = 2, char = '0') {
  let val = '' + v
  return val.length >= length
    ? val
    : new Array(length - val.length + 1).join(char) + val
}
