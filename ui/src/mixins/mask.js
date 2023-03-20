import { shouldIgnoreKey } from '../utils/private/key-composition.js'

// leave NAMED_MASKS at top of file (code referenced from docs)
const NAMED_MASKS = {
  date: '####/##/##',
  datetime: '####/##/## ##:##',
  time: '##:##',
  fulltime: '##:##:##',
  phone: '(###) ### - ####',
  card: '#### #### #### ####'
}

const TOKENS = {
  '#': { pattern: '[\\d]', negate: '[^\\d]' },

  S: { pattern: '[a-zA-Z]', negate: '[^a-zA-Z]' },
  N: { pattern: '[0-9a-zA-Z]', negate: '[^0-9a-zA-Z]' },

  A: { pattern: '[a-zA-Z]', negate: '[^a-zA-Z]', transform: v => v.toLocaleUpperCase() },
  a: { pattern: '[a-zA-Z]', negate: '[^a-zA-Z]', transform: v => v.toLocaleLowerCase() },

  X: { pattern: '[0-9a-zA-Z]', negate: '[^0-9a-zA-Z]', transform: v => v.toLocaleUpperCase() },
  x: { pattern: '[0-9a-zA-Z]', negate: '[^0-9a-zA-Z]', transform: v => v.toLocaleLowerCase() }
}

const KEYS = Object.keys(TOKENS)
KEYS.forEach(key => {
  TOKENS[key].regex = new RegExp(TOKENS[key].pattern)
})

const
  tokenRegexMask = new RegExp('\\\\([^.*+?^${}()|([\\]])|([.*+?^${}()|[\\]])|([' + KEYS.join('') + '])|(.)', 'g'),
  escRegex = /[.*+?^${}()|[\]\\]/g

const MARKER = String.fromCharCode(1)

export default {
  props: {
    mask: String,
    reverseFillMask: Boolean,
    fillMask: [Boolean, String],
    unmaskedValue: Boolean
  },

  watch: {
    type () {
      this.__updateMaskInternals()
    },

    autogrow () {
      this.__updateMaskInternals()
    },

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
      this.hasMask === true && this.__updateMaskValue(this.innerValue, true)
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
        pad = ''
      const
        padPos = maskMarked.indexOf(MARKER)

      if (padPos > -1) {
        for (let i = size - maskMarked.length; i > 0; i--) {
          pad += MARKER
        }

        maskMarked = maskMarked.slice(0, padPos) + pad + maskMarked.slice(padPos)
      }

      return maskMarked
    },

    __updateMaskInternals () {
      this.hasMask = this.mask !== void 0 &&
        this.mask.length > 0 &&
        (this.autogrow === true || ['textarea', 'text', 'search', 'url', 'tel', 'password'].includes(this.type))

      if (this.hasMask === false) {
        this.computedUnmask = void 0
        this.maskMarked = ''
        this.maskReplaced = ''
        return
      }

      const
        computedMask = NAMED_MASKS[this.mask] === void 0
          ? this.mask
          : NAMED_MASKS[this.mask],
        fillChar = typeof this.fillMask === 'string' && this.fillMask.length > 0
          ? this.fillMask.slice(0, 1)
          : '_',
        fillCharEscaped = fillChar.replace(escRegex, '\\$&'),
        unmask = [],
        extract = [],
        mask = []

      let
        firstMatch = this.reverseFillMask === true,
        unmaskChar = '',
        negateChar = ''

      computedMask.replace(tokenRegexMask, (_, char1, esc, token, char2) => {
        if (token !== void 0) {
          const c = TOKENS[token]
          mask.push(c)
          negateChar = c.negate
          if (firstMatch === true) {
            extract.push('(?:' + negateChar + '+)?(' + c.pattern + '+)?(?:' + negateChar + '+)?(' + c.pattern + '+)?')
            firstMatch = false
          }
          extract.push('(?:' + negateChar + '+)?(' + c.pattern + ')?')
        }
        else if (esc !== void 0) {
          unmaskChar = '\\' + (esc === '\\' ? '' : esc)
          mask.push(esc)
          unmask.push('([^' + unmaskChar + ']+)?' + unmaskChar + '?')
        }
        else {
          const c = char1 !== void 0 ? char1 : char2
          unmaskChar = c === '\\' ? '\\\\\\\\' : c.replace(escRegex, '\\\\$&')
          mask.push(c)
          unmask.push('([^' + unmaskChar + ']+)?' + unmaskChar + '?')
        }
      })

      const
        unmaskMatcher = new RegExp(
          '^' +
          unmask.join('') +
          '(' + (unmaskChar === '' ? '.' : '[^' + unmaskChar + ']') + '+)?' +
          (unmaskChar === '' ? '' : '[' + unmaskChar + ']*') + '$'
        ),
        extractLast = extract.length - 1,
        extractMatcher = extract.map((re, index) => {
          if (index === 0 && this.reverseFillMask === true) {
            return new RegExp('^' + fillCharEscaped + '*' + re)
          }
          else if (index === extractLast) {
            return new RegExp(
              '^' + re +
              '(' + (negateChar === '' ? '.' : negateChar) + '+)?' +
              (this.reverseFillMask === true ? '$' : fillCharEscaped + '*')
            )
          }

          return new RegExp('^' + re)
        })

      this.computedMask = mask
      this.computedUnmask = val => {
        const unmaskMatch = unmaskMatcher.exec(this.reverseFillMask === true ? val : val.slice(0, mask.length + 1))
        if (unmaskMatch !== null) {
          val = unmaskMatch.slice(1).join('')
        }

        const
          extractMatch = [],
          extractMatcherLength = extractMatcher.length

        for (let i = 0, str = val; i < extractMatcherLength; i++) {
          const m = extractMatcher[i].exec(str)

          if (m === null) {
            break
          }

          str = str.slice(m.shift().length)
          extractMatch.push(...m)
        }
        if (extractMatch.length > 0) {
          return extractMatch.join('')
        }

        return val
      }
      this.maskMarked = mask.map(v => typeof v === 'string' ? v : MARKER).join('')
      this.maskReplaced = this.maskMarked.split(MARKER).join(fillChar)
    },

    __updateMaskValue (rawVal, updateMaskInternals, inputType) {
      const
        inp = this.$refs.input,
        end = inp.selectionEnd,
        endReverse = inp.value.length - end,
        unmasked = this.__unmask(rawVal)

      // Update here so unmask uses the original fillChar
      updateMaskInternals === true && this.__updateMaskInternals()

      const
        preMasked = this.__mask(unmasked),
        masked = this.fillMask !== false
          ? this.__fillWithMask(preMasked)
          : preMasked,
        changed = this.innerValue !== masked

      // We want to avoid "flickering" so we set value immediately
      inp.value !== masked && (inp.value = masked)

      changed === true && (this.innerValue = masked)

      document.activeElement === inp && this.$nextTick(() => {
        if (masked === this.maskReplaced) {
          const cursor = this.reverseFillMask === true ? this.maskReplaced.length : 0
          inp.setSelectionRange(cursor, cursor, 'forward')

          return
        }

        if (inputType === 'insertFromPaste' && this.reverseFillMask !== true) {
          const maxEnd = inp.selectionEnd
          let cursor = end - 1
          // each non-marker char means we move once to right
          for (let i = this.__pastedTextStart; i <= cursor && i < maxEnd; i++) {
            if (this.maskMarked[i] !== MARKER) {
              cursor++
            }
          }
          this.__moveCursorRight(inp, cursor)

          return
        }

        if (['deleteContentBackward', 'deleteContentForward'].indexOf(inputType) > -1) {
          const cursor = this.reverseFillMask === true
            ? (
              end === 0
                ? (masked.length > preMasked.length ? 1 : 0)
                : Math.max(0, masked.length - (masked === this.maskReplaced ? 0 : Math.min(preMasked.length, endReverse) + 1)) + 1
            )
            : end
          inp.setSelectionRange(cursor, cursor, 'forward')

          return
        }

        if (this.reverseFillMask === true) {
          if (changed === true) {
            const cursor = Math.max(0, masked.length - (masked === this.maskReplaced ? 0 : Math.min(preMasked.length, endReverse + 1)))

            if (cursor === 1 && end === 1) {
              inp.setSelectionRange(cursor, cursor, 'forward')
            }
            else {
              this.__moveCursorRightReverse(inp, cursor)
            }
          }
          else {
            const cursor = masked.length - endReverse
            inp.setSelectionRange(cursor, cursor, 'backward')
          }
        }
        else {
          if (changed === true) {
            const cursor = Math.max(0, this.maskMarked.indexOf(MARKER), Math.min(preMasked.length, end) - 1)
            this.__moveCursorRight(inp, cursor)
          }
          else {
            const cursor = end - 1
            this.__moveCursorRight(inp, cursor)
          }
        }
      })

      const val = this.unmaskedValue === true
        ? this.__unmask(masked)
        : masked

      String(this.value) !== val && this.__emitValue(val, true)
    },

    __moveCursorForPaste (inp, start, end) {
      const preMasked = this.__mask(this.__unmask(inp.value))

      start = Math.max(0, this.maskMarked.indexOf(MARKER), Math.min(preMasked.length, start))
      this.__pastedTextStart = start

      inp.setSelectionRange(start, end, 'forward')
    },

    __moveCursorLeft (inp, cursor) {
      const noMarkBefore = this.maskMarked.slice(cursor - 1).indexOf(MARKER) === -1
      let i = Math.max(0, cursor - 1)

      for (; i >= 0; i--) {
        if (this.maskMarked[i] === MARKER) {
          cursor = i
          noMarkBefore === true && cursor++
          break
        }
      }

      if (
        i < 0 &&
        this.maskMarked[cursor] !== void 0 &&
        this.maskMarked[cursor] !== MARKER
      ) {
        return this.__moveCursorRight(inp, 0)
      }

      cursor >= 0 && inp.setSelectionRange(cursor, cursor, 'backward')
    },

    __moveCursorRight (inp, cursor) {
      const limit = inp.value.length
      let i = Math.min(limit, cursor + 1)

      for (; i <= limit; i++) {
        if (this.maskMarked[i] === MARKER) {
          cursor = i
          break
        }
        else if (this.maskMarked[i - 1] === MARKER) {
          cursor = i
        }
      }

      if (
        i > limit &&
        this.maskMarked[cursor - 1] !== void 0 &&
        this.maskMarked[cursor - 1] !== MARKER
      ) {
        return this.__moveCursorLeft(inp, limit)
      }

      inp.setSelectionRange(cursor, cursor, 'forward')
    },

    __moveCursorLeftReverse (inp, cursor) {
      const maskMarked = this.__getPaddedMaskMarked(inp.value.length)
      let i = Math.max(0, cursor - 1)

      for (; i >= 0; i--) {
        if (maskMarked[i - 1] === MARKER) {
          cursor = i
          break
        }
        else if (maskMarked[i] === MARKER) {
          cursor = i
          if (i === 0) {
            break
          }
        }
      }

      if (
        i < 0 &&
        maskMarked[cursor] !== void 0 &&
        maskMarked[cursor] !== MARKER
      ) {
        return this.__moveCursorRightReverse(inp, 0)
      }

      cursor >= 0 && inp.setSelectionRange(cursor, cursor, 'backward')
    },

    __moveCursorRightReverse (inp, cursor) {
      const
        limit = inp.value.length,
        maskMarked = this.__getPaddedMaskMarked(limit),
        noMarkBefore = maskMarked.slice(0, cursor + 1).indexOf(MARKER) === -1
      let i = Math.min(limit, cursor + 1)

      for (; i <= limit; i++) {
        if (maskMarked[i - 1] === MARKER) {
          cursor = i
          cursor > 0 && noMarkBefore === true && cursor--
          break
        }
      }

      if (
        i > limit &&
        maskMarked[cursor - 1] !== void 0 &&
        maskMarked[cursor - 1] !== MARKER
      ) {
        return this.__moveCursorLeftReverse(inp, limit)
      }

      inp.setSelectionRange(cursor, cursor, 'forward')
    },

    __onMaskedClick (e) {
      this.qListeners.click !== void 0 && this.$emit('click', e)

      this.__selectionAnchor = void 0
    },

    __onMaskedKeydown (e) {
      this.qListeners.keydown !== void 0 && this.$emit('keydown', e)

      if (shouldIgnoreKey(e) === true) {
        return
      }

      const
        inp = this.$refs.input,
        start = inp.selectionStart,
        end = inp.selectionEnd

      if (!e.shiftKey) {
        this.__selectionAnchor = void 0
      }

      if (e.keyCode === 37 || e.keyCode === 39) { // Left / Right
        if (e.shiftKey && this.__selectionAnchor === void 0) {
          this.__selectionAnchor = inp.selectionDirection === 'forward' ? start : end
        }

        const fn = this['__moveCursor' + (e.keyCode === 39 ? 'Right' : 'Left') + (this.reverseFillMask === true ? 'Reverse' : '')]

        e.preventDefault()
        fn(inp, this.__selectionAnchor === start ? end : start)

        if (e.shiftKey) {
          const anchor = this.__selectionAnchor
          const cursor = inp.selectionStart
          inp.setSelectionRange(Math.min(anchor, cursor), Math.max(anchor, cursor), 'forward')
        }
      }
      else if (
        e.keyCode === 8 && // Backspace
        this.reverseFillMask !== true &&
        start === end
      ) {
        this.__moveCursorLeft(inp, start)
        inp.setSelectionRange(inp.selectionStart, end, 'backward')
      }
      else if (
        e.keyCode === 46 && // Delete
        this.reverseFillMask === true &&
        start === end
      ) {
        this.__moveCursorRightReverse(inp, end)
        inp.setSelectionRange(start, inp.selectionEnd, 'forward')
      }

      this.$emit('keydown', e)
    },

    __mask (val) {
      if (val === void 0 || val === null || val === '') { return '' }

      if (this.reverseFillMask === true) {
        return this.__maskReverse(val)
      }

      const mask = this.computedMask

      let valIndex = 0, output = ''

      for (let maskIndex = 0; maskIndex < mask.length; maskIndex++) {
        const
          valChar = val[valIndex],
          maskDef = mask[maskIndex]

        if (typeof maskDef === 'string') {
          output += maskDef
          valChar === maskDef && valIndex++
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
      }

      return output
    },

    __maskReverse (val) {
      const
        mask = this.computedMask,
        firstTokenIndex = this.maskMarked.indexOf(MARKER)

      let valIndex = val.length - 1, output = ''

      for (let maskIndex = mask.length - 1; maskIndex >= 0 && valIndex > -1; maskIndex--) {
        const maskDef = mask[maskIndex]

        let valChar = val[valIndex]

        if (typeof maskDef === 'string') {
          output = maskDef + output
          valChar === maskDef && valIndex--
        }
        else if (valChar !== void 0 && maskDef.regex.test(valChar)) {
          do {
            output = (maskDef.transform !== void 0 ? maskDef.transform(valChar) : valChar) + output
            valIndex--
            valChar = val[valIndex]
          // eslint-disable-next-line no-unmodified-loop-condition
          } while (firstTokenIndex === maskIndex && valChar !== void 0 && maskDef.regex.test(valChar))
        }
        else {
          return output
        }
      }

      return output
    },

    __unmask (val) {
      return typeof val !== 'string' || this.computedUnmask === void 0
        ? (typeof val === 'number' ? this.computedUnmask('' + val) : val)
        : this.computedUnmask(val)
    },

    __fillWithMask (val) {
      if (this.maskReplaced.length - val.length <= 0) {
        return val
      }

      return this.reverseFillMask === true && val.length > 0
        ? this.maskReplaced.slice(0, -val.length) + val
        : val + this.maskReplaced.slice(val.length)
    }
  }
}
