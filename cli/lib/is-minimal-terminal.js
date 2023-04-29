import ci from 'ci-info'

export const isMinimalTerminal = (
  ci.isCI
  || process.env.NODE_ENV === 'test'
  || !process.stdout.isTTY
)
