const TOKENS = {
  '#': { pattern: '[\\d]' },

  S: { pattern: '[a-zA-Z]' },
  N: { pattern: '[0-9a-zA-Z]' },

  A: { pattern: '[a-zA-Z]', transform: v => v.toLocaleUpperCase() },
  a: { pattern: '[a-zA-Z]', transform: v => v.toLocaleLowerCase() },

  X: { pattern: '[0-9a-zA-Z]', transform: v => v.toLocaleUpperCase() },
  x: { pattern: '[0-9a-zA-Z]', transform: v => v.toLocaleLowerCase() }
}

Object.keys(TOKENS).forEach(key => {
  TOKENS[key].regex = new RegExp(TOKENS[key].pattern)
})

const
  tokenRegex = new RegExp('\\\\(.)|([' + Object.keys(TOKENS).join('') + '])', 'g'),
  tokenRegexMask = new RegExp('\\\\([^.*+?^${}()|([\\]])|([.*+?^${}()|[\\]])|([' + Object.keys(TOKENS).join('') + '])|(.)', 'g'),
  tokenRegexStrip = new RegExp('\\\\.', 'g'),
  tokenRegexTest = new RegExp('[' + Object.keys(TOKENS).join('') + ']'),
  tokenIsFirst = (mask, maskIndex) => maskIndex === 0 || tokenRegexTest.test(mask.slice(0, maskIndex - 1).replace(tokenRegexStrip, '')) === false

const NAMED_MASKS = {
  date: '####/##/##',
  datetime: '####/##/## ##:##',
  time: '##:##',
  fulltime: '##:##:##',
  phone: '(###) ### - ####',
  card: '#### #### #### ####'
}

const MARKER = String.fromCharCode(1)

export default {
  props: {
    mask: String,
    reverseFillMask: Boolean,
    fillMask: [Boolean, String],
    unmaskedValue: Boolean
  },

  watch: {
    mask (v) {
      if (v !== void 0) {
        this.__updateMaskValue(this.innerValue, true)
      }
      else {
        const val = this.__unmask(this.innerValue)
        this.__updateMaskInternals()
        this.value !== val && this.$emit('input', val)
      }
    },

    fillMask () {
      this.hasMask === true && this.__updateMaskValue(this.innerValue, true)
    },

    reverseFillMask () {
      this.hasMask === true && this.__updateMaskValue(this.innerValue)
    },

    unmaskedValue () {
      this.hasMask === true && this.__updateMaskValue(this.innerValue)
    }
  },

  methods: {
    __getInitialMaskedValue () {
      this.__updateMaskInternals()

      if (this.hasMask === true) {
        const masked = this.__mask(this.__unmask(this.value))

        return this.fillMask !== false
          ? this.__fillWithMask(masked)
          : masked
      }

      return this.value
    },

    __getPaddedMaskMarked (size) {
      if (size < this.maskMarked.length) {
        return this.maskMarked.slice(-size)
      }

      let
        maskMarked = this.maskMarked,
        padPos = maskMarked.indexOf(MARKER),
        pad = ''

      if (padPos > -1) {
        for (let i = size - maskMarked.length; i > 0; i--) {
          pad += MARKER
        }
        maskMarked = maskMarked.slice(0, padPos) + pad + maskMarked.slice(padPos)
      }

      return maskMarked
    },

    __updateMaskInternals () {
      this.hasMask = this.mask !== void 0 && this.mask.length > 0 && ['text', 'search', 'url', 'tel', 'password'].indexOf(this.type) > -1
      this.computedMask = NAMED_MASKS[this.mask] === void 0 ? this.mask : NAMED_MASKS[this.mask]

      if (this.hasMask === false) {
        this.fillChar = void 0
        this.fillCharReplacer = void 0
        this.fillMaskRegex = void 0
        this.maskReplaced = ''
        this.maskMarked = ''
        return
      }

      this.fillChar = typeof this.fillMask === 'string' && this.fillMask.length > 0
        ? this.fillMask.slice(0, 1)
        : '_'

      const fillCharEscaped = this.fillChar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

      this.fillCharReplacer = new RegExp('^' + fillCharEscaped + '*(.*)$')
      this.fillCharMatcher = new RegExp(fillCharEscaped)

      const fillMaskRegex = []
      this.computedMask.replace(tokenRegexMask, (_, char1, esc, token, char2) => {
        if (token !== void 0) {
          fillMaskRegex.push('(?:(' + TOKENS[token].pattern + '*?)|' + fillCharEscaped + '*?)')
        }
        else if (esc !== void 0) {
          fillMaskRegex.push('\\' + esc + '?')
        }
        else {
          fillMaskRegex.push((char1 !== void 0 ? char1 : char2).replace(/[.*+?^${}()|[\]\\]/g, '\\\\$&') + '?')
        }
      })

      this.fillMaskRegex = new RegExp('^' + fillMaskRegex.join('') + '$')

      this.maskMarked = this.computedMask.replace(tokenRegex, (_, char, token) => token !== void 0 ? MARKER : char)
      this.maskReplaced = this.maskMarked.split(MARKER).join(this.fillChar)
    },

    __updateMaskValue (rawVal, updateMaskInternals) {
      const inp = this.$refs.input

      const unmasked = this.__unmask(rawVal)

      // Update here so unmask uses the original fillChar
      updateMaskInternals === true && this.__updateMaskInternals()

      const masked = this.__mask(unmasked)

      let val = this.fillMask !== false
        ? this.__fillWithMask(masked)
        : masked

      const cursor = this.__getCursor(inp)

      if (inp.value !== val) {
        // we want to avoid "flickering"
        // so setting value immediately
        inp.value = val
      }

      if (this.innerValue !== val) {
        this.innerValue = val
      }

      this.$nextTick(() => {
        this.__updateCursor(inp, cursor, val)
      })

      if (this.unmaskedValue === true) {
        val = this.__unmask(val)
      }

      this.value !== val && this.__emitValue(val, true)
    },

    __getCursor (inp) {
      return this.reverseFillMask === true ? inp.value.length - inp.selectionEnd : inp.selectionEnd
    },

    __updateCursor (inp, oldCursor, val) {
      if (this.reverseFillMask === true) {
        const cursor = Math.max(0, val.length - (val === this.maskReplaced ? 0 : oldCursor + 1))
        this.__moveCursorRightReverse(inp, cursor, cursor)
      }
      else {
        if (val === this.maskReplaced) {
          this.__moveCursorLeft(inp, 0, 0)
        }
        else {
          const cursor = Math.max(0, this.maskMarked.indexOf(MARKER), oldCursor - 1)
          this.__moveCursorRight(inp, cursor, cursor)
        }
      }
    },

    __moveCursorLeft (inp, start, end, selection) {
      const noMarkBefore = this.maskMarked.slice(start - 1).indexOf(MARKER) === -1
      let i = Math.max(0, start - 1)
      for (; i >= 0; i--) {
        if (this.maskMarked[i] === MARKER) {
          start = i
          if (noMarkBefore === true) {
            start++
          }
          break
        }
      }

      if (i < 0 && this.maskMarked[start] !== void 0 && this.maskMarked[start] !== MARKER) {
        return this.__moveCursorRight(inp, 0, 0)
      }

      start >= 0 && inp.setSelectionRange(start, selection === true ? end : start, 'backward')
    },

    __moveCursorRight (inp, start, end, selection) {
      const limit = inp.value.length
      let i = Math.min(limit, end + 1)
      for (; i <= limit; i++) {
        if (this.maskMarked[i] === MARKER) {
          end = i
          break
        }
        else if (this.maskMarked[i - 1] === MARKER) {
          end = i
        }
      }

      if (i > limit && this.maskMarked[end - 1] !== void 0 && this.maskMarked[end - 1] !== MARKER) {
        return this.__moveCursorLeft(inp, limit, limit)
      }

      inp.setSelectionRange(selection ? start : end, end, 'forward')
    },

    __moveCursorLeftReverse (inp, start, end, selection) {
      const
        maskMarked = this.__getPaddedMaskMarked(inp.value.length)
      let i = Math.max(0, start - 1)
      for (; i >= 0; i--) {
        if (maskMarked[i - 1] === MARKER) {
          start = i
          break
        }
        else if (i === 0 && maskMarked[0] === MARKER) {
          start = 0
          break
        }
        else if (maskMarked[i] === MARKER) {
          start = i
        }
      }

      if (i < 0 && maskMarked[start] !== void 0 && maskMarked[start] !== MARKER) {
        return this.__moveCursorRightReverse(inp, 0, 0)
      }

      start >= 0 && inp.setSelectionRange(start, selection === true ? end : start, 'backward')
    },

    __moveCursorRightReverse (inp, start, end, selection) {
      const
        limit = inp.value.length,
        maskMarked = this.__getPaddedMaskMarked(limit),
        noMarkBefore = maskMarked.slice(0, end + 1).indexOf(MARKER) === -1
      let i = Math.min(limit, end + 1)
      for (; i <= limit; i++) {
        if (maskMarked[i - 1] === MARKER) {
          end = i
          if (end > 0 && noMarkBefore === true) {
            end--
          }
          break
        }
      }

      if (i > limit && maskMarked[end - 1] !== void 0 && maskMarked[end - 1] !== MARKER) {
        return this.__moveCursorLeftReverse(inp, limit, limit)
      }

      inp.setSelectionRange(selection === true ? start : end, end, 'forward')
    },

    __onMaskedKeydown (e) {
      const
        inp = this.$refs.input,
        start = inp.selectionStart,
        end = inp.selectionEnd

      if (e.keyCode === 37 || e.keyCode === 39) { // Left / Right
        const fn = this['__moveCursor' + (e.keyCode === 39 ? 'Right' : 'Left') + (this.reverseFillMask === true ? 'Reverse' : '')]

        e.preventDefault()
        fn(inp, start, end, e.shiftKey)
      }
      else if (e.keyCode === 8 && this.reverseFillMask !== true && start === end) { // Backspace
        this.__moveCursorLeft(inp, start, end, true)
      }
      else if (e.keyCode === 46 && this.reverseFillMask === true && start === end) { // Delete
        this.__moveCursorRightReverse(inp, start, end, true)
      }

      this.$emit('keydown', e)
    },

    __mask (val) {
      if (val === void 0 || val === null || val === '') { return '' }

      if (this.reverseFillMask === true) {
        return this.__maskReverse(val)
      }

      const mask = this.computedMask

      let maskIndex = 0, valIndex = 0, output = ''

      while (maskIndex < mask.length) {
        const valChar = val[valIndex]

        let
          maskChar = mask[maskIndex],
          maskDef = TOKENS[maskChar]

        if (maskChar === '\\' && maskIndex < mask.length - 1) {
          maskIndex++
          maskChar = mask[maskIndex]
          maskDef = void 0
        }

        if (maskDef === void 0) {
          output += maskChar
          valChar === maskChar && valIndex++
        }
        else if (valChar !== void 0 && maskDef.regex.test(valChar)) {
          output += maskDef.transform !== void 0
            ? maskDef.transform(valChar)
            : valChar
          valIndex++
        }
        else {
          return output
        }

        maskIndex++
      }

      return output
    },

    __maskReverse (val) {
      const mask = this.computedMask

      let maskIndex = mask.length - 1, valIndex = val.length - 1, output = ''

      while (maskIndex >= 0) {
        const maskChar = mask[maskIndex]

        let
          valChar = val[valIndex],
          maskDef = TOKENS[maskChar]

        if (maskIndex > 0 && mask[maskIndex - 1] === '\\') {
          maskIndex--
          maskDef = void 0
        }

        if (maskDef === void 0) {
          output = maskChar + output
          valChar === maskChar && valIndex--
        }
        else if (valChar !== void 0 && maskDef.regex.test(valChar)) {
          const isFirst = tokenIsFirst(mask, maskIndex)
          do {
            output = (maskDef.transform !== void 0 ? maskDef.transform(valChar) : valChar) + output
            valIndex--
            valChar = val[valIndex]
          // eslint-disable-next-line no-unmodified-loop-condition
          } while (isFirst === true && valChar !== void 0 && maskDef.regex.test(valChar))
        }
        else {
          return output
        }

        maskIndex--
      }

      return output
    },

    __unmask (val) {
      if (typeof val !== 'string' || this.fillMaskRegex === void 0) {
        return val
      }

      const
        maskMatch = this.fillMaskRegex.exec(val),
        unmasked = maskMatch === null ? val : maskMatch.slice(1).join('')

      return this.fillCharReplacer === void 0 ? unmasked : this.fillCharReplacer.exec(unmasked)[1]
    },

    __fillWithMask (val) {
      if (this.maskReplaced.length - val.length <= 0) {
        return val
      }

      if (this.reverseFillMask === true && val.length > 0) {
        return this.maskReplaced.slice(0, -val.length) + val
      }

      return val + this.maskReplaced.slice(val.length)
    }
  }
}
