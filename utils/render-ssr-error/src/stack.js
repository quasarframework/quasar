
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parse } from 'stack-trace'

function getFilename (filename) {
  if (existsSync(filename)) {
    return filename
  }

  if (process.env.NVM_DIR && process.versions.node) {
    const nodeFilename = join(process.env.NVM_DIR, 'src/node-v' + process.versions.node, 'lib', filename)
    if (existsSync(nodeFilename)) {
      return nodeFilename
    }
  }
}

function getSource (entry) {
  const declaredFilename = entry.getFileName()
  const fileName = getFilename(declaredFilename)

  if (!fileName) {
    return {
      fileName: declaredFilename,
      sourceCode: null
    }
  }

  const fileContentLines = readFileSync(fileName, 'utf8').split('\n')
  const lineNumber = entry.getLineNumber()

  const startLineNumber = Math.max(1, lineNumber - 5)
  const linesList = fileContentLines.slice(startLineNumber, lineNumber + 5)

  if (linesList.length === 0) {
    return {
      fileName,
      sourceCode: null
    }
  }

  const highlightTopOffset = `${ 16 /* top padding */ + ((lineNumber - startLineNumber - 1) * 21 /* line-height */) }px`
  const highlightLeftOffset = `${ 16 /* left padding */ + (entry.getColumnNumber() * 14 /* font-size */) }px`
  const maxLineNumberLen = ('' + (startLineNumber + linesList.length - 1)).length

  return {
    fileName,
    sourceCode: {
      linesList,
      startLineNumber,
      maxLineNumberLen,
      highlightTopOffset,
      highlightLeftOffset
    }
  }
}

export function getStack (err) {
  const trace = parse(err)

  return trace.map(entry => {
    const { fileName, sourceCode } = getSource(entry)

    return {
      fileName,
      sourceCode,
      functionName: entry.getTypeName() || entry.getFunctionName(),
      methodName: `${ entry.isConstructor() ? 'new ' : '' }${ entry.getMethodName() || '<anonymous>' }`,
      native: entry.isNative(),
      lineNumber: entry.getLineNumber(),
      columnNumber: entry.getColumnNumber()
    }
  })
}
