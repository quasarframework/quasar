<template>
  <div
    class="q-uploader relative-position"
    @dragover.prevent.stop="__onDragOver"
  >
    <q-input-frame
      ref="input"
      class="no-margin"

      :prefix="prefix"
      :suffix="suffix"
      :stack-label="stackLabel"
      :float-label="floatLabel"
      :error="error"
      :disable="disable"
      :before="before"
      :after="after"
      :color="color"
      :align="align"
      :inverted="inverted"

      :length="queueLength"
      additional-length
    >
      <div
        class="col row items-center q-input-target"
        v-html="label"
      ></div>

      <q-spinner
        v-if="uploading"
        slot="after"
        size="24px"
        class="q-if-control"
      ></q-spinner>

      <q-icon
        v-if="uploading"
        slot="after"
        class="q-if-control"
        :name="$q.icon.uploader.clear"
        @click="abort"
      ></q-icon>

      <q-icon
        v-if="!uploading"
        slot="after"
        :name="$q.icon.uploader.add"
        class="q-uploader-pick-button q-if-control relative-position overflow-hidden"
        @click="__pick"
        :disabled="addDisabled"
      >
        <input
          type="file"
          ref="file"
          class="q-uploader-input absolute-full cursor-pointer"
          :accept="extensions"
          v-bind.prop="{multiple: multiple}"
          @change="__add"
        >
      </q-icon>

      <q-icon
        v-if="!hideUploadButton && !uploading"
        slot="after"
        :name="$q.icon.uploader.upload"
        class="q-if-control"
        :disabled="queueLength === 0"
        @click="upload"
      ></q-icon>

      <q-icon
        v-if="hasExpandedContent"
        slot="after"
        :name="$q.icon.uploader.expand"
        class="q-if-control generic_transition"
        :class="{'rotate-180': expanded}"
        @click="expanded = !expanded"
      ></q-icon>
    </q-input-frame>

    <q-slide-transition>
      <div v-show="expanded">
        <div class="q-uploader-files scroll" :style="filesStyle">
          <q-item
            v-for="file in files"
            :key="file.name"
            class="q-uploader-file"
          >
            <q-progress v-if="!hideUploadProgress"
              class="q-uploader-progress-bg absolute-full"
              :color="file.__failed ? 'negative' : 'grey'"
              :percentage="file.__progress"
            ></q-progress>
            <div class="q-uploader-progress-text absolute" v-if="!hideUploadProgress">
              {{ file.__progress }}%
            </div>

            <q-item-side v-if="file.__img" :image="file.__img.src"></q-item-side>
            <q-item-side v-else :icon="$q.icon.uploader.file" :color="color"></q-item-side>

            <q-item-main :label="file.name" :sublabel="file.__size"></q-item-main>

            <q-item-side right>
              <q-item-tile
                :icon="$q.icon.uploader[file.__doneUploading ? 'done' : 'clear']"
                :color="color"
                class="cursor-pointer"
                @click="__remove(file)"
              ></q-item-tile>
            </q-item-side>
          </q-item>
        </div>
      </div>
    </q-slide-transition>

    <div
      v-if="dnd"
      class="q-uploader-dnd flex row items-center justify-center absolute-full"
      :class="dndClass"
      @dragenter.prevent.stop
      @dragover.prevent.stop
      @dragleave.prevent.stop="__onDragLeave"
      @drop.prevent.stop="__onDrop"
    ></div>
  </div>
</template>

<script>
import { QInputFrame } from '../input-frame'
import FrameMixin from '../../mixins/input-frame'
import { humanStorageSize } from '../../utils/format'
import { QSpinner } from '../spinner'
import { QIcon } from '../icon'
import { QProgress } from '../progress'
import { QItem, QItemSide, QItemMain, QItemTile } from '../list'
import { QSlideTransition } from '../slide-transition'

function initFile (file) {
  file.__doneUploading = false
  file.__failed = false
  file.__uploaded = 0
  file.__progress = 0
}

export default {
  name: 'q-uploader',
  mixins: [FrameMixin],
  components: {
    QInputFrame,
    QSpinner,
    QIcon,
    QProgress,
    QItem,
    QItemSide,
    QItemMain,
    QItemTile,
    QSlideTransition
  },
  props: {
    name: {
      type: String,
      default: 'file'
    },
    headers: Object,
    url: {
      type: String,
      required: true
    },
    urlFactory: {
      type: Function,
      required: false
    },
    additionalFields: {
      type: Array,
      default: () => []
    },
    method: {
      type: String,
      default: 'POST'
    },
    extensions: String,
    multiple: Boolean,
    hideUploadButton: Boolean,
    hideUploadProgress: Boolean,
    noThumbnails: Boolean,
    autoExpand: Boolean,
    expandStyle: [Array, String, Object],
    expandClass: [Array, String, Object],
    sendRaw: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      queue: [],
      files: [],
      uploading: false,
      uploadedSize: 0,
      totalSize: 0,
      xhrs: [],
      focused: false,
      dnd: false,
      expanded: false
    }
  },
  computed: {
    queueLength () {
      return this.queue.length
    },
    hasExpandedContent () {
      return this.files.length > 0
    },
    label () {
      const total = humanStorageSize(this.totalSize)
      return this.uploading
        ? `${(this.progress).toFixed(2)}% (${humanStorageSize(this.uploadedSize)} / ${total})`
        : `${this.queueLength} (${total})`
    },
    progress () {
      return this.totalSize ? Math.min(99.99, this.uploadedSize / this.totalSize * 100) : 0
    },
    addDisabled () {
      return !this.multiple && this.queueLength >= 1
    },
    filesStyle () {
      if (this.maxHeight) {
        return { maxHeight: this.maxHeight }
      }
    },
    dndClass () {
      const cls = [`text-${this.color}`]
      if (this.inverted) {
        cls.push('inverted')
      }
      return cls
    }
  },
  watch: {
    hasExpandedContent (v) {
      if (v === false) {
        this.expanded = false
      }
      else if (this.autoExpand) {
        this.expanded = true
      }
    }
  },
  methods: {
    __onDragOver () {
      this.dnd = true
    },
    __onDragLeave () {
      this.dnd = false
    },
    __onDrop (e) {
      this.dnd = false

      const
        files = e.dataTransfer.files,
        count = files.length

      if (count > 0) {
        this.__add(null, this.multiple ? files : [ files[0] ])
      }
    },
    __add (e, files) {
      if (this.addDisabled) {
        return
      }

      files = Array.prototype.slice.call(files || e.target.files)
      this.$refs.file.value = ''

      files = files.filter(file => !this.queue.some(f => file.name === f.name))
        .map(file => {
          initFile(file)
          file.__size = humanStorageSize(file.size)

          if (this.noThumbnails || !file.type.startsWith('image')) {
            this.queue.push(file)
          }
          else {
            const reader = new FileReader()
            reader.onload = (e) => {
              let img = new Image()
              img.src = e.target.result
              file.__img = img
              this.queue.push(file)
              this.__computeTotalSize()
            }
            reader.readAsDataURL(file)
          }

          return file
        })

      if (files.length > 0) {
        this.files = this.files.concat(files)
        this.$emit('add', files)
        this.__computeTotalSize()
      }
    },
    __computeTotalSize () {
      this.totalSize = this.queueLength
        ? this.queue.map(f => f.size).reduce((total, size) => total + size)
        : 0
    },
    __remove (file) {
      const
        name = file.name,
        done = file.__doneUploading

      if (this.uploading && !done) {
        this.$emit('remove:abort', file, file.xhr)
        file.xhr.abort()
        this.uploadedSize -= file.__uploaded
      }
      else {
        this.$emit(`remove:${done ? 'done' : 'cancel'}`, file, file.xhr)
      }

      if (!done) {
        this.queue = this.queue.filter(obj => obj.name !== name)
      }

      file.__removed = true
      this.files = this.files.filter(obj => obj.name !== name)
      this.__computeTotalSize()
    },
    __removeUploaded () {
      this.files = this.files.filter(f => !f.__doneUploading)
      this.__computeTotalSize()
    },
    __pick () {
      if (!this.addDisabled && this.$q.platform.is.mozilla) {
        this.$refs.file.click()
      }
    },
    __getUploadPromise (file) {
      const
        form = new FormData(),
        xhr = new XMLHttpRequest()

      try {
        this.additionalFields.forEach(field => {
          form.append(field.name, field.value)
        })
        form.append('Content-Type', file.type || 'application/octet-stream')
        form.append(this.name, file)
      }
      catch (e) {
        return
      }

      initFile(file)
      file.xhr = xhr
      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', e => {
          if (file.__removed) { return }
          e.percent = e.total ? e.loaded / e.total : 0
          let uploaded = e.percent * file.size
          this.uploadedSize += uploaded - file.__uploaded
          file.__uploaded = uploaded
          file.__progress = Math.min(99, parseInt(e.percent * 100, 10))
        }, false)

        xhr.onreadystatechange = () => {
          if (xhr.readyState < 4) {
            return
          }
          if (xhr.status && xhr.status < 400) {
            file.__doneUploading = true
            file.__progress = 100
            this.$emit('uploaded', file, xhr)
            resolve(file)
          }
          else {
            file.__failed = true
            this.$emit('fail', file, xhr)
            reject(xhr)
          }
        }

        xhr.onerror = () => {
          file.__failed = true
          this.$emit('fail', file, xhr)
          reject(xhr)
        }

        const resolver = this.urlFactory
          ? this.urlFactory(file)
          : Promise.resolve(this.url)

        resolver.then(url => {
          xhr.open(this.method, url, true)
          if (this.headers) {
            Object.keys(this.headers).forEach(key => {
              xhr.setRequestHeader(key, this.headers[key])
            })
          }

          this.xhrs.push(xhr)
          if (this.sendRaw) {
            xhr.send(file)
          }
          else {
            xhr.send(form)
          }
        })
      })
    },
    upload () {
      const length = this.queueLength
      if (this.disable || length === 0) {
        return
      }

      let filesDone = 0
      this.uploadedSize = 0
      this.uploading = true
      this.xhrs = []
      this.$emit('start')

      let solved = () => {
        filesDone++
        if (filesDone === length) {
          this.uploading = false
          this.xhrs = []
          this.queue = this.queue.filter(f => !f.__doneUploading)
          this.__computeTotalSize()
          this.$emit('finish')
        }
      }

      this.queue
        .map(file => this.__getUploadPromise(file))
        .forEach(promise => {
          promise.then(solved).catch(solved)
        })
    },
    abort () {
      this.xhrs.forEach(xhr => { xhr.abort() })
    },
    reset () {
      this.abort()
      this.files = []
      this.queue = []
      this.expanded = false
      this.__computeTotalSize()
      this.$emit('reset')
    }
  }
}
</script>
