import { computed, getCurrentInstance, h, ref } from 'vue'

import QChip from '../chip/QChip.js'

import useField, {
  fieldValueIsFilled,
  useFieldEmits,
  useFieldState,
  useNonInputFieldProps
} from '../../composables/private.use-field/use-field.js'
import {
  useFormInputNameAttr,
  useFormProps
} from '../../composables/use-form/private.use-form.js'
import useFile, {
  useFileEmits,
  useFileProps
} from '../../composables/private.use-file/use-file.js'
import useFileFormDomProps from '../../composables/private.use-file/use-file-dom-props.js'

import { createComponent } from '../../utils/private.create/create.js'
import { humanStorageSize } from '../../utils/format/format.js'
import { prevent } from '../../utils/event/event.js'
import { injectProp } from '../../utils/private.inject-obj-prop/inject-obj-prop.js'

function onKeydown(e) {
  // prevent form submit if ENTER is pressed
  if (e.keyCode === 13) prevent(e)
}

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/file
 */
/**
 * Field main content
 *
 * @api slot default
 */

/**
 * Prepend inner field; Suggestions: QIcon, QBtn
 *
 * @api slot prepend
 */

/**
 * Append to inner field; Suggestions: QIcon, QBtn
 *
 * @api slot append
 */

/**
 * Prepend outer field; Suggestions: QIcon, QBtn
 *
 * @api slot before
 */

/**
 * Append outer field; Suggestions: QIcon, QBtn
 *
 * @api slot after
 */

/**
 * Slot for label; Used only if 'label-slot' prop is set or the 'label' prop is set; When it is used the text in the 'label' prop is ignored
 *
 * @api slot label
 */

/**
 * Slot for errors; Enabled only if 'bottom-slots' prop is used; Suggestion: <div>
 *
 * @api slot error
 */

/**
 * Slot for hint text; Enabled only if 'bottom-slots' prop is used; Suggestion: <div>
 *
 * @api slot hint
 */

/**
 * Slot for counter text; Enabled only if 'bottom-slots' prop is used; Suggestion: <div>
 *
 * @api slot counter
 */

/**
 * Override default spinner when component is in loading mode; Use in conjunction with 'loading' prop
 *
 * @api slot loading
 */

/**
 * Override default node to render a file from the user picked list
 *
 * @api slot file
 * @scope index {Number} Selection index
 * @scope file {File} File object
 * @scope ref {Component} Reference to the QFile component
 */

/**
 * Override default selection slot; Suggestion: QChip
 *
 * @api slot selected
 * @scope files {Array} Array of File objects
 * @scope ref {Component} Reference to the QFile component
 */
export default createComponent({
  name: 'QFile',

  inheritAttrs: false,

  props: {
    ...useNonInputFieldProps,
    ...useFormProps,
    ...useFileProps,

    /* SSR does not know about File & FileList */
    /**
     * Model of the component; Must be FileList or Array if using 'multiple' prop; Either use this property (along with a listener for 'update:modelValue' event) OR use v-model directive
     *
     * @api prop model-value
     * @extends model-value
     * @syncable
     * @example # v-model="myModel"
     */
    modelValue: __QUASAR_SSR_SERVER__ ? {} : [File, FileList, Array],

    /**
     * Append file(s) to current model rather than replacing them; Has effect only when using 'multiple' mode
     *
     * @api prop append
     * @type {Boolean}
     * @category behavior
     */
    append: Boolean,
    /**
     * Use QChip to show picked files
     *
     * @api prop use-chips
     * @type {Boolean}
     * @category selection
     */
    useChips: Boolean,
    /**
     * Override default selection string, if not using 'file' or 'selected' scoped slots and if not using 'use-chips' prop
     *
     * @api prop display-value
     * @type {Number|String}
     * @category selection
     * @example 'Options: x, y, z'
     */
    displayValue: [String, Number],

    /**
     * @api prop tabindex
     * @extends tabindex
     * @default 0
     */
    tabindex: {
      type: [String, Number],
      default: 0
    },

    /**
     * Label for the counter; The 'counter' prop is necessary to enable this one
     *
     * @api prop counter-label
     * @type {Function}
     * @category behavior
     * @example (totalSize, filesNumber, maxFiles) => `${ filesNumber }${ maxFiles !== void 0 ? ' / ' + maxFiles : '' } (${ totalSize })`
     */
    counterLabel: Function,

    /**
     * Class definitions to be attributed to the underlying selection container
     *
     * @api prop input-class
     * @type {String|Array|Object}
     * @ts-type VueClassProp
     * @category style
     * @example 'my-special-class'
     * @example { 'my-special-class': true }
     */
    inputClass: [Array, String, Object],
    /**
     * Style definitions to be attributed to the underlying selection container
     *
     * @api prop input-style
     * @type {String|Array|Object}
     * @ts-type VueStyleProp
     * @category style
     * @example 'background-color: #ff0000'
     * @example { backgroundColor: '#ff0000' }
     */
    inputStyle: [Array, String, Object]
  },

  emits: [...useFieldEmits, ...useFileEmits],

  setup(props, { slots, emit, attrs }) {
    const { proxy } = getCurrentInstance()

    const state = useFieldState()

    const inputRef = ref(null)
    const dnd = ref(false)
    const nameProp = useFormInputNameAttr(props)

    const { pickFiles, onDragover, onDragleave, processFiles, getDndNode } =
      useFile({
        editable: state.editable,
        dnd,
        getFileInput,
        addFilesToQueue
      })

    const formDomProps = useFileFormDomProps(props)

    const innerValue = computed(() =>
      Object(props.modelValue) === props.modelValue
        ? 'length' in props.modelValue
          ? [...props.modelValue]
          : [props.modelValue]
        : []
    )

    const hasValue = computed(() => fieldValueIsFilled(innerValue.value))

    const selectedString = computed(() =>
      innerValue.value.map(file => file.name).join(', ')
    )

    const totalSize = computed(() =>
      humanStorageSize(
        innerValue.value.reduce((acc, file) => acc + file.size, 0)
      )
    )

    const counterProps = computed(() => ({
      totalSize: totalSize.value,
      filesNumber: innerValue.value.length,
      maxFiles: props.maxFiles
    }))

    const inputAttrs = computed(() => ({
      tabindex: -1,
      type: 'file',
      title: '', // try to remove default tooltip,
      accept: props.accept,
      capture: props.capture,
      name: nameProp.value,
      ...attrs,
      id: state.targetUid.value,
      disabled: !state.editable.value
    }))

    const fieldClass = computed(
      () => 'q-file q-field--auto-height' + (dnd.value ? ' q-file--dnd' : '')
    )

    const isAppending = computed(() => props.multiple && props.append)

    /**
     * Remove file located at specific index in the model
     *
     * @api method removeAtIndex
     * @param {Number} index Index at which to remove selection
     */
    function removeAtIndex(index) {
      const files = [...innerValue.value]
      files.splice(index, 1)
      emitValue(files)
    }

    /**
     * Remove specified file from the model
     *
     * @api method removeFile
     * @param {File} file File to remove (instance of File)
     */
    function removeFile(file) {
      const index = innerValue.value.indexOf(file)
      if (index !== -1) {
        removeAtIndex(index)
      }
    }

    function emitValue(files) {
      emit('update:modelValue', props.multiple ? files : files[0])
    }

    function onKeyup(e) {
      // only on ENTER and SPACE to match native input field
      if (e.keyCode === 13 || e.keyCode === 32) {
        pickFiles(e)
      }
    }

    function getFileInput() {
      return inputRef.value
    }

    function addFilesToQueue(e, fileList) {
      const files = processFiles(
        e,
        fileList,
        innerValue.value,
        isAppending.value
      )
      const fileInput = getFileInput()

      if (fileInput !== void 0 && fileInput !== null) {
        fileInput.value = ''
      }

      // if nothing to do...
      if (files === void 0) return

      // protect against input @change being called in a loop
      // like it happens on Safari, so don't emit same thing:
      if (
        props.multiple
          ? props.modelValue && files.every(f => innerValue.value.includes(f))
          : props.modelValue === files[0]
      ) {
        return
      }

      emitValue(isAppending.value ? [...innerValue.value, ...files] : files)
    }

    function getFiller() {
      return [
        h('input', {
          class: [props.inputClass, 'q-file__filler'],
          style: props.inputStyle
        })
      ]
    }

    function getSelection() {
      if (slots.file !== void 0) {
        return innerValue.value.length === 0
          ? getFiller()
          : innerValue.value.map((file, index) =>
              slots.file({ index, file, ref: this })
            )
      }

      if (slots.selected !== void 0) {
        return innerValue.value.length === 0
          ? getFiller()
          : slots.selected({ files: innerValue.value, ref: this })
      }

      if (props.useChips) {
        return innerValue.value.length === 0
          ? getFiller()
          : innerValue.value.map((file, i) =>
              h(
                QChip,
                {
                  key: 'file-' + i,
                  removable: state.editable.value,
                  dense: true,
                  textColor: props.color,
                  tabindex: props.tabindex,
                  onRemove: () => {
                    removeAtIndex(i)
                  }
                },
                () =>
                  h('span', {
                    class: 'ellipsis',
                    textContent: file.name
                  })
              )
            )
      }

      const textContent =
        props.displayValue !== void 0
          ? props.displayValue
          : selectedString.value

      return textContent.length !== 0
        ? [
            h('div', {
              class: props.inputClass,
              style: props.inputStyle,
              textContent
            })
          ]
        : getFiller()
    }

    function getInput() {
      const data = {
        ref: inputRef,
        ...inputAttrs.value,
        ...formDomProps.value,
        class: 'q-field__input fit absolute-full cursor-pointer',
        onChange: addFilesToQueue
      }

      if (props.multiple) data.multiple = true

      return h('input', data)
    }

    Object.assign(state, {
      fieldClass,
      emitValue,
      hasValue,
      inputRef,
      innerValue,

      floatingLabel: computed(
        () => hasValue.value || fieldValueIsFilled(props.displayValue)
      ),

      computedCounter: computed(() => {
        if (props.counterLabel !== void 0) {
          return props.counterLabel(counterProps.value)
        }

        const max = props.maxFiles
        return `${innerValue.value.length}${max !== void 0 ? ' / ' + max : ''} (${totalSize.value})`
      }),

      getControlChild: () => getDndNode('file'),
      getControl: () => {
        const data = {
          ref: state.targetRef,
          class: 'q-field__native row items-center cursor-pointer',
          tabindex: props.tabindex
        }

        if (state.editable.value) {
          Object.assign(data, { onDragover, onDragleave, onKeydown, onKeyup })
        }

        // oxlint-disable-next-line unicorn/prefer-spread
        return h('div', data, [getInput()].concat(getSelection()))
      }
    })

    // expose public methods
    Object.assign(proxy, {
      removeAtIndex,
      removeFile,
      /**
       * DEPRECATED; Access 'nativeEl' directly; Gets the native input DOM Element
       *
       * @api method getNativeElement
       * @returns {Element} The underlying native input DOM Element
       */
      getNativeElement: () => inputRef.value // deprecated
    })

    injectProp(proxy, 'nativeEl', () => inputRef.value)

    return useField(state)
  }
})
