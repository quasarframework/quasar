import { Linter } from 'eslint'

declare const configs: {
  base: Linter.Config[]
  node: Linter.Config[]
  vue: Linter.Config[]
}

export default {
  configs
}
