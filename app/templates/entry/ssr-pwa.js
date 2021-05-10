export const isRunningOnPWA = typeof window !== 'undefined' &&
  document.querySelector('[data-server-rendered]') === null
