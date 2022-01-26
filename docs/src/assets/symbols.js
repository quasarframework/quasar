const hasSymbol = typeof Symbol === 'function' &&
  typeof Symbol.toStringTag === 'symbol'

export const docStoreKey = hasSymbol === true
  ? Symbol('_q_ds_')
  : '_q_ds_'
