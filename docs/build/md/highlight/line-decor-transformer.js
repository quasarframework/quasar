import { addClassToHast } from 'shiki/core'

function parseRanges(raw) {
  const set = new Set()
  if (raw === void 0 || raw === '') {
    return set
  }

  for (const part of String(raw).split(',')) {
    const [from, to] = part.split('-').map(value => Number.parseInt(value, 10))
    const end = Number.isFinite(to) ? to : from
    for (let i = from; i <= end; i++) {
      set.add(i)
    }
  }

  return set
}

function lineHasClass(line, name) {
  const cls = line.properties?.class
  if (typeof cls === 'string') {
    return cls.split(/\s+/).includes(name)
  }
  if (Array.isArray(cls)) {
    return cls.includes(name)
  }
  return false
}

function lineTextContent(line) {
  let acc = ''
  const walk = node => {
    if (node.type === 'text') {
      acc += node.value
    } else if (node.children) {
      node.children.forEach(walk)
    }
  }
  line.children.forEach(walk)
  return acc
}

function markDiff(line, kind) {
  addClassToHast(line, 'diff')
  addClassToHast(line, kind)
}

function diffChar(line) {
  if (lineHasClass(line, 'add')) {
    return '+'
  }
  if (lineHasClass(line, 'remove')) {
    return '-'
  }
  return ' '
}

export function lineDecorTransformer({ numbered, highlight, add, rem } = {}) {
  const highlightSet = parseRanges(highlight)
  const addSet = parseRanges(add)
  const remSet = parseRanges(rem)

  return {
    name: 'docs:line-decor',
    code(codeNode) {
      const lines = codeNode.children.filter(
        child =>
          child.type === 'element' &&
          child.tagName === 'span' &&
          lineHasClass(child, 'line')
      )

      lines.forEach((line, index) => {
        const lineNum = index + 1
        if (highlightSet.has(lineNum)) {
          addClassToHast(line, 'highlighted')
        }
        if (addSet.has(lineNum)) {
          markDiff(line, 'add')
        }
        if (remSet.has(lineNum)) {
          markDiff(line, 'remove')
        }
      })

      if (this.options.lang === 'diff') {
        for (const line of lines) {
          const first = lineTextContent(line).charAt(0)
          if (first === '+') {
            markDiff(line, 'add')
          } else if (first === '-') {
            markDiff(line, 'remove')
          }
        }
      }

      const hasFenceDiff = addSet.size !== 0 || remSet.size !== 0
      if (numbered !== true && hasFenceDiff === false) {
        return
      }

      const width = String(lines.length).length

      lines.forEach((line, index) => {
        const parts = []
        if (numbered === true) {
          parts.push(String(index + 1).padStart(width, ' '))
        }
        if (hasFenceDiff) {
          parts.push(diffChar(line))
        }
        line.children.unshift({
          type: 'element',
          tagName: 'span',
          properties: { class: 'c-lpref' },
          children: [{ type: 'text', value: parts.join(' ') }]
        })
      })
    }
  }
}
