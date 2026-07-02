import {
  computed,
  getCurrentInstance,
  h,
  isRef,
  onBeforeUnmount,
  provide,
  ref,
  watch
} from 'vue'

import QBtn from '../btn/QBtn.js'
import QIcon from '../icon/QIcon.js'
import QSpinner from '../spinner/QSpinner.js'
import QCircularProgress from '../circular-progress/QCircularProgress.js'

import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'
import useFile, {
  useFileEmits,
  useFileProps
} from '../../composables/private.use-file/use-file.js'

import { stop } from '../../utils/event/event.js'
import { humanStorageSize } from '../../utils/format/format.js'
import { uploaderKey } from '../../utils/private.symbols/symbols.js'
import {
  injectMultipleProps,
  injectProp
} from '../../utils/private.inject-obj-prop/inject-obj-prop.js'
import { vmIsDestroyed } from '../../utils/private.vm/vm.js'

function getProgressLabel(p) {
  return (p * 100).toFixed(2) + '%'
}

export const coreProps = {
  ...useDarkProps,
  ...useFileProps,

  /**
   * Label for the uploader
   *
   * @api prop label
   * @type {String}
   * @category content
   * @example 'Upload photo here'
   */
  label: String,

  /**
   * Color name for component from the Quasar Color Palette
   *
   * @api prop color
   * @extends color
   */
  color: String,

  /**
   * Overrides text color, if needed
   *
   * @api prop text-color
   * @extends text-color
   */
  textColor: String,

  /**
   * Removes border-radius so borders are squared
   *
   * @api prop square
   * @extends square
   */
  square: Boolean,

  /**
   * Applies a 'flat' design
   *
   * @api prop flat
   * @extends flat
   */
  flat: Boolean,

  /**
   * Applies a default border to the component
   *
   * @api prop bordered
   * @extends bordered
   */
  bordered: Boolean,

  /**
   * Don't display thumbnails for image files
   *
   * @api prop no-thumbnails
   * @type {Boolean}
   * @category content
   */
  noThumbnails: Boolean,

  /**
   * How the thumbnail image will fit into the container
   *
   * @api prop thumbnail-fit
   * @type {String}
   * @default 'cover'
   * @category style
   * @added-in v2.17
   */
  thumbnailFit: {
    type: String,
    default: 'cover'
  },

  /**
   * Upload files immediately when added
   *
   * @api prop auto-upload
   * @type {Boolean}
   * @category behavior
   */
  autoUpload: Boolean,

  /**
   * Don't show the upload button
   *
   * @api prop hide-upload-btn
   * @type {Boolean}
   * @category behavior
   */
  hideUploadBtn: Boolean,

  /**
   * Put component in disabled mode
   *
   * @api prop disable
   * @extends disable
   */
  disable: Boolean,

  /**
   * Put component in readonly mode
   *
   * @api prop readonly
   * @extends readonly
   */
  readonly: Boolean
}

export const coreEmits = [
  ...useFileEmits,

  /**
   * Started working
   *
   * @api event start
   */
  'start',

  /**
   * Finished working
   *
   * @api event finish
   */
  'finish',

  /**
   * Emitted when files are added into the list
   *
   * @api event added
   * @param {Array} files Array of files that were added
   */
  'added',

  /**
   * Emitted when files are removed from the list
   *
   * @api event removed
   * @param {Array} files Array of files that were removed
   */
  'removed'
]

export function getRenderer(getPlugin, expose) {
  const vm = getCurrentInstance()
  const { props, slots, emit, proxy } = vm
  const { $q } = proxy

  const isDark = useDark(props, $q)

  /**
   * Update the status of a file
   *
   * @api method updateFileStatus
   * @param {File} file The file to update
   * @param {String} status Status of file
   * @param {Number} uploadedSize Number of uploaded bytes
   */
  function updateFileStatus(file, status, uploadedSize) {
    file.__status = status

    if (status === 'idle') {
      file.__uploaded = 0
      file.__progress = 0
      file.__sizeLabel = humanStorageSize(file.size)
      file.__progressLabel = '0.00%'
      return
    }
    if (status === 'failed') {
      proxy.$forceUpdate()
      return
    }

    file.__uploaded = status === 'uploaded' ? file.size : uploadedSize

    file.__progress =
      status === 'uploaded' ? 1 : Math.min(0.9999, file.__uploaded / file.size)

    file.__progressLabel = getProgressLabel(file.__progress)
    proxy.$forceUpdate()
  }

  const editable = computed(() => !props.disable && !props.readonly)
  const dnd = ref(false)

  const rootRef = ref(null)
  const inputRef = ref(null)

  const state = {
    files: ref([]),
    queuedFiles: ref([]),
    uploadedFiles: ref([]),
    uploadedSize: ref(0),

    updateFileStatus,
    /**
     * Is the component alive
     *
     * @api method isAlive
     * @returns {Boolean} If true, the current component is still activated and mounted
     */
    isAlive: () => !vmIsDestroyed(vm)
  }

  const {
    pickFiles,
    addFiles,
    onDragover,
    onDragleave,
    processFiles,
    getDndNode,
    maxFilesNumber,
    maxTotalSizeNumber
  } = useFile({ editable, dnd, getFileInput, addFilesToQueue })

  Object.assign(
    state,
    getPlugin({
      props,
      slots,
      emit,
      helpers: state,
      exposeApi: obj => {
        Object.assign(state, obj)
      }
    })
  )

  if (state.isBusy === void 0) {
    state.isBusy = ref(false)
  }

  const uploadSize = ref(0)
  const uploadProgress = computed(() =>
    uploadSize.value === 0 ? 0 : state.uploadedSize.value / uploadSize.value
  )
  const uploadProgressLabel = computed(() =>
    getProgressLabel(uploadProgress.value)
  )
  const uploadSizeLabel = computed(() => humanStorageSize(uploadSize.value))

  const canAddFiles = computed(
    () =>
      editable.value &&
      !state.isUploading.value &&
      // if single selection and no files are queued:
      (props.multiple || state.queuedFiles.value.length === 0) &&
      // if max-files is set and current number of files does not exceeds it:
      (props.maxFiles === void 0 ||
        state.files.value.length < maxFilesNumber.value) &&
      // if max-total-size is set and current upload size does not exceeds it:
      (props.maxTotalSize === void 0 ||
        uploadSize.value < maxTotalSizeNumber.value)
  )

  const canUpload = computed(
    () =>
      editable.value &&
      !state.isBusy.value &&
      !state.isUploading.value &&
      state.queuedFiles.value.length !== 0
  )

  provide(uploaderKey, renderInput)

  const classes = computed(
    () =>
      'q-uploader column no-wrap' +
      (isDark.value ? ' q-uploader--dark q-dark' : '') +
      (props.bordered ? ' q-uploader--bordered' : '') +
      (props.square ? ' q-uploader--square no-border-radius' : '') +
      (props.flat ? ' q-uploader--flat no-shadow' : '') +
      (props.disable ? ' disabled q-uploader--disable' : '') +
      (dnd.value ? ' q-uploader--dnd' : '')
  )

  const colorClass = computed(
    () =>
      'q-uploader__header' +
      (props.color !== void 0 ? ` bg-${props.color}` : '') +
      (props.textColor !== void 0 ? ` text-${props.textColor}` : '')
  )

  watch(state.isUploading, (newVal, oldVal) => {
    if (!oldVal && newVal) {
      emit('start')
    } else if (oldVal && !newVal) {
      emit('finish')
    }
  })

  /**
   * Resets uploader to default; Empties queue, aborts current uploads
   *
   * @api method reset
   */
  function reset() {
    if (!props.disable) {
      state.abort()
      state.uploadedSize.value = 0
      uploadSize.value = 0
      revokeImgURLs()
      state.files.value = []
      state.queuedFiles.value = []
      state.uploadedFiles.value = []
    }
  }

  /**
   * Removes already uploaded files from the list
   *
   * @api method removeUploadedFiles
   */
  function removeUploadedFiles() {
    if (!props.disable) {
      batchRemoveFiles(['uploaded'], () => {
        state.uploadedFiles.value = []
      })
    }
  }

  /**
   * Remove files that are waiting for upload to start
   *
   * @api method removeQueuedFiles
   */
  function removeQueuedFiles() {
    batchRemoveFiles(['idle', 'failed'], ({ size }) => {
      uploadSize.value -= size
      state.queuedFiles.value = []
    })
  }

  function batchRemoveFiles(statusList, cb) {
    if (props.disable) return

    const removed = {
      files: [],
      size: 0
    }

    const localFiles = state.files.value.filter(f => {
      if (!statusList.includes(f.__status)) return true

      removed.size += f.size
      removed.files.push(f)

      if (f.__img !== void 0) window.URL.revokeObjectURL(f.__img.src)

      return false
    })

    if (removed.files.length !== 0) {
      state.files.value = localFiles
      cb(removed)
      emit('removed', removed.files)
    }
  }

  /**
   * Remove specified file from the queue
   *
   * @api method removeFile
   * @param {File} file The file to remove
   */
  function removeFile(file) {
    if (props.disable) return

    if (file.__status === 'uploaded') {
      state.uploadedFiles.value = state.uploadedFiles.value.filter(
        f => f.__key !== file.__key
      )
    } else if (file.__status === 'uploading') {
      file.__abort()
    } else {
      uploadSize.value -= file.size
    }

    state.files.value = state.files.value.filter(f => {
      if (f.__key !== file.__key) {
        return true
      }

      if (f.__img !== void 0) window.URL.revokeObjectURL(f.__img.src)

      return false
    })

    state.queuedFiles.value = state.queuedFiles.value.filter(
      f => f.__key !== file.__key
    )
    emit('removed', [file])
  }

  function revokeImgURLs() {
    state.files.value.forEach(f => {
      if (f.__img !== void 0) window.URL.revokeObjectURL(f.__img.src)
    })
  }

  function getFileInput() {
    return (
      inputRef.value ||
      rootRef.value.getElementsByClassName('q-uploader__input')[0]
    )
  }

  function addFilesToQueue(e, fileList) {
    const localFiles = processFiles(e, fileList, state.files.value, true)
    const fileInput = getFileInput()

    if (fileInput !== void 0 && fileInput !== null) {
      fileInput.value = ''
    }

    if (localFiles === void 0) return

    localFiles.forEach(file => {
      state.updateFileStatus(file, 'idle')
      uploadSize.value += file.size

      if (!props.noThumbnails && file.type.toUpperCase().startsWith('IMAGE')) {
        const img = new Image()
        img.src = window.URL.createObjectURL(file)
        file.__img = img
      }
    })

    state.files.value.push(...localFiles)
    state.queuedFiles.value.push(...localFiles)
    emit('added', localFiles)
    if (props.autoUpload) state.upload()
  }

  /**
   * Start uploading
   *
   * @api method upload
   */
  function upload() {
    if (canUpload.value) state.upload()
  }

  function getBtn(show, icon, fn) {
    if (show) {
      const data = {
        type: 'a',
        key: icon,
        icon: $q.iconSet.uploader[icon],
        flat: true,
        dense: true
      }

      let child = void 0

      if (icon === 'add') {
        data.onClick = pickFiles
        child = renderInput
      } else {
        data.onClick = fn
      }

      return h(QBtn, data, child)
    }
  }

  function renderInput() {
    return h('input', {
      ref: inputRef,
      class: 'q-uploader__input overflow-hidden absolute-full',
      tabindex: -1,
      type: 'file',
      title: '', // try to remove default tooltip
      accept: props.accept,
      multiple: props.multiple ? 'multiple' : void 0,
      capture: props.capture,
      onMousedown: stop, // need to stop refocus from QBtn
      onClick: pickFiles,
      onChange: addFilesToQueue
    })
  }

  function getHeader() {
    if (slots.header !== void 0) {
      return slots.header(publicApi)
    }

    return [
      h(
        'div',
        {
          class: 'q-uploader__header-content column'
        },
        [
          h(
            'div',
            {
              class: 'flex flex-center no-wrap q-gutter-xs'
            },
            [
              getBtn(
                state.queuedFiles.value.length !== 0,
                'removeQueue',
                removeQueuedFiles
              ),
              getBtn(
                state.uploadedFiles.value.length !== 0,
                'removeUploaded',
                removeUploadedFiles
              ),

              state.isUploading.value
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
              getBtn(
                !props.hideUploadBtn && canUpload.value,
                'upload',
                state.upload
              ),
              getBtn(state.isUploading.value, 'clear', state.abort)
            ]
          )
        ]
      )
    ]
  }

  function getList() {
    if (slots.list !== void 0) {
      return slots.list(publicApi)
    }

    return state.files.value.map(file =>
      h(
        'div',
        {
          key: file.__key,
          class:
            'q-uploader__file relative-position' +
            (!props.noThumbnails && file.__img !== void 0
              ? ' q-uploader__file--img'
              : '') +
            (file.__status === 'failed'
              ? ' q-uploader__file--failed'
              : file.__status === 'uploaded'
                ? ' q-uploader__file--uploaded'
                : ''),
          style:
            !props.noThumbnails && file.__img !== void 0
              ? {
                  backgroundImage: 'url("' + file.__img.src + '")',
                  backgroundSize: props.thumbnailFit
                }
              : null
        },
        [
          h(
            'div',
            {
              class: 'q-uploader__file-header row flex-center no-wrap'
            },
            [
              file.__status === 'failed'
                ? h(QIcon, {
                    class: 'q-uploader__file-status',
                    name: $q.iconSet.type.negative,
                    color: 'negative'
                  })
                : null,

              h('div', { class: 'q-uploader__file-header-content col' }, [
                h('div', { class: 'q-uploader__title' }, [file.name]),
                h(
                  'div',
                  {
                    class: 'q-uploader__subtitle row items-center no-wrap'
                  },
                  [file.__sizeLabel + ' / ' + file.__progressLabel]
                )
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
                    icon: $q.iconSet.uploader[
                      file.__status === 'uploaded' ? 'done' : 'clear'
                    ],
                    onClick: () => {
                      removeFile(file)
                    }
                  })
            ]
          )
        ]
      )
    )
  }

  onBeforeUnmount(() => {
    if (state.isUploading.value) state.abort()
    if (state.files.value.length !== 0) revokeImgURLs()
  })

  const publicApi = {}

  for (const key in state) {
    if (isRef(state[key])) {
      injectProp(publicApi, key, () => state[key].value)
    } else {
      // method or non-computed prop
      publicApi[key] = state[key]
    }
  }

  Object.assign(publicApi, {
    upload,
    reset,
    removeUploadedFiles,
    removeQueuedFiles,
    removeFile,

    pickFiles,
    addFiles
  })

  injectMultipleProps(publicApi, {
    canAddFiles: () => canAddFiles.value,
    canUpload: () => canUpload.value,
    uploadSizeLabel: () => uploadSizeLabel.value,
    uploadProgressLabel: () => uploadProgressLabel.value
  })

  // expose public api (methods & computed props)
  expose({
    ...state,

    upload,
    reset,
    removeUploadedFiles,
    removeQueuedFiles,
    removeFile,

    pickFiles,
    addFiles,

    canAddFiles,
    canUpload,
    uploadSizeLabel,
    uploadProgressLabel
  })

  return () => {
    const children = [
      h('div', { class: colorClass.value }, getHeader()),
      h('div', { class: 'q-uploader__list scroll' }, getList()),
      getDndNode('uploader')
    ]

    if (state.isBusy.value) {
      children.push(
        h(
          'div',
          {
            class: 'q-uploader__overlay absolute-full flex flex-center'
          },
          [h(QSpinner)]
        )
      )
    }

    const data = { ref: rootRef, class: classes.value }

    if (canAddFiles.value) {
      Object.assign(data, { onDragover, onDragleave })
    }

    return h('div', data, children)
  }
}
