const TOKENS = {
  '#': { pattern: /[\x2A\d]/ },
  0: { pattern: /\d/ },
  9: { pattern: /\d/ },
  X: { pattern: /[0-9a-zA-Z]/ },
  S: { pattern: /[a-zA-Z]/ },
  A: { pattern: /[a-zA-Z]/, transform: v => v.toLocaleUpperCase() },
  a: { pattern: /[a-zA-Z]/, transform: v => v.toLocaleLowerCase() },
  '!': { escape: true }
}

function maskValue (value = '', mask = '', masked = true, tokens) {
  let identificationMask = 0
  let identificationValue = 0
  let output = ''
  while (identificationMask < mask.length && identificationValue < value.length) {
    let cMask = mask[identificationMask]
    const masker = tokens[cMask]
    const cValue = value[identificationValue]
    if (masker && !masker.escape) {
      if (masker.pattern.test(cValue)) {
        output += masker.transform ? masker.transform(cValue) : cValue
        identificationMask++
      }
      identificationValue++
    }
    else {
      if (masker && masker.escape) {
        identificationMask++
        cMask = mask[identificationMask]
      }
      if (masked) output += cMask
      if (cValue === cMask) identificationValue++
      identificationMask++
    }
  }

  let restOutput = ''
  if (masked) {
    while (identificationMask < mask.length) {
      let cMask = mask[identificationMask]
      if (tokens[cMask]) {
        restOutput = ''
        break
      }
      restOutput += cMask
      identificationMask++
    }
  }

  return output + restOutput
};

function arrayMask (masks, tokens) {
  const sortedMasks = Array.from(masks).sort((a, b) => a.length - b.length)
  return function (value, mask, masked = true) {
    let i = 0
    while (i < sortedMasks.length) {
      let currentMask = sortedMasks[i]
      i++
      let nextMask = sortedMasks[i]
      if (!(nextMask && maskValue(value, nextMask, true, tokens).length > currentMask.length)) {
        return maskValue(value, currentMask, masked, tokens)
      }
    }
    return ''
  }
}

function maskSelector (value, mask, masked = true, tokens) {
  if (!mask) return value
  return Array.isArray(mask)
    ? arrayMask(mask, tokens)(value, mask, masked, tokens)
    : maskValue(value, mask, masked, tokens)
}

function eventMaker (name) {
  const evt = document.createEvent('Event')
  evt.initEvent(name, true, true)
  return evt
}

export default {
  name: 'mask',
  bind (el, binding) {
    let element = el
    let config = binding.value
    if (!config) return false
    if (Array.isArray(config) || typeof config === 'string') {
      config = {
        mask: config,
        tokens: TOKENS
      }
    }
    else if (typeof config === 'object') {
      config.tokens = Object.assign(TOKENS, config.tokens)
    }
    else {
      throw new Error('Invalid input entered')
    }
    if (element.tagName.toLocaleUpperCase() !== 'INPUT') {
      let els = element.getElementsByTagName('input')
      if (els.length !== 1) {
        throw new Error('mask directive requires 1 input. Found ' + els.length)
      }
      else {
        element = els[0]
      }
    }
    element.__qmask = config
    element.oninput = function (evt) {
      if (!evt.isTrusted) return
      let position = element.selectionEnd
      let digit = element.value[position - 1]
      element.value = maskSelector(element.value, config.mask, true, config.tokens)
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
      element.dispatchEvent(eventMaker('input'))
    }

    let newDisplay = maskSelector(element.value, config.mask, true, config.tokens)

    if (newDisplay !== element.value) {
      element.value = newDisplay
      element.dispatchEvent(eventMaker('input'))
    }
  },
  unbind (el) {
    const ctx = el.__qmask
    if (!ctx) { return }
    delete el.__qmask
  }
}
