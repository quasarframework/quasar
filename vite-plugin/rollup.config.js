
export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.cjs',
    format: 'cjs'
  },
  external: [
    'vite',
    /quasar[\\/][dist|package.json]/,
    /node:/
  ]
}
