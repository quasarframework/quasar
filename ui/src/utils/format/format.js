const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

export function humanStorageSize(bytes, decimals = 1) {
  let u = 0

  while (Number.parseInt(bytes, 10) >= 1024 && u < units.length - 1) {
    bytes /= 1024
    ++u
  }

  return `${bytes.toFixed(decimals)}${units[u]}`
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function between(v, min, max) {
  return max <= min ? min : Math.min(max, Math.max(min, v))
}

export function normalizeToInterval(v, min, max) {
  if (max <= min) {
    return min
  }

  const size = max - min + 1

  let index = min + ((v - min) % size)
  if (index < min) {
    index = size + index
  }

  return index === 0 ? 0 : index // fix for (-a % a) => -0
}

export function pad(v, length = 2, char = '0') {
  if (v === void 0 || v === null) return v
  return String(v).padStart(length, char)
}

/**
 * How many decimals a number (or its string form) needs when written
 * in fixed notation. Exponent notation counts too: String(1e-7) is
 * "1e-7", not "0.0000001". Capped at 100, the most that toFixed()
 * accepts.
 */
export function getDecimalsCount(value) {
  const [mantissa, exponent] = String(value).trim().toLowerCase().split('e')
  const count = (mantissa.split('.')[1] || '').length - (Number(exponent) || 0)

  return count > 0 ? Math.min(count, 100) : 0
}

export default {
  humanStorageSize,
  capitalize,
  between,
  normalizeToInterval,
  pad,
  getDecimalsCount
}
