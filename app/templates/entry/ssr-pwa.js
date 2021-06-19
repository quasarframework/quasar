export const isRunningOnPWA = typeof window !== 'undefined' &&
  document.body.getAttribute('data-server-rendered') === null
