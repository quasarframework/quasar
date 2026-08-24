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

// allocation-free equivalents of the ASCII-only built-in token patterns;
// any other pattern falls back to the RegExp built from it
const patternTesters = {
  '[\\d]': char => {
    const code = char.codePointAt(0)
    return code > 47 && code < 58
  },
  '[a-zA-Z]': char => {
    const code = char.codePointAt(0)
    return (code > 64 && code < 91) || (code > 96 && code < 123)
  },
  '[0-9a-zA-Z]': char => {
    const code = char.codePointAt(0)
    return (
      (code > 47 && code < 58) ||
      (code > 64 && code < 91) ||
      (code > 96 && code < 123)
    )
  }
}

const { tokenMap: DEFAULT_TOKEN_MAP, tokenKeys: DEFAULT_TOKEN_MAP_KEYS } =
  /*#__PURE__*/ getTokenMap({
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
    let test

    if (Object.hasOwn(patternTesters, entry.pattern)) {
      test = patternTesters[entry.pattern]
    } else {
      const regex = new RegExp(entry.pattern)
      test = char => regex.test(char)
    }

    tokenMap[key] = { ...entry, test }
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

// input event types for which the new value is the previous masked value
// with one contiguous user edit applied, so it can be unmasked by diffing
// against that previous value (see unmaskEditValue); everything else
// (paste, drop, autofill, IME composition, programmatic updates) may carry
// an arbitrary — possibly fully masked — string and goes through unmaskValue
const EDIT_INPUT_TYPES = [
  'insertText',
  'deleteContentBackward',
  'deleteContentForward',
  'deleteWordBackward',
  'deleteWordForward',
  'deleteByCut'
]

const escRegex = /[.*+?^${}()|[\]\\]/g
const DEFAULT_TOKEN_REGEX_MASK = /*#__PURE__*/ getTokenRegexMask(
  DEFAULT_TOKEN_MAP_KEYS
)
const MARKER = String.fromCodePoint(1)

export const useMaskProps = {
  mask: String,
  reverseFillMask: Boolean,
  fillMask: [Boolean, String],
  unmaskedValue: Boolean,
  maskTokens: Object
}

export default function useMask(
  props,
  emit,
  emitValue,
  inputRef,
  cancelPendingValueEmission
) {
  let maskMarked,
    maskReplaced,
    computedMask,
    computedUnmask,
    pastedTextStart,
    selectionAnchor,
    // length innerValue had before fillWithMask padded it; the padded
    // positions cannot be recognized by looking at the rendered value,
    // since a fill char may be indistinguishable from a data char
    // (fill-mask="0" against a "#" token) -- #18523
    innerValueDataLen

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
        // hasMask still describes the OLD state here; when it was set,
        // innerValue may carry fill padding that holds no data
        const val = unmaskValue(
          hasMask.value
            ? stripFillPadding(innerValue.value, innerValueDataLen)
            : innerValue.value
        )
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

      innerValueDataLen = masked.length
      return props.fillMask !== false ? fillWithMask(masked) : masked
    }

    innerValueDataLen = 0
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
          // the separator class these entries skip over is only known once
          // every token in the mask has been seen, so keep the descriptors
          // and build the sources below
          if (firstMatch) {
            extract.push({ c, overflow: true })
            firstMatch = false
          }
          extract.push({ c })
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

    const maskTokenPatterns = [
        ...new Set(
          mask.filter(v => typeof v !== 'string').map(({ pattern }) => pattern)
        )
      ],
      unmaskMatcher = new RegExp(
        '^' +
          unmask.join('') +
          '(' +
          (unmaskChar === '' ? '.' : '[^' + unmaskChar + ']') +
          '+)?' +
          (unmaskChar === '' ? '' : '[' + unmaskChar + ']*') +
          '$'
      ),
      extractLast = extract.length - 1,
      // What the entries below skip over to reach their token: the mask's
      // own separators. A token's negate class is the wrong tool once the
      // mask mixes token TYPES, because it also matches the data of every
      // other type -- "[^a-zA-Z]" over "AA-##" swallows the digits, and
      // the reverse-fill overflow entry runs before the "#" entries ever
      // see them, so "ab12" unmasked to "ab" and rendered as nothing.
      // A separator is a char no token in the mask accepts; with a single
      // token type that is exactly the negate class, so those masks keep
      // the cheaper form and the identical regex source
      separator =
        maskTokenPatterns.length === 1
          ? negateChar
          : '(?:' +
            maskTokenPatterns.map(pattern => '(?!' + pattern + ')').join('') +
            String.raw`[\s\S])`,
      getExtractSource = ({ c, overflow }) =>
        overflow === true
          ? '(?:' +
            separator +
            '+)?(' +
            c.pattern +
            '+)?(?:' +
            separator +
            '+)?(' +
            c.pattern +
            '+)?'
          : '(?:' + separator + '+)?(' + c.pattern + ')?',
      extractMatcher = extract.map((entry, index) => {
        const re = getExtractSource(entry)

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

  // Builds the "does position i of `str` hold real data?" test for a
  // rendered masked value whose pre-fill length was `dataLen`; hoists the
  // per-value work out of the caller's loop. Walks the CURRENT internals.
  //
  // A position holds data when it sits in a mask slot, its own token
  // accepts the char, and fillWithMask did not pad it. That last check
  // cannot be replaced by testing the char: a fill char passes its own
  // token whenever the two agree (fill-mask="0" against "#"), and would
  // then be harvested as data -- growing the value by one fill char per
  // keystroke (#18523). Only `dataLen` marks the boundary reliably.
  // A padded reverse position with no token to check against stays data
  function getDataCharTester(str, dataLen) {
    const strLen = str.length,
      localMaskMarked = props.reverseFillMask
        ? getPaddedMaskMarked(strLen)
        : maskMarked,
      defOffset = props.reverseFillMask ? computedMask.length - strLen : 0,
      // fillWithMask appends the padding, or prepends it when reverse filling
      fillFrom = props.reverseFillMask ? 0 : Math.min(dataLen, strLen),
      fillTo = props.reverseFillMask ? strLen - dataLen : strLen

    return i => {
      if (localMaskMarked[i] !== MARKER || (i >= fillFrom && i < fillTo)) {
        return false
      }

      const maskDef = computedMask[defOffset + i]
      return maskDef === void 0 || typeof maskDef === 'string'
        ? true
        : maskDef.test(str[i])
    }
  }

  // counts the chars of `str` up to `position` that hold real data
  function countDataChars(str, position, dataLen) {
    const isDataChar = getDataCharTester(str, dataLen)

    let count = 0
    for (let i = 0; i < position; i++) {
      if (isDataChar(i)) {
        count++
      }
    }

    return count
  }

  function updateMaskValue(rawVal, updateMaskInternalsFlag, inputType) {
    const inp = inputRef.value,
      end = inp?.selectionEnd ?? 0,
      endReverse = inp === null ? 0 : inp.value.length - end,
      unmasked =
        updateMaskInternalsFlag !== true &&
        typeof innerValue.value === 'string' &&
        EDIT_INPUT_TYPES.includes(inputType)
          ? unmaskEditValue(
              innerValue.value,
              innerValueDataLen,
              rawVal,
              inputType
            )
          : unmaskValue(rawVal)

    // An internals rebuild (mask/fill props changed) can shift the layout
    // arbitrarily, so the caret cannot keep its raw offset; remember how
    // many data chars sit before it in the OLD layout (#7777). Counting
    // data chars rather than raw slots also neutralizes the caret's
    // transient jump to the end of the fill region: the fill chars there
    // fail their token test and do not count.
    // (maskMarked still holds the OLD layout here; when it is empty the
    // control was not masked before, so there is nothing to re-anchor to)
    let dataBeforeCaret
    if (
      updateMaskInternalsFlag === true &&
      inp !== null &&
      maskMarked.length !== 0
    ) {
      dataBeforeCaret = countDataChars(inp.value, end, innerValueDataLen)
    }

    // Update here so unmask uses the original fillChar
    if (updateMaskInternalsFlag === true) updateMaskInternals()

    const preMasked = maskValue(unmasked, updateMaskInternalsFlag),
      masked = props.fillMask !== false ? fillWithMask(preMasked) : preMasked,
      maskedDataLen = preMasked.length,
      changed = innerValue.value !== masked,
      // Whether the edit reached the DATA, which is what the caret has to
      // follow. `changed` only reports that the rendered string moved, and
      // a fill char that doubles as a valid data char keeps the render
      // identical while the data grows (fill-mask="0" over "###-##" renders
      // "000-00" whether it holds no data or five zeros); the caret then
      // took the "nothing happened" path and stayed put, so the next char
      // landed in front of the one just typed, "09" arriving as "90".
      // Same render plus same data length means the same data, so the
      // length is enough to tell the two apart (#18523)
      dataChanged = changed || maskedDataLen !== innerValueDataLen

    innerValueDataLen = maskedDataLen

    // "the field holds no data", the state the caret logic below resets to.
    // Comparing the render against maskReplaced only approximates it: a
    // value whose data chars all equal the fill char renders identically to
    // the empty state (fill-mask="0" over "###-##" renders "000-00" either
    // way), which parked the caret at 0 on every "0" typed (#18523)
    const rendersEmpty = props.fillMask !== false && maskedDataLen === 0

    // We want to avoid "flickering" so we set value immediately
    if (inp !== null && inp.value !== masked) inp.value = masked

    if (changed) innerValue.value = masked

    if (inp !== null && document.activeElement === inp) {
      nextTick(() => {
        if (rendersEmpty) {
          const cursor = props.reverseFillMask ? maskReplaced.length : 0
          inp.setSelectionRange(cursor, cursor, 'forward')
          return
        }

        if (dataBeforeCaret !== void 0) {
          // re-anchor the caret after the same number of data chars it had
          // before the rebuild; its old raw offset points at an arbitrary
          // spot of the new layout, which scrambled the chars typed next
          let cursor = 0,
            found = 0
          while (cursor < masked.length && found < dataBeforeCaret) {
            found = countDataChars(masked, cursor + 1, maskedDataLen)
            cursor++
          }

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
                    (rendersEmpty
                      ? 0
                      : Math.min(preMasked.length, endReverse) + 1)
                ) + 1
            : end

          inp.setSelectionRange(cursor, cursor, 'forward')
          return
        }

        if (props.reverseFillMask) {
          if (dataChanged) {
            const cursor = Math.max(
              0,
              masked.length -
                (rendersEmpty ? 0 : Math.min(preMasked.length, endReverse + 1))
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
        } else if (dataChanged) {
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

    // unmask the value BEFORE fillWithMask padded it: the padding carries
    // no data, and unmaskValue cannot drop it on its own once a fill char
    // satisfies a token (fill-mask="0" against "#" reported "1" as
    // "10000"). Re-unmasking rather than reusing `unmasked` keeps the
    // token transforms and the overflow truncation maskValue applied
    const val = props.unmaskedValue ? unmaskValue(preMasked) : masked

    if (
      String(props.modelValue) !== val &&
      (props.modelValue !== null || val !== '')
    ) {
      emitValue(val, true)
    } else if (cancelPendingValueEmission !== void 0) {
      // the displayed value matches the model again, so a debounced
      // emission of an intermediate state still in flight is stale and
      // must not fire (#17568)
      cancelPendingValueEmission()
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
      e.defaultPrevented ||
      e.altKey || // let browser handle these
      shouldIgnoreKey(e)
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
      } else if (valChar !== void 0 && maskDef.test(valChar)) {
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
      } else if (valChar !== void 0 && maskDef.test(valChar)) {
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
          maskDef.test(valChar)
        )
      } else {
        return output
      }
    }

    return output
  }

  // Unmasks the result of a single contiguous user edit (EDIT_INPUT_TYPES)
  // by diffing it against the previously rendered masked value, whose layout
  // is known exactly through maskMarked. Data chars that happen to equal a
  // mask literal are therefore never mistaken for the literal itself, which
  // the positional guesswork in unmaskValue cannot avoid (#15624, #18051)
  function unmaskEditValue(prev, prevDataLen, val, inputType) {
    const prevLen = prev.length,
      valLen = val.length,
      minLen = Math.min(prevLen, valLen)

    let start = 0
    while (start < minLen && prev[start] === val[start]) {
      start++
    }

    let end = 0
    while (
      end < minLen - start &&
      prev[prevLen - 1 - end] === val[valLen - 1 - end]
    ) {
      end++
    }

    const dataAt = getDataCharTester(prev, prevDataLen)

    let before = '',
      after = ''

    for (let i = 0; i < start; i++) {
      if (dataAt(i)) {
        before += prev[i]
      }
    }

    for (let i = prevLen - end; i < prevLen; i++) {
      if (dataAt(i)) {
        after += prev[i]
      }
    }

    let inserted = ''
    const rawInserted = val.slice(start, valLen - end)

    if (rawInserted.length !== 0) {
      if (props.reverseFillMask) {
        // right-aligned content has no fixed slot for new chars;
        // keep the ones some token accepts
        for (const char of rawInserted) {
          if (
            computedMask.some(
              maskDef => typeof maskDef !== 'string' && maskDef.test(char)
            )
          ) {
            inserted += char
          }
        }
      } else {
        // data fills the token slots in order, so the insertion continues
        // at the slot right after the data preceding it
        const tokenDefs = computedMask.filter(
          maskDef => typeof maskDef !== 'string'
        )
        let slot = before.length

        for (const char of rawInserted) {
          if (tokenDefs[slot] !== void 0 && tokenDefs[slot].test(char)) {
            inserted += char
            slot++
          }
        }
      }
    } else if (!props.reverseFillMask && start + end < prevLen) {
      // A pure deletion. When the deleted chunk held no data chars (only
      // mask literals), remasking would restore them and turn the edit into
      // a silent no-op with a drifting caret. Soft keyboards (iOS) do not
      // reliably go through the keydown hook that pre-selects across
      // literals (#17639), so compensate here by dropping the data char
      // adjacent to the deletion point instead
      let deletedData = false
      for (let i = start; i < prevLen - end; i++) {
        if (dataAt(i)) {
          deletedData = true
          break
        }
      }

      if (!deletedData) {
        if (inputType === 'deleteContentForward') {
          after = after.slice(1)
        } else {
          before = before.slice(0, -1)
        }
      }
    }

    return before + inserted + after
  }

  function unmaskValue(val) {
    return typeof val !== 'string' || computedUnmask === void 0
      ? typeof val === 'number'
        ? computedUnmask(String(val))
        : val
      : computedUnmask(val)
  }

  // undoes fillWithMask: keeps only the `dataLen` chars the value had
  // before it was padded. The padding cannot be recognized by looking at
  // the chars, since a fill char may satisfy a token itself (#18523)
  function stripFillPadding(str, dataLen) {
    if (dataLen >= str.length) {
      return str
    }

    return props.reverseFillMask
      ? str.slice(str.length - dataLen)
      : str.slice(0, dataLen)
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
