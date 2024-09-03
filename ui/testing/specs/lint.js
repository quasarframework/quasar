import { ESLint } from 'eslint'

let eslint
let eslintFormatter

async function init () {
  eslint = new ESLint()
  eslintFormatter = await eslint.loadFormatter('stylish')
}

function getLintResult (lintResult) {
  if (
    lintResult.length !== 0
    && lintResult.some(({ errorCount, warningCount }) => errorCount !== 0 || warningCount !== 0)
  ) {
    return eslintFormatter.format(lintResult)
  }
}

export default async function lint (content, action = 'lintFiles') {
  if (eslint === void 0) {
    await init()
  }

  return getLintResult(
    await eslint[ action ](content)
  )
}
