/**
 * Heavily inspired by Eta v4.5.1
 */

const fnAccumulator = '__qstr__'
const defaultParseOptions = {
  varName: 'scope',
  exec: '', // never '-' | '_'
  interpolate: '=', // never '-' | '_'
  raw: '~', // never '-' | '_'
  header: '',
  tagStart: '<%',
  tagEnd: '%>'
}

const newlineRE = /\n/
const multipleNewlineRE = /\r\n|\n|\r/g
const newlineTrimRE = /^(?:\r\n|\n|\r)/
const escapeRegexpRE = /[.*+\-?^${}()|[\]\\]/g
const templateLitReg =
  /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})*}|(?!\${)[^\\`])*`/g
const singleQuoteReg = /'(?:\\[\s\w"'\\`]|[^\n\r'\\])*?'/g
const doubleQuoteReg = /"(?:\\[\s\w"'\\`]|[^\n\r"\\])*?"/g
const strEscapeRE = /\\|'/g

function throwParseError(message, str, index) {
  const whitespace = str.slice(0, index).split(newlineRE)

  const lineNo = whitespace.length
  const colNo = whitespace[lineNo - 1].length + 1

  message +=
    ' at line ' +
    lineNo +
    ' col ' +
    colNo +
    ':\n\n' +
    '  ' +
    str.split(newlineRE)[lineNo - 1] +
    '\n' +
    ' '.repeat(colNo + 1) +
    '^'

  throw new Error(message)
}

function escapeRegExp(str) {
  // From MDN
  return str.replaceAll(escapeRegexpRE, String.raw`\$&`) // $& means the whole matched string
}

function trimWS(str, wsLeft, wsRight) {
  // Slightly confusing,
  // but _}} will trim the left side of the following string
  const leftTrim = wsLeft || wsLeft === false ? wsLeft : 'nl'
  const rightTrim = wsRight || wsRight === false ? wsRight : false

  if (!rightTrim && !leftTrim) return str

  if (leftTrim === 'slurp' && rightTrim === 'slurp') {
    return str.trim()
  }

  if (leftTrim === '_' || leftTrim === 'slurp') {
    // full slurp
    str = str.trimStart()
  } else if (leftTrim === '-' || leftTrim === 'nl') {
    // nl trim
    str = str.replace(newlineTrimRE, '')
  }

  if (rightTrim === '_' || rightTrim === 'slurp') {
    // full slurp
    str = str.trimEnd()
  } else if (rightTrim === '-' || rightTrim === 'nl') {
    // nl trim
    str = str.replace(newlineTrimRE, '')
  }

  return str
}

// opts: { exec, interpolate, raw, tagStart, tagEnd }
function getAST(str, opts) {
  const ast = []
  let trimLeftOfNextStr = false
  let lastIndex = 0

  templateLitReg.lastIndex = 0
  singleQuoteReg.lastIndex = 0
  doubleQuoteReg.lastIndex = 0

  function pushString(strng, shouldTrimRightOfString) {
    if (strng) {
      // if string is truthy it must be of type 'string'

      strng = trimWS(
        strng,
        trimLeftOfNextStr, // this will only be false on the first str, the next ones will be null or undefined
        shouldTrimRightOfString
      )

      if (strng) {
        // replace \ with \\, ' with \'
        // we're going to convert all CRLF to LF so it doesn't take more than one replace

        strng = strng
          .replaceAll(strEscapeRE, String.raw`\$&`)
          .replaceAll(multipleNewlineRE, String.raw`\n`)

        ast.push(strng)
      }
    }
  }

  const prefixes = [opts.exec, opts.interpolate, opts.raw].reduce(
    (accumulator, prefix) => {
      if (accumulator && prefix) {
        return accumulator + '|' + escapeRegExp(prefix)
      } else if (prefix) {
        // accumulator is falsy
        return escapeRegExp(prefix)
      }
      // prefix and accumulator are both falsy
      return accumulator
    },
    ''
  )

  const parseOpenReg = new RegExp(
    escapeRegExp(opts.tagStart) +
      String.raw`(-|_)?\s*(` +
      prefixes +
      String.raw`)?\s*`,
    'g'
  )

  const parseCloseReg = new RegExp(
    '\'|"|`|\\/\\*|(\\s*(-|_)?' + escapeRegExp(opts.tagEnd) + ')',
    'g'
  )

  const parseRawCloseReg = opts.raw
    ? new RegExp(
        String.raw`(\s*(-|_)?` + escapeRegExp(opts.raw + opts.tagEnd) + ')',
        'g'
      )
    : parseCloseReg

  let m
  while ((m = parseOpenReg.exec(str))) {
    const precedingString = str.slice(lastIndex, m.index)

    lastIndex = m[0].length + m.index

    const wsLeft = m[1]
    const prefix = m[2] || '' // by default either ~, =, or empty

    pushString(precedingString, wsLeft)

    const endReg = prefix === opts.raw ? parseRawCloseReg : parseCloseReg
    endReg.lastIndex = lastIndex

    let closeTag
    let currentObj = false

    while ((closeTag = endReg.exec(str))) {
      if (closeTag[1]) {
        const content = str.slice(lastIndex, closeTag.index)

        parseOpenReg.lastIndex = lastIndex = endReg.lastIndex

        trimLeftOfNextStr = closeTag[2]

        const currentType =
          prefix === opts.exec
            ? 'e'
            : prefix === opts.raw
              ? 'r'
              : prefix === opts.interpolate
                ? 'i'
                : ''

        currentObj = { t: currentType, val: content }
        break
      } else {
        const char = closeTag[0]
        if (char === '/*') {
          const commentCloseInd = str.indexOf('*/', endReg.lastIndex)

          if (commentCloseInd === -1) {
            throwParseError('unclosed comment', str, closeTag.index)
          }
          endReg.lastIndex = commentCloseInd
        } else if (char === "'") {
          singleQuoteReg.lastIndex = closeTag.index

          const singleQuoteMatch = singleQuoteReg.exec(str)
          if (singleQuoteMatch) {
            endReg.lastIndex = singleQuoteReg.lastIndex
          } else {
            throwParseError('unclosed string', str, closeTag.index)
          }
        } else if (char === '"') {
          doubleQuoteReg.lastIndex = closeTag.index
          const doubleQuoteMatch = doubleQuoteReg.exec(str)

          if (doubleQuoteMatch) {
            endReg.lastIndex = doubleQuoteReg.lastIndex
          } else {
            throwParseError('unclosed string', str, closeTag.index)
          }
        } else if (char === '`') {
          templateLitReg.lastIndex = closeTag.index
          const templateLitMatch = templateLitReg.exec(str)
          if (templateLitMatch) {
            endReg.lastIndex = templateLitReg.lastIndex
          } else {
            throwParseError('unclosed string', str, closeTag.index)
          }
        }
      }
    }
    if (currentObj) {
      ast.push(currentObj)
    } else {
      throwParseError('unclosed tag', str, m.index)
    }
  }

  pushString(str.slice(lastIndex), false)
  return ast
}

const safeFn = `const _safe=fn=>{try{const val = fn();return val ?? ''}catch{return ''}}\n`

const rawContentRE = /[$`\\"]/g
function parseRawContent(content) {
  return '"' + content.replaceAll(rawContentRE, String.raw`\$&`) + '"'
}

// opts: { varName, header }
function compileBody(ast, opts) {
  let i = 0
  let needsSafeFn = false
  const astLength = ast.length
  let returnStr = `${opts.header}\nlet ${fnAccumulator} = ''\n`

  for (; i < astLength; i++) {
    const currentBlock = ast[i]

    if (typeof currentBlock === 'string') {
      returnStr += `${fnAccumulator}+='${currentBlock}'\n`
      continue
    }

    const content = currentBlock.val ?? ''
    if (content !== '') {
      const type = currentBlock.t // "r", "e", or "i"

      if (type === 'e') {
        // execute
        returnStr += content + '\n'
      } else if (type === 'r') {
        // raw
        returnStr += `${fnAccumulator}+=${parseRawContent(content)}\n`
      } else if (type === 'i') {
        // interpolate
        needsSafeFn = true
        returnStr += `${fnAccumulator}+=_safe(() => ${content})\n`
      }
    }
  }

  return `${needsSafeFn ? safeFn : ''}${returnStr}\nreturn ${fnAccumulator}`
}

export function compileTemplateToFile(str, rawOpts = {}) {
  const opts = { ...defaultParseOptions, ...rawOpts }
  const ast = getAST(str, opts)
  const body = compileBody(ast, opts)
  return `export default ${opts.varName} => {\n${body}\n}`
}

export const templateRenderError = Symbol('templateRenderError')
export function compileTemplateToFn(str, rawOpts = {}) {
  const opts = { ...defaultParseOptions, ...rawOpts }
  const ast = getAST(str, opts)
  const body = compileBody(ast, opts)

  try {
    // oxlint-disable-next-line no-new-func
    return new Function(opts.varName, body)
  } catch {
    return templateRenderError
  }
}

function getRenderTemplateOpts(rawOpts, scope) {
  if (rawOpts?.varName === false) {
    const keys = Object.keys(scope)
    return {
      ...rawOpts,
      varName: defaultParseOptions.varName,
      header:
        keys.length !== 0
          ? `const { ${keys.join(', ')} } = ${defaultParseOptions.varName}`
          : ''
    }
  }

  return rawOpts
}

export function renderTemplate(str, scope, rawOpts) {
  const templateFn = compileTemplateToFn(
    str,
    getRenderTemplateOpts(rawOpts, scope)
  )

  return templateFn === templateRenderError
    ? templateRenderError
    : templateFn(scope)
}
