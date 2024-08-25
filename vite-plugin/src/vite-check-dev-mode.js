export function viteCheckDevMode ({ command, mode }) {
  return command === 'serve' && mode === 'development'
}
