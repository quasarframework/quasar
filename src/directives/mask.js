const maskInput = {
  tokens: {
    '#': { pattern: /[\x2A\d]/ },
    0: { pattern: /\d/ },
    9: { pattern: /\d/ },
    X: { pattern: /[0-9a-zA-Z]/ },
    S: { pattern: /[a-zA-Z]/ },
    A: { pattern: /[a-zA-Z]/, transform: v => v.toLocaleUpperCase() },
    a: { pattern: /[a-zA-Z]/, transform: v => v.toLocaleLowerCase() },
    '!': { escape: true }
  },
  maskit (v, m, masked = true, tokens) {
    const value = v || ''
    const mask = m || ''
    let iMask = 0
    let iValue = 0
    let output = ''
    while (iMask < mask.length && iValue < value.length) {
      let cMask = mask[iMask]
      let masker = tokens[cMask]
      let cValue = value[iValue]
      if (masker && !masker.escape) {
        if (masker.pattern.test(cValue)) {
          output += masker.transform ? masker.transform(cValue) : cValue
          iMask++
        }
        iValue++
      }
      else {
        if (masker && masker.escape) {
          iMask++
          cMask = mask[iMask]
        }
        if (masked) output += cMask
        if (cValue === cMask) iValue++
        iMask++
      }
    }

    let restOutput = ''
    if (masked) {
      while (iMask < mask.length) {
        let cMask = mask[iMask]
        if (tokens[cMask]) {
          restOutput = ''
          break
        }
        restOutput += cMask
        iMask++
      }
    }

    return output + restOutput
  },
  dynamicMask (masks, tokens) {
    let sortedMasks = Array.from(masks).sort((a, b) => a.length - b.length)
    return function (value, mask, masked = true) {
      let i = 0
      while (i < sortedMasks.length) {
        let currentMask = sortedMasks[i]
        i++
        let nextMask = sortedMasks[i]
        if (!(nextMask && this.maskit(value, nextMask, true, tokens).length > currentMask.length)) {
          return this.maskit(value, currentMask, masked, tokens)
        }
      }
      return ''
    }
  },
  masker (value, mask, masked = true, tokens) {
    if (!mask) {
      return value
    }
    return Array.isArray(mask)
      ? this.dynamicMask(mask, tokens)(value, mask, masked, tokens)
      : this.maskit(value, mask, masked, tokens)
  }
}

export default {
  name: 'q-mask',
  bind (el, binding) {
    let element = el
    let config = binding.value
    if (!config) return false
    if (Array.isArray(config) || typeof config === 'string') {
      config = {
        mask: config,
        tokens: maskInput.tokens
      }
    }
    else if (typeof config === 'object') {
      Object.assign(maskInput.tokens, config.tokens)
    }
    else {
      throw new Error('Invalid input entered')
    }
    if (element.tagName.toLocaleUpperCase() !== 'INPUT') {
      let els = element.getElementsByTagName('input')
      if (els.length !== 1) {
        throw new Error('q-mask directive requires 1 input. Found ' + els.length)
      }
      else {
        element = els[0]
      }
    }

    element.oninput = function (evt) {
      if (!evt.isTrusted) return
      let position = element.selectionEnd
      let digit = element.value[position - 1]
      element.value = maskInput.masker(element.value, config.mask, true, config.tokens)
      while (
        position < element.value.length &&
                element.value.charAt(position - 1) !== digit
      ) {
        position++
      }
      if (element === document.activeElement) {
        element.setSelectionRange(position, position)
        setTimeout(function () {
          element.setSelectionRange(position, position)
        }, 0)
      }
      element.dispatchEvent(event('input'))
    }

    let newDisplay = maskInput.masker(element.value, config.mask, true, config.tokens)

    if (newDisplay !== element.value) {
      element.value = newDisplay
      element.dispatchEvent(event('input'))
    }
  }
}
