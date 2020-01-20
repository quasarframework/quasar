import Vue from 'vue'

import QField from '../field/QField.js'
import QChip from '../chip/QChip.js'

import FileMixin from '../../mixins/file.js'

import { cache } from '../../utils/vm.js'

export default Vue.extend({
  name: 'QFile',

  mixins: [ QField, FileMixin ],

  props: {
    value: [ File, FileList, Array ],

    useChips: Boolean,
    displayValue: [String, Number],

    inputClass: [Array, String, Object],
    inputStyle: [Array, String, Object]
  },

  data () {
    return {
      dnd: false
    }
  },

  computed: {
    fieldClass () {
      return 'q-file q-field--auto-height'
    },

    innerValue () {
      return this.value !== void 0 && this.value !== null
        ? (this.multiple === true ? Array.from(this.value) : [ this.value ])
        : []
    },

    selectedString () {
      return this.innerValue
        .map(file => file.name)
        .join(', ')
    }
  },

  methods: {
    focus () {
      const el = document.activeElement
      if (
        this.$refs.input !== void 0 &&
        this.$refs.input !== el &&
        // IE can have null document.activeElement
        (el === null || el.id !== this.targetUid)
      ) {
        this.$refs.input.focus()
      }
    },

    removeAtIndex (index) {
      const files = this.innerValue.slice()
      files.splice(index, 1)
      this.__emitValue(files)
    },

    removeFile (file) {
      const index = this.innerValue.findIndex(file)
      if (index > -1) {
        this.removeAtIndex(index)
      }
    },

    __emitValue (files) {
      this.$emit('input', this.multiple === true ? files : files[0])
    },

    __addFiles (e, fileList) {
      const files = this.__processFiles(e, fileList)
      files !== void 0 && this.__emitValue(files)
    },

    __getControl (h) {
      const child = [ this.__getInput(h) ]
        .concat(this.__getSelection(h))

      const dnd = this.__getDnd(h, 'file')
      dnd !== void 0 && child.push(dnd)

      return h('div', {
        staticClass: 'q-field__native row items-center cursor-pointer',
        on: cache(this, 'drag', { dragover: this.__onDragOver })
      }, child)
    },

    __getSelection (h) {
      if (this.$scopedSlots.file !== void 0) {
        return this.innerValue.map((file, index) => this.$scopedSlots.file({ index, file, ref: this }))
      }

      if (this.$scopedSlots.selected !== void 0) {
        return this.$scopedSlots.selected({ files: this.innerValue, ref: this })
      }

      if (this.useChips === true) {
        return this.innerValue.map((file, i) => h(QChip, {
          key: 'file-' + i,
          props: {
            removable: this.disable !== true,
            dense: true,
            textColor: this.color,
            tabindex: this.computedTabindex
          },
          on: cache(this, 'rem#' + i, {
            remove: () => { this.removeAtIndex(i) }
          })
        }, [
          h('span', {
            domProps: {
              textContent: file.name
            }
          })
        ]))
      }

      return [
        h('div', {
          style: this.inputStyle,
          class: this.inputClass,
          domProps: {
            textContent: this.displayValue !== void 0
              ? this.displayValue
              : this.selectedString
          }
        })
      ]
    },

    __getInput (h) {
      const data = {
        ref: 'input',
        staticClass: 'q-field__input fit absolute-full cursor-pointer',
        attrs: {
          tabindex: -1,
          type: 'file',
          title: '', // try to remove default tooltip
          accept: this.accept,
          disabled: this.disable === true,
          readonly: this.readonly === true
        },
        on: cache(this, 'input', {
          change: this.__addFiles
        })
      }

      if (this.multiple === true) {
        data.attrs.multiple = true
      }

      return h('input', data)
    }
  }
})
