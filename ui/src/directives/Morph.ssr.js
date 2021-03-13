import { createObjectProperty } from '@vue/compiler-dom'

export default (dir) => {
  const name = dir.arg
    ? '\'' + dir.arg.content.split(':')[ 0 ] + '\''
    : false

  return {
    props: [
      createObjectProperty(
        'class',
        `${ dir.exp.content } === ${ name } ? '' : 'q-morph--invisible'`
      )
    ]
  }
}
