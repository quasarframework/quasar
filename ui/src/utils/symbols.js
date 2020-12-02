const hasSymbol = typeof Symbol === 'function' &&
  typeof Symbol.toStringTag === 'symbol'

export const quasarKey = hasSymbol === true
  ? Symbol('_q_')
  : '_q_'

export const timelineKey = hasSymbol === true
  ? Symbol('_q_t_')
  : '_q_t_'

export const stepperKey = hasSymbol === true
  ? Symbol('_q_s_')
  : '_q_s_'

export const layoutKey = hasSymbol === true
  ? Symbol('_q_l_')
  : '_q_l_'

export const pageContainerKey = hasSymbol === true
  ? Symbol('_q_pc_')
  : '_q_pc_'