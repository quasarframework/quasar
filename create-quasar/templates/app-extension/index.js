export async function script ({ scope, utils }) {
  const { script } = await import('./ae-v1/index.js')
  await script({ scope, utils })
}
