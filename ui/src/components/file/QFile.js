import { h, ref, computed, getCurrentInstance } from 'vue'

import QChip from '../chip/QChip.js'

import useField, { useFieldState, useFieldProps, useFieldEmits, fieldValueIsFilled } from '../../composables/private/use-field.js'
import { useFormProps, useFormInputNameAttr } from '../../composables/private/use-form.js'
import useFile, { useFileProps, useFileEmits } from '../../composables/private/use-file.js'
import useFileFormDomProps from '../../composables/private/use-file-dom-props.js'

import { createComponent } from '../../utils/private/create.js'
import { humanStorageSize } from '../../utils/format.js'

export default createComponent({
  name: 'QFile',

  inheritAttrs: false,

  props: {
    ...useFieldProps,
    ...useFormProps,
    ...useFileProps,

    /* SSR does not know about File & FileList */
    modelValue: __QUASAR_SSR_SERVER__
      ? {}
      : [ File, FileList, Array ],

    append: Boolean,
    useChips: Boolean,
    displayValue: [ String, Number ],

    tabindex: {
      type: [ String, Number ],
      default: 0
    },

    counterLabel: Function,

    inputClass: [ Array, String, Object ],
    inputStyle: [ Array, String, Object ]
  },

  emits: [
    ...useFieldEmits,
    ...useFileEmits
  ],

  setup (props, { slots, emit, attrs }) {
    const { proxy } = getCurrentInstance()

    const state = useFieldState()

    const inputRef = ref(null)
    const dnd = ref(false)
    const nameProp = useFormInputNameAttr(props)

    const {
      pickFiles,
      onDragover,
      processFiles,
      getDndNode
    } = useFile({ editable: state.editable, dnd, getFileInput, addFilesToQueue })

    const formDomProps = useFileFormDomProps(props)

    const innerValue = computed(() => (
      Object(props.modelValue) === props.modelValue
        ? ('length' in props.modelValue ? Array.from(props.modelValue) : [ props.modelValue ])
        : []
    ))

    const hasValue = computed(() => fieldValueIsFilled(innerValue.value))

    const selectedString = computed(() =>
      innerValue.value
        .map(file => file.name)
        .join(', ')
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
      disabled: state.editable.value !== true
    }))

    const isAppending = computed(() =>
      props.multiple === true && props.append === true
    )

    function removeAtIndex (index) {
      const files = innerValue.value.slice()
      files.splice(index, 1)
      emitValue(files)
    }

    function removeFile (file) {
      const index = innerValue.value.findIndex(file)
      if (index > -1) {
        removeAtIndex(index)
      }
    }

    function emitValue (files) {
      emit('update:modelValue', props.multiple === true ? files : files[ 0 ])
    }

    function onKeyup (e) {
      // only on ENTER
      e.keyCode === 13 && pickFiles(e)
    }

    function getFileInput () {
      return inputRef.value
    }

    function addFilesToQueue (e, fileList) {
      const files = processFiles(e, fileList, innerValue.value, isAppending.value)

      // if nothing to do...
      if (files === void 0) { return }

      // protect against input @change being called in a loop
      // like it happens on Safari, so don't emit same thing:
      if (
        props.multiple === true
          ? props.modelValue && files.every(f => innerValue.value.includes(f))
          : props.modelValue === files[ 0 ]
      ) {
        return
      }

      emitValue(
        isAppending.value === true
          ? innerValue.value.concat(files)
          : files
      )
    }

    function getFiller () {
      return [
        h('input', {
          class: [ props.inputClass, 'q-file__filler' ],
          style: props.inputStyle,
          tabindex: -1
        })
      ]
    }

    function getSelection () {
      if (slots.file !== void 0) {
        return innerValue.value.length === 0
          ? getFiller()
          : innerValue.value.map(
            (file, index) => slots.file({ index, file, ref: this })
          )
      }

      if (slots.selected !== void 0) {
        return innerValue.value.length === 0
          ? getFiller()
          : slots.selected({ files: innerValue.value, ref: this })
      }

      if (props.useChips === true) {
        return innerValue.value.length === 0
          ? getFiller()
          : innerValue.value.map((file, i) => h(QChip, {
            key: 'file-' + i,
            removable: state.editable.value,
            dense: true,
            textColor: props.color,
            tabindex: props.tabindex,
            onRemove: () => { removeAtIndex(i) }
          }, () => h('span', {
            class: 'ellipsis',
            textContent: file.name
          })))
      }

      const textContent = props.displayValue !== void 0
        ? props.displayValue
        : selectedString.value

      return textContent.length > 0
        ? [
            h('div', {
              class: props.inputClass,
              style: props.inputStyle,
              textContent
            })
          ]
        : getFiller()
    }

    function getInput () {
      const data = {
        ref: inputRef,
        ...inputAttrs.value,
        ...formDomProps.value,
        class: 'q-field__input fit absolute-full cursor-pointer',
        onChange: addFilesToQueue
      }

      if (props.multiple === true) {
        data.multiple = true
      }

      return h('input', data)
    }

    Object.assign(state, {
      fieldClass: { value: 'q-file q-field--auto-height' },
      emitValue,
      hasValue,
      inputRef,
      innerValue,

      floatingLabel: computed(() =>
        hasValue.value === true
        || fieldValueIsFilled(props.displayValue)
      ),

      computedCounter: computed(() => {
        if (props.counterLabel !== void 0) {
          return props.counterLabel(counterProps.value)
        }

        const max = props.maxFiles
        return `${ innerValue.value.length }${ max !== void 0 ? ' / ' + max : '' } (${ totalSize.value })`
      }),

      getControlChild: () => getDndNode('file'),
      getControl: () => {
        const data = {
          ref: state.targetRef,
          class: 'q-field__native row items-center cursor-pointer',
          tabindex: props.tabindex
        }

        if (state.editable.value === true) {
          Object.assign(data, { onDragover, onKeyup })
        }

        return h('div', data, [ getInput() ].concat(getSelection()))
      }
    })

    // expose public methods
    Object.assign(proxy, {
      removeAtIndex,
      removeFile,
      getNativeElement: () => inputRef.value
    })

    return useField(state)
  }
})
