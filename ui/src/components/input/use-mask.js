import { computed, nextTick, ref, watch } from 'vue'

import { shouldIgnoreKey } from '../../utils/private.keyboard/key-composition.js'

// leave NAMED_MASKS at top of file (code referenced from docs)
const NAMED_MASKS = {
  date: '####/##/##',
  datetime: '####/##/## ##:##',
  time: '##:##',
  fulltime: '##:##:##',
  phone: '(###) ### - ####',
  card: '#### #### #### ####'
}

const { tokenMap: DEFAULT_TOKEN_MAP, tokenKeys: DEFAULT_TOKEN_MAP_KEYS } =
  getTokenMap({
    '#': { pattern: '[\\d]', negate: '[^\\d]' },

    S: { pattern: '[a-zA-Z]', negate: '[^a-zA-Z]' },
    N: { pattern: '[0-9a-zA-Z]', negate: '[^0-9a-zA-Z]' },

    A: {
      pattern: '[a-zA-Z]',
      negate: '[^a-zA-Z]',
      transform: v => v.toLocaleUpperCase()
    },
    a: {
      pattern: '[a-zA-Z]',
      negate: '[^a-zA-Z]',
      transform: v => v.toLocaleLowerCase()
    },

    X: {
      pattern: '[0-9a-zA-Z]',
      negate: '[^0-9a-zA-Z]',
      transform: v => v.toLocaleUpperCase()
    },
    x: {
      pattern: '[0-9a-zA-Z]',
      negate: '[^0-9a-zA-Z]',
      transform: v => v.toLocaleLowerCase()
    }
  })

function getTokenMap(tokens) {
  const tokenKeys = Object.keys(tokens)
  const tokenMap = {}

  tokenKeys.forEach(key => {
    const entry = tokens[key]
    tokenMap[key] = {
      ...entry,
      regex: new RegExp(entry.pattern)
    }
  })

  return { tokenMap, tokenKeys }
}

function getTokenRegexMask(keys) {
  return new RegExp(
    // oxlint-disable-next-line no-template-curly-in-string
    '\\\\([^.*+?^${}()|([\\]])|([.*+?^${}()|[\\]])|([' +
      keys.join('') +
      '])|(.)',
    'g'
  )
}

const escRegex = /[.*+?^${}()|[\]\\]/g
const DEFAULT_TOKEN_REGEX_MASK = getTokenRegexMask(DEFAULT_TOKEN_MAP_KEYS)
const MARKER = String.fromCodePoint(1)

export const useMaskProps = {
  mask: String,
  reverseFillMask: Boolean,
  fillMask: [Boolean, String],
  unmaskedValue: Boolean,
  maskTokens: Object
}

export default function useMask(props, emit, emitValue, inputRef) {
  let maskMarked,
    maskReplaced,
    computedMask,
    computedUnmask,
    pastedTextStart,
    selectionAnchor

  const tokens = computed(() => {
    if (props.maskTokens === void 0 || props.maskTokens === null) {
      return {
        tokenMap: DEFAULT_TOKEN_MAP,
        tokenRegexMask: DEFAULT_TOKEN_REGEX_MASK
      }
    }

    const { tokenMap: customTokens } = getTokenMap(props.maskTokens)
    const tokenMap = {
      ...DEFAULT_TOKEN_MAP,
      ...customTokens
    }

    return {
      tokenMap,
      tokenRegexMask: getTokenRegexMask(Object.keys(tokenMap))
    }
  })

  const hasMask = ref(null)
  const innerValue = ref(getInitialMaskedValue())

  function getIsTypeText() {
    return (
      props.autogrow ||
      ['textarea', 'text', 'search', 'url', 'tel', 'password'].includes(
        props.type
      )
    )
  }

  watch(() => props.type + props.autogrow, updateMaskInternals)

  watch(
    () => props.mask,
    v => {
      if (v !== void 0) {
        updateMaskValue(innerValue.value, true)
      } else {
        const val = unmaskValue(innerValue.value)
        updateMaskInternals()
        if (props.modelValue !== val) emit('update:modelValue', val)
      }
    }
  )

  watch(
    () => props.fillMask + props.reverseFillMask,
    () => {
      if (hasMask.value) updateMaskValue(innerValue.value, true)
    }
  )

  watch(
    () => props.unmaskedValue,
    () => {
      if (hasMask.value) updateMaskValue(innerValue.value)
    }
  )

  watch(
    () => props.maskTokens,
    () => {
      if (hasMask.value) updateMaskValue(innerValue.value, true)
    },
    { deep: true }
  )

  function getInitialMaskedValue() {
    updateMaskInternals()

    if (hasMask.value) {
      const masked = maskValue(unmaskValue(props.modelValue))

      return props.fillMask !== false ? fillWithMask(masked) : masked
    }

    return props.modelValue
  }

  function getPaddedMaskMarked(size) {
    if (size < maskMarked.length) {
      return maskMarked.slice(-size)
    }

    let pad = '',
      localMaskMarked = maskMarked
    const padPos = localMaskMarked.indexOf(MARKER)

    if (padPos !== -1) {
      for (let i = size - localMaskMarked.length; i > 0; i--) {
        pad += MARKER
      }

      localMaskMarked =
        localMaskMarked.slice(0, padPos) + pad + localMaskMarked.slice(padPos)
    }

    return localMaskMarked
  }

  function updateMaskInternals() {
    hasMask.value =
      props.mask !== void 0 && props.mask.length !== 0 && getIsTypeText()

    if (!hasMask.value) {
      computedUnmask = void 0
      maskMarked = ''
      maskReplaced = ''
      return
    }

    const localComputedMask =
        NAMED_MASKS[props.mask] === void 0
          ? props.mask
          : NAMED_MASKS[props.mask],
      fillChar =
        typeof props.fillMask === 'string' && props.fillMask.length !== 0
          ? props.fillMask.slice(0, 1)
          : '_',
      fillCharEscaped = fillChar.replace(escRegex, String.raw`\$&`),
      unmask = [],
      extract = [],
      mask = []

    let firstMatch = props.reverseFillMask,
      unmaskChar = '',
      negateChar = ''

    localComputedMask.replace(
      tokens.value.tokenRegexMask,
      (_, char1, esc, token, char2) => {
        if (token !== void 0) {
          const c = tokens.value.tokenMap[token]
          mask.push(c)
          negateChar = c.negate
          if (firstMatch) {
            extract.push(
              '(?:' +
                negateChar +
                '+)?(' +
                c.pattern +
                '+)?(?:' +
                negateChar +
                '+)?(' +
                c.pattern +
                '+)?'
            )
            firstMatch = false
          }
          extract.push('(?:' + negateChar + '+)?(' + c.pattern + ')?')
          return
        }

        if (esc !== void 0) {
          unmaskChar = '\\' + (esc === '\\' ? '' : esc)
          mask.push(esc)
        } else {
          const c = char1 !== void 0 ? char1 : char2
          unmaskChar =
            c === '\\'
              ? String.raw`\\\\`
              : c.replace(escRegex, String.raw`\\$&`)
          mask.push(c)
        }

        unmask.push('([^' + unmaskChar + ']+)?' + unmaskChar + '?')
      }
    )

    const unmaskMatcher = new RegExp(
        '^' +
          unmask.join('') +
          '(' +
          (unmaskChar === '' ? '.' : '[^' + unmaskChar + ']') +
          '+)?' +
          (unmaskChar === '' ? '' : '[' + unmaskChar + ']*') +
          '$'
      ),
      extractLast = extract.length - 1,
      extractMatcher = extract.map((re, index) => {
        if (index === 0 && props.reverseFillMask) {
          return new RegExp('^' + fillCharEscaped + '*' + re)
        } else if (index === extractLast) {
          return new RegExp(
            '^' +
              re +
              '(' +
              (negateChar === '' ? '.' : negateChar) +
              '+)?' +
              (props.reverseFillMask ? '$' : fillCharEscaped + '*')
          )
        }

        return new RegExp('^' + re)
      })

    computedMask = mask
    computedUnmask = val => {
      const unmaskMatch = unmaskMatcher.exec(
        props.reverseFillMask ? val : val.slice(0, mask.length + 1)
      )
      if (unmaskMatch !== null) {
        val = unmaskMatch.slice(1).join('')
      }

      const extractMatch = [],
        extractMatcherLength = extractMatcher.length

      for (let i = 0, str = val; i < extractMatcherLength; i++) {
        const m = extractMatcher[i].exec(str)

        if (m === null) {
          break
        }

        str = str.slice(m.shift().length)
        extractMatch.push(...m)
      }
      if (extractMatch.length !== 0) {
        return extractMatch.join('')
      }

      return val
    }
    maskMarked = mask.map(v => (typeof v === 'string' ? v : MARKER)).join('')
    maskReplaced = maskMarked.split(MARKER).join(fillChar)
  }

  function updateMaskValue(rawVal, updateMaskInternalsFlag, inputType) {
    const inp = inputRef.value,
      end = inp?.selectionEnd ?? 0,
      endReverse = inp === null ? 0 : inp.value.length - end,
      unmasked = unmaskValue(rawVal)

    // Update here so unmask uses the original fillChar
    if (updateMaskInternalsFlag === true) updateMaskInternals()

    const preMasked = maskValue(unmasked, updateMaskInternalsFlag),
      masked = props.fillMask !== false ? fillWithMask(preMasked) : preMasked,
      changed = innerValue.value !== masked

    // We want to avoid "flickering" so we set value immediately
    if (inp !== null && inp.value !== masked) inp.value = masked

    if (changed) innerValue.value = masked

    if (inp !== null && document.activeElement === inp) {
      nextTick(() => {
        if (masked === maskReplaced) {
          const cursor = props.reverseFillMask ? maskReplaced.length : 0
          inp.setSelectionRange(cursor, cursor, 'forward')
          return
        }

        if (inputType === 'insertFromPaste' && !props.reverseFillMask) {
          const maxEnd = inp.selectionEnd
          let cursor = end - 1
          // each non-marker char means we move once to right
          for (let i = pastedTextStart; i <= cursor && i < maxEnd; i++) {
            if (maskMarked[i] !== MARKER) {
              cursor++
            }
          }

          moveCursor.right(inp, cursor)
          return
        }

        if (
          ['deleteContentBackward', 'deleteContentForward'].includes(inputType)
        ) {
          const cursor = props.reverseFillMask
            ? end === 0
              ? masked.length > preMasked.length
                ? 1
                : 0
              : Math.max(
                  0,
                  masked.length -
                    (masked === maskReplaced
                      ? 0
                      : Math.min(preMasked.length, endReverse) + 1)
                ) + 1
            : end

          inp.setSelectionRange(cursor, cursor, 'forward')
          return
        }

        if (props.reverseFillMask) {
          if (changed) {
            const cursor = Math.max(
              0,
              masked.length -
                (masked === maskReplaced
                  ? 0
                  : Math.min(preMasked.length, endReverse + 1))
            )

            if (cursor === 1 && end === 1) {
              inp.setSelectionRange(cursor, cursor, 'forward')
            } else {
              moveCursor.rightReverse(inp, cursor)
            }
          } else {
            const cursor = masked.length - endReverse
            inp.setSelectionRange(cursor, cursor, 'backward')
          }
        } else if (changed) {
          const cursor = Math.max(
            0,
            maskMarked.indexOf(MARKER),
            Math.min(preMasked.length, end) - 1
          )
          moveCursor.right(inp, cursor)
        } else {
          const cursor = end - 1
          moveCursor.right(inp, cursor)
        }
      })
    }

    const val = props.unmaskedValue ? unmaskValue(masked) : masked

    if (
      String(props.modelValue) !== val &&
      (props.modelValue !== null || val !== '')
    ) {
      emitValue(val, true)
    }
  }

  function moveCursorForPaste(inp, start, end) {
    const preMasked = maskValue(unmaskValue(inp.value))

    start = Math.max(
      0,
      maskMarked.indexOf(MARKER),
      Math.min(preMasked.length, start)
    )
    pastedTextStart = start

    inp.setSelectionRange(start, end, 'forward')
  }

  const moveCursor = {
    left(inp, cursor) {
      const noMarkBefore = !maskMarked.slice(cursor - 1).includes(MARKER)
      let i = Math.max(0, cursor - 1)

      for (; i >= 0; i--) {
        if (maskMarked[i] === MARKER) {
          cursor = i
          if (noMarkBefore) cursor++
          break
        }
      }

      if (
        i < 0 &&
        maskMarked[cursor] !== void 0 &&
        maskMarked[cursor] !== MARKER
      ) {
        return moveCursor.right(inp, 0)
      }

      if (cursor >= 0) inp.setSelectionRange(cursor, cursor, 'backward')
    },

    right(inp, cursor) {
      const limit = inp.value.length
      let i = Math.min(limit, cursor + 1)

      for (; i <= limit; i++) {
        if (maskMarked[i] === MARKER) {
          cursor = i
          break
        } else if (maskMarked[i - 1] === MARKER) {
          cursor = i
        }
      }

      if (
        i > limit &&
        maskMarked[cursor - 1] !== void 0 &&
        maskMarked[cursor - 1] !== MARKER
      ) {
        return moveCursor.left(inp, limit)
      }

      inp.setSelectionRange(cursor, cursor, 'forward')
    },

    leftReverse(inp, cursor) {
      const localMaskMarked = getPaddedMaskMarked(inp.value.length)
      let i = Math.max(0, cursor - 1)

      for (; i >= 0; i--) {
        if (localMaskMarked[i - 1] === MARKER) {
          cursor = i
          break
        } else if (localMaskMarked[i] === MARKER) {
          cursor = i
          if (i === 0) {
            break
          }
        }
      }

      if (
        i < 0 &&
        localMaskMarked[cursor] !== void 0 &&
        localMaskMarked[cursor] !== MARKER
      ) {
        return moveCursor.rightReverse(inp, 0)
      }

      if (cursor >= 0) inp.setSelectionRange(cursor, cursor, 'backward')
    },

    rightReverse(inp, cursor) {
      const limit = inp.value.length,
        localMaskMarked = getPaddedMaskMarked(limit),
        noMarkBefore = !localMaskMarked.slice(0, cursor + 1).includes(MARKER)
      let i = Math.min(limit, cursor + 1)

      for (; i <= limit; i++) {
        if (localMaskMarked[i - 1] === MARKER) {
          cursor = i
          if (cursor > 0 && noMarkBefore) cursor--
          break
        }
      }

      if (
        i > limit &&
        localMaskMarked[cursor - 1] !== void 0 &&
        localMaskMarked[cursor - 1] !== MARKER
      ) {
        return moveCursor.leftReverse(inp, limit)
      }

      inp.setSelectionRange(cursor, cursor, 'forward')
    }
  }

  function onMaskedClick(e) {
    emit('click', e)

    selectionAnchor = void 0
  }

  function onMaskedKeydown(e) {
    emit('keydown', e)

    if (
      shouldIgnoreKey(e) ||
      e.altKey // let browser handle these
    ) {
      return
    }

    const inp = inputRef.value,
      start = inp.selectionStart,
      end = inp.selectionEnd

    if (!e.shiftKey) {
      selectionAnchor = void 0
    }

    if (e.keyCode === 37 || e.keyCode === 39) {
      // Left / Right
      if (e.shiftKey && selectionAnchor === void 0) {
        selectionAnchor = inp.selectionDirection === 'forward' ? start : end
      }

      const fn =
        moveCursor[
          (e.keyCode === 39 ? 'right' : 'left') +
            (props.reverseFillMask ? 'Reverse' : '')
        ]

      e.preventDefault()
      fn(inp, selectionAnchor === start ? end : start)

      if (e.shiftKey) {
        const cursor = inp.selectionStart
        inp.setSelectionRange(
          Math.min(selectionAnchor, cursor),
          Math.max(selectionAnchor, cursor),
          'forward'
        )
      }
    } else if (
      e.keyCode === 8 && // Backspace
      !props.reverseFillMask &&
      start === end
    ) {
      moveCursor.left(inp, start)
      inp.setSelectionRange(inp.selectionStart, end, 'backward')
    } else if (
      e.keyCode === 46 && // Delete
      props.reverseFillMask &&
      start === end
    ) {
      moveCursor.rightReverse(inp, end)
      inp.setSelectionRange(start, inp.selectionEnd, 'forward')
    }
  }

  function maskValue(val, updateMaskInternalsFlag) {
    if (val === void 0 || val === null || val === '') {
      return ''
    }

    if (props.reverseFillMask) {
      return maskValueReverse(val, updateMaskInternalsFlag)
    }

    const mask = computedMask

    let valIndex = 0,
      output = ''

    for (let maskIndex = 0; maskIndex < mask.length; maskIndex++) {
      const valChar = val[valIndex],
        maskDef = mask[maskIndex]

      if (typeof maskDef === 'string') {
        output += maskDef

        if (updateMaskInternalsFlag === true && valChar === maskDef) {
          valIndex++
        }
      } else if (valChar !== void 0 && maskDef.regex.test(valChar)) {
        output +=
          maskDef.transform !== void 0 ? maskDef.transform(valChar) : valChar
        valIndex++
      } else {
        return output
      }
    }

    return output
  }

  function maskValueReverse(val, updateMaskInternalsFlag) {
    const mask = computedMask,
      firstTokenIndex = maskMarked.indexOf(MARKER)

    let valIndex = val.length - 1,
      output = ''

    for (
      let maskIndex = mask.length - 1;
      maskIndex >= 0 && valIndex !== -1;
      maskIndex--
    ) {
      const maskDef = mask[maskIndex]

      let valChar = val[valIndex]

      if (typeof maskDef === 'string') {
        output = maskDef + output

        if (updateMaskInternalsFlag === true && valChar === maskDef) {
          valIndex--
        }
      } else if (valChar !== void 0 && maskDef.regex.test(valChar)) {
        do {
          output =
            (maskDef.transform !== void 0
              ? maskDef.transform(valChar)
              : valChar) + output
          valIndex--
          valChar = val[valIndex]
        } while (
          // oxlint-disable-next-line no-unmodified-loop-condition
          firstTokenIndex === maskIndex &&
          valChar !== void 0 &&
          maskDef.regex.test(valChar)
        )
      } else {
        return output
      }
    }

    return output
  }

  function unmaskValue(val) {
    return typeof val !== 'string' || computedUnmask === void 0
      ? typeof val === 'number'
        ? computedUnmask(String(val))
        : val
      : computedUnmask(val)
  }

  function fillWithMask(val) {
    if (maskReplaced.length - val.length <= 0) {
      return val
    }

    return props.reverseFillMask && val.length !== 0
      ? maskReplaced.slice(0, -val.length) + val
      : val + maskReplaced.slice(val.length)
  }

  return {
    innerValue,
    hasMask,
    moveCursorForPaste,
    updateMaskValue,
    onMaskedKeydown,
    onMaskedClick
  }
}
