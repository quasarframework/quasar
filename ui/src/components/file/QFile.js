import Vue from 'vue'

import QField from '../field/QField.js'
import QChip from '../chip/QChip.js'

import FileMixin from '../../mixins/file.js'

import { isSSR } from '../../plugins/Platform'
import { humanStorageSize } from '../../utils/format.js'
import { cache } from '../../utils/vm.js'

export default Vue.extend({
  name: 'QFile',

  mixins: [ QField, FileMixin ],

  props: {
    /* SSR does not know about File & FileList */
    value: isSSR === true
      ? {}
      : [ File, FileList, Array ],

    useChips: Boolean,
    displayValue: [ String, Number ],
    maxFiles: [ Number, String ],

    tabindex: {
      type: [String, Number],
      default: 0
    },

    counterLabel: Function,

    inputClass: [ Array, String, Object ],
    inputStyle: [ Array, String, Object ]
  },

  data () {
    return {
      dnd: false
    }
  },

  watch: {
    value (val) {
      if (val === void 0 || val === null) {
        this.$refs.input.value = null
      }
    }
  },

  computed: {
    innerValue () {
      return this.value !== void 0 && this.value !== null
        ? (this.multiple === true ? Array.from(this.value) : [ this.value ])
        : []
    },

    selectedString () {
      return this.innerValue
        .map(file => file.name)
        .join(', ')
    },

    totalSize () {
      return humanStorageSize(
        this.innerValue.reduce((acc, file) => acc + file.size, 0)
      )
    },

    counterProps () {
      return {
        totalSize: this.totalSize,
        filesNumber: this.innerValue.length,
        maxFiles: this.maxFiles
      }
    },

    computedCounter () {
      if (this.counterLabel !== void 0) {
        return this.counterLabel(this.counterProps)
      }

      const max = this.maxFiles
      return `${this.innerValue.length}${max !== void 0 ? ' / ' + max : ''} (${this.totalSize})`
    }
  },

  methods: {
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

    __onKeyup (e) {
      // only on ENTER
      e.keyCode === 13 && this.pickFiles(e)
    },

    __getFileInput () {
      return this.$refs.input
    },

    __addFiles (e, fileList) {
      const files = this.__processFiles(e, fileList)

      files !== void 0 && this.__emitValue(
        this.maxFiles !== void 0
          ? files.slice(0, parseInt(this.maxFiles, 10))
          : files
      )
    },

    __getControl (h) {
      const data = {
        ref: 'target',
        staticClass: 'q-field__native row items-center cursor-pointer',
        attrs: {
          tabindex: this.tabindex
        }
      }

      if (this.editable === true) {
        data.on = cache(this, 'native', {
          dragover: this.__onDragOver,
          keyup: this.__onKeyup
        })
      }

      return h('div', data, [ this.__getInput(h) ].concat(this.__getSelection(h)))
    },

    __getControlChild (h) {
      return this.__getDnd(h, 'file')
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
            removable: this.editable,
            dense: true,
            textColor: this.color,
            tabindex: this.tabindex
          },
          on: cache(this, 'rem#' + i, {
            remove: () => { this.removeAtIndex(i) }
          })
        }, [
          h('span', {
            staticClass: 'ellipsis',
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
          id: this.targetUid,
          tabindex: -1,
          type: 'file',
          title: '', // try to remove default tooltip,
          accept: this.accept,
          ...this.$attrs,
          disabled: this.editable !== true
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
  },

  created () {
    this.fieldClass = 'q-file q-field--auto-height'
    this.type = 'file' // necessary for QField's clearable
  }
})
