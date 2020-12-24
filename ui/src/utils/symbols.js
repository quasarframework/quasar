const hasSymbol = typeof Symbol === 'function'
  && typeof Symbol.toStringTag === 'symbol'

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

export const fabKey = hasSymbol === true
  ? Symbol('_q_f_')
  : '_q_f_'

export const formKey = hasSymbol === true
  ? Symbol('_q_fo_')
  : '_q_fo_'

export const tabsKey = hasSymbol === true
  ? Symbol('_q_tabs_')
  : '_q_tabs_'

export const uploaderKey = hasSymbol === true
  ? Symbol('_q_u_')
  : '_q_u_'
