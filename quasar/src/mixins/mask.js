const TOKENS = {
  '#': { pattern: /[\d]/ },

  S: { pattern: /[a-zA-Z]/ },
  N: { pattern: /[0-9a-zA-Z]/ },

  A: { pattern: /[a-zA-Z]/, transform: v => v.toLocaleUpperCase() },
  a: { pattern: /[a-zA-Z]/, transform: v => v.toLocaleLowerCase() },

  X: { pattern: /[0-9a-zA-Z]/, transform: v => v.toLocaleUpperCase() },
  x: { pattern: /[0-9a-zA-Z]/, transform: v => v.toLocaleLowerCase() }
}

const tokenRegex = new RegExp('[' + Object.keys(TOKENS).join('') + ']', 'g')

const NAMED_MASKS = {
  date: '####/##/##',
  datetime: '####/##/## ##:##',
  time: '##:##',
  fulltime: '##:##:##',
  phone: '(###) ### - ####',
  card: '#### #### #### ####'
}

export default {
  props: {
    mask: String,
    fillMask: Boolean,
    unmaskedValue: Boolean
  },

  watch: {
    mask (v) {
      if (v !== void 0) {
        this.__updateMaskValue(this.innerValue)
      }
      else {
        const val = this.__unmask(this.innerValue)
        this.value !== val && this.$emit('input', val)
      }
    },

    fillMask (v) {
      this.hasMask === true && this.__updateMaskValue(this.innerValue)
    },

    unmaskedValue (v) {
      this.hasMask === true && this.__updateMaskValue(this.innerValue)
    }
  },

  computed: {
    hasMask () {
      return this.mask !== void 0 && this.mask.length > 0
    },

    computedMask () {
      return NAMED_MASKS[this.mask] || this.mask
    }
  },

  methods: {
    __getInitialMaskedValue () {
      if (this.mask !== void 0 && this.mask.length > 0) {
        const mask = NAMED_MASKS[this.mask] || this.mask
        const masked = this.__mask(this.__unmask(this.value), mask)

        return this.fillMask === true
          ? this.__fillWithMask(masked, mask)
          : masked
      }

      return this.value
    },

    __updateMaskValue (rawVal) {
      const inp = this.$refs.input

      const unmasked = this.__unmask(rawVal)
      const masked = this.__mask(
        unmasked,
        this.computedMask
      )

      let val = this.fillMask === true
        ? this.__fillWithMask(masked, this.computedMask)
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
        this.__updateCursor(inp, cursor, this.innerValue)
      })

      if (this.unmaskedValue === true) {
        val = this.__unmask(val)
      }

      this.value !== val && this.__emitValue(val, true)
    },

    __getCursor (inp) {
      const index = inp.selectionEnd
      const val = inp.value

      let cursor = 0

      for (let i = 0; i < index; i++) {
        /[\w]/.test(val[i]) && cursor++
      }

      return cursor
    },

    __updateCursor (inp, oldCursor, val) {
      let cursor = 0

      for (let i = 0; i < val.length && oldCursor > 0; i++) {
        /[\w]/.test(val[i]) && oldCursor--
        cursor++
      }

      inp.setSelectionRange(cursor, cursor)
    },

    __onMaskedKeydown (e) {
      const inp = this.$refs.input

      if (e.keyCode === 39) { // right
        let i = inp.selectionEnd
        if (/[\W ]/.test(inp.value[i])) {
          i++
          for (; i < inp.value.length; i++) {
            if (/[\w]/.test(inp.value[i])) {
              i--
              break
            }
          }

          inp.setSelectionRange(i, i)
        }
      }
      else if (e.keyCode === 37) { // left
        let i = inp.selectionEnd - 1
        if (/[\W ]/.test(inp.value[i])) {
          i--
          for (; i > 0; i--) {
            if (/[\w]/.test(inp.value[i])) {
              i += 2
              break
            }
          }

          i >= 0 && inp.setSelectionRange(i, i)
        }
      }

      this.$listeners.keydown !== void 0 && this.$emit('keydown', e)
    },

    __mask (val, mask) {
      if (val === void 0 || val === null || val === '') { return '' }

      let maskIndex = 0, valIndex = 0, output = ''

      while (maskIndex < mask.length) {
        const
          maskChar = mask[maskIndex],
          valChar = val[valIndex],
          maskDef = TOKENS[maskChar]

        if (maskDef === void 0 && valChar === maskChar) {
          output += maskChar
          valIndex++
        }
        else if (maskDef === void 0) {
          output += maskChar
        }
        else if (maskDef !== void 0 && valChar !== void 0 && maskDef.pattern.test(valChar)) {
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

    __unmask (val) {
      return val !== void 0 && val !== null
        ? val.replace(/[\W _]/g, '')
        : val
    },

    __fillWithMask (val, mask) {
      const diff = mask.length - val.length

      return diff > 0
        ? val + mask.slice(val.length).replace(tokenRegex, '_')
        : val
    }
  }
}
