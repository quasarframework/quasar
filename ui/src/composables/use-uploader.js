import { h, ref, isRef, computed, watch, provide, onBeforeUnmount, getCurrentInstance } from 'vue'

import QBtn from '../components/btn/QBtn.js'
import QIcon from '../components/icon/QIcon.js'
import QSpinner from '../components/spinner/QSpinner.js'
import QCircularProgress from '../components/circular-progress/QCircularProgress.js'

import useQuasar from './use-quasar.js'
import useDark, { useDarkProps } from './private/use-dark.js'
import useFile, { useFileProps, useFileEmits } from './private/use-file.js'

import { stop } from '../utils/event.js'
import { humanStorageSize } from '../utils/format.js'
import { uploaderKey } from '../utils/symbols.js'

function getProgressLabel (p) {
  return (p * 100).toFixed(2) + '%'
}

const props = {
  ...useDarkProps,
  ...useFileProps,

  label: String,

  color: String,
  textColor: String,

  square: Boolean,
  flat: Boolean,
  bordered: Boolean,

  noThumbnails: Boolean,
  autoUpload: Boolean,
  hideUploadBtn: Boolean,

  disable: Boolean,
  readonly: Boolean
}

const emits = [
  ...useFileEmits,
  'start', 'finish', 'added', 'removed'
]

function getState () {
  const vm = getCurrentInstance()

  function updateFileStatus (file, status, uploadedSize) {
    file.__status = status

    if (status === 'idle') {
      file.__uploaded = 0
      file.__progress = 0
      file.__sizeLabel = humanStorageSize(file.size)
      file.__progressLabel = '0.00%'
      return
    }
    if (status === 'failed') {
      vm.proxy.$forceUpdate()
      return
    }

    file.__uploaded = status === 'uploaded'
      ? file.size
      : uploadedSize

    file.__progress = status === 'uploaded'
      ? 1
      : Math.min(0.9999, file.__uploaded / file.size)

    file.__progressLabel = getProgressLabel(file.__progress)
    vm.proxy.$forceUpdate()
  }

  return {
    queuedFiles: ref([]),
    uploadedFiles: ref([]),
    uploadedSize: ref(0),

    updateFileStatus
  }
}

function getRender (props, slots, emit, state) {
  const vm = getCurrentInstance()
  const $q = useQuasar()
  const { isDark } = useDark(props, $q)

  const uploadSize = ref(0)
  const editable = computed(() => props.disable !== true && props.readonly !== true)

  if (state.isBusy === void 0) {
    state.isBusy = ref(false)
  }

  const files = ref([])
  const dnd = ref(false)

  const rootRef = ref(null)
  const inputRef = ref(null)

  provide(uploaderKey, renderInput)

  const {
    pickFiles,
    addFiles,
    onDragover,
    processFiles,
    getDndNode
  } = useFile(props, emit, editable, dnd, getFileInput, addFilesToQueue)

  const canAddFiles = computed(() =>
    editable.value === true &&
    state.isUploading.value !== true &&
    // if single selection and no files are queued:
    (props.multiple === true || state.queuedFiles.value.length === 0) &&
    // if max-files is set and current number of files does not exceeds it:
    (props.maxFiles === void 0 || files.value.length < props.maxFilesNumber) &&
    // if max-total-size is set and current upload size does not exceeds it:
    (props.maxTotalSize === void 0 || uploadSize.value < props.maxTotalSizeNumber)
  )

  const canUpload = computed(() =>
    editable.value === true &&
    state.isBusy.value !== true &&
    state.isUploading.value !== true &&
    state.queuedFiles.value.length > 0
  )

  const uploadProgress = computed(() =>
    uploadSize.value === 0
      ? 0
      : state.uploadedSize.value / uploadSize.value
  )

  const uploadProgressLabel = computed(() => getProgressLabel(uploadProgress.value))
  const uploadSizeLabel = computed(() => humanStorageSize(uploadSize.value))

  const classes = computed(() =>
    'q-uploader column no-wrap' +
    (isDark.value === true ? ' q-uploader--dark q-dark' : '') +
    (props.bordered === true ? ' q-uploader--bordered' : '') +
    (props.square === true ? ' q-uploader--square no-border-radius' : '') +
    (props.flat === true ? ' q-uploader--flat no-shadow' : '') +
    (props.disable === true ? ' disabled q-uploader--disable' : '')
  )

  const colorClass = computed(() =>
    'q-uploader__header' +
    (props.color !== void 0 ? ` bg-${props.color}` : '') +
    (props.textColor !== void 0 ? ` text-${props.textColor}` : '')
  )

  watch(state.isUploading, (newVal, oldVal) => {
    if (oldVal === false && newVal === true) {
      emit('start')
    }
    else if (oldVal === true && newVal === false) {
      emit('finish')
    }
  })

  function reset () {
    if (props.disable === false) {
      state.abort()
      state.uploadedSize.value = 0
      uploadSize.value = 0
      revokeImgURLs()
      files.value = []
      state.queuedFiles.value = []
      state.uploadedFiles.value = []
    }
  }

  function removeUploadedFiles () {
    if (props.disable === false) {
      batchRemoveFiles(['uploaded'], () => {
        state.uploadedFiles.value = []
      })
    }
  }

  function removeQueuedFiles () {
    batchRemoveFiles([ 'idle', 'failed' ], ({ size }) => {
      uploadSize.value -= size
      state.queuedFiles.value = []
    })
  }

  function batchRemoveFiles (statusList, cb) {
    if (props.disable === true) {
      return
    }

    const removed = {
      files: [],
      size: 0
    }

    const localFiles = files.value.filter(f => {
      if (statusList.indexOf(f.__status) === -1) {
        return true
      }

      removed.size += f.size
      removed.files.push(f)

      f._img !== void 0 && window.URL.revokeObjectURL(f._img.src)

      return false
    })

    if (removed.files.length > 0) {
      files.value = localFiles
      cb(removed)
      emit('removed', removed.files)
    }
  }

  function removeFile (file) {
    if (props.disable) { return }

    if (file.__status === 'uploaded') {
      state.uploadedFiles.value = state.uploadedFiles.value.filter(f => f.name !== file.name)
    }
    else if (file.__status === 'uploading') {
      file.__abort()
    }
    else {
      uploadSize.value -= file.size
    }

    files.value = files.value.filter(f => {
      if (f.name !== file.name) {
        return true
      }

      f._img !== void 0 && window.URL.revokeObjectURL(f._img.src)

      return false
    })
    state.queuedFiles.value = state.queuedFiles.value.filter(f => f.name !== file.name)
    emit('removed', [file])
  }

  function revokeImgURLs () {
    files.value.forEach(f => {
      f._img !== void 0 && window.URL.revokeObjectURL(f._img.src)
    })
  }

  function getFileInput () {
    return inputRef.value ||
      rootRef.value.getElementsByClassName('q-uploader__input')[ 0 ]
  }

  function addFilesToQueue (e, fileList) {
    const processedFiles = processFiles(e, fileList, files.value, true)

    if (processedFiles === void 0) { return }

    const localFiles = processedFiles
      .filter(file => files.value.findIndex(f => file.name === f.name) === -1)

    getFileInput().value = ''

    if (localFiles === void 0) { return }

    localFiles.forEach(file => {
      state.updateFileStatus(file, 'idle')
      uploadSize.value += file.size

      if (props.noThumbnails !== true && file.type.toUpperCase().startsWith('IMAGE')) {
        const img = new Image()
        img.src = window.URL.createObjectURL(file)
        file.__img = img
      }
    })

    files.value = files.value.concat(localFiles)
    state.queuedFiles.value = state.queuedFiles.value.concat(localFiles)
    emit('added', localFiles)
    props.autoUpload === true && state.upload()
  }

  function upload () {
    canUpload.value === true && state.upload()
  }

  function getBtn (show, icon, fn) {
    if (show === true) {
      const data = {
        type: 'a',
        key: icon,
        icon: $q.iconSet.uploader[ icon ],
        flat: true,
        dense: true
      }

      let child = void 0

      if (icon === 'add') {
        child = renderInput
      }
      else {
        data.onClick = fn
      }

      return h(QBtn, data, child)
    }
  }

  function renderInput () {
    return h('input', {
      ref: inputRef,
      class: 'q-uploader__input overflow-hidden absolute-full',
      tabindex: -1,
      type: 'file',
      title: '', // try to remove default tooltip
      accept: props.accept,
      multiple: props.multiple === true ? 'multiple' : void 0,
      capture: props.capture,
      onMousedown: stop, // need to stop refocus from QBtn
      onChange: addFilesToQueue
    })
  }

  function getHeader () {
    if (slots.header !== void 0) {
      return slots.header(slotScope.value)
    }

    return [
      h('div', {
        class: 'q-uploader__header-content flex flex-center no-wrap q-gutter-xs'
      }, [
        getBtn(state.queuedFiles.value.length > 0, 'removeQueue', removeQueuedFiles),
        getBtn(state.uploadedFiles.value.length > 0, 'removeUploaded', removeUploadedFiles),

        state.isUploading.value === true
          ? h(QSpinner, { class: 'q-uploader__spinner' })
          : null,

        h('div', { class: 'col column justify-center' }, [
          props.label !== void 0
            ? h('div', { class: 'q-uploader__title' }, [props.label])
            : null,

          h('div', { class: 'q-uploader__subtitle' }, [
            uploadSizeLabel.value + ' / ' + uploadProgressLabel.value
          ])
        ]),

        getBtn(canAddFiles.value, 'add'),
        getBtn(props.hideUploadBtn === false && canUpload.value === true, 'upload', state.upload),
        getBtn(state.isUploading.value, 'clear', state.abort)
      ])
    ]
  }

  function getList () {
    if (slots.list !== void 0) {
      return slots.list(slotScope.value)
    }

    return files.value.map(file => h('div', {
      key: file.name,
      class: 'q-uploader__file relative-position' +
        (props.noThumbnails !== true && file.__img !== void 0 ? ' q-uploader__file--img' : '') +
        (
          file.__status === 'failed'
            ? ' q-uploader__file--failed'
            : (file.__status === 'uploaded' ? ' q-uploader__file--uploaded' : '')
        ),
      style: props.noThumbnails !== true && file.__img !== void 0
        ? { backgroundImage: 'url("' + file.__img.src + '")' }
        : null
    }, [
      h('div', {
        class: 'q-uploader__file-header row flex-center no-wrap'
      }, [
        file.__status === 'failed'
          ? h(QIcon, {
              class: 'q-uploader__file-status',
              name: $q.iconSet.type.negative,
              color: 'negative'
            })
          : null,

        h('div', { class: 'q-uploader__file-header-content col' }, [
          h('div', { class: 'q-uploader__title' }, [file.name]),
          h('div', {
            class: 'q-uploader__subtitle row items-center no-wrap'
          }, [
            file.__sizeLabel + ' / ' + file.__progressLabel
          ])
        ]),

        file.__status === 'uploading'
          ? h(QCircularProgress, {
              value: file.__progress,
              min: 0,
              max: 1,
              indeterminate: file.__progress === 0
            })
          : h(QBtn, {
            round: true,
            dense: true,
            flat: true,
            icon: $q.iconSet.uploader[ file.__status === 'uploaded' ? 'done' : 'clear' ],
            onClick: () => { removeFile(file) }
          })
      ])
    ]))
  }

  onBeforeUnmount(() => {
    state.isUploading.value === true && state.abort()
    files.value.length > 0 && revokeImgURLs()
  })

  const publicMethods = {
    pickFiles,
    addFiles,
    reset,
    removeUploadedFiles,
    removeQueuedFiles,
    removeFile,
    upload
  }

  const slotScope = computed(() => {
    const acc = {
      canAddFiles: canAddFiles.value,
      canUpload: canUpload.value,
      uploadSizeLabel: uploadSizeLabel.value,
      uploadProgressLabel: uploadProgressLabel.value
    }

    Object.keys(state).forEach(key => {
      acc[ key ] = isRef(state[ key ]) === true
        ? state[ key ].value
        : state[ key ]
    })
    return { ...acc, ...publicMethods }
  })

  // expose public methods
  Object.assign(vm.proxy, publicMethods)

  return {
    renderUploader: () => {
      const children = [
        h('div', { class: colorClass.value }, getHeader()),
        h('div', { class: 'q-uploader__list scroll' }, getList()),
        getDndNode('uploader')
      ]

      state.isBusy.value === true && children.push(
        h('div', {
          class: 'q-uploader__overlay absolute-full flex flex-center'
        }, [h(QSpinner)])
      )

      const data = { ref: rootRef, class: classes.value }

      if (canAddFiles.value === true) {
        data.onDragover = onDragover
      }

      return h('div', data, children)
    }
  }
}

export default {
  props,
  emits,
  getState,
  getRender
}
