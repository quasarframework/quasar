const hasSymbol = typeof Symbol === 'function' &&
  typeof Symbol.toStringTag === 'symbol'

export const quasarKey = hasSymbol === true
  ? Symbol('_q_')
  : '_q_'