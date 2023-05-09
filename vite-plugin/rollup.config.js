
export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  },
  external: [
    'vite',
    /quasar[\\/][dist|package.json]/
  ]
}
