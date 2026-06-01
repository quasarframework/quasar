const PROMPT_STYLE = '--shiki-light:#7D8B99;--shiki-dark:#d4d0ab'
const COMMAND_STYLE = '--shiki-light:#c92c2c;--shiki-dark:#ffa07a'

function tokenText(node) {
  let acc = ''
  const walk = current => {
    if (current.type === 'text') {
      acc += current.value
    } else if (current.children) {
      current.children.forEach(walk)
    }
  }
  walk(node)
  return acc
}

// Shell prompt handling for bash code blocks.
// Shiki's bash grammar marks the first token of a line as the command. So, a
// leading `$ ` steals the command color from the actual command that follows.
// This transformer dims the `$` and re-applies the command color to the next token.
export function bashPromptTransformer() {
  return {
    name: 'docs:bash-prompt',
    line(lineNode) {
      if (this.options.lang !== 'bash') {
        return
      }

      const tokenSpans = lineNode.children.filter(
        child => child.type === 'element' && child.tagName === 'span'
      )

      let firstIndex = -1
      let secondIndex = -1
      for (let i = 0; i < tokenSpans.length; i++) {
        if (tokenText(tokenSpans[i]).trim() === '') {
          continue
        }
        if (firstIndex === -1) {
          firstIndex = i
        } else {
          secondIndex = i
          break
        }
      }

      if (firstIndex === -1) {
        return
      }
      if (tokenText(tokenSpans[firstIndex]).trim() !== '$') {
        return
      }

      tokenSpans[firstIndex].properties.style = PROMPT_STYLE
      if (secondIndex !== -1) {
        tokenSpans[secondIndex].properties.style = COMMAND_STYLE
      }
    }
  }
}
