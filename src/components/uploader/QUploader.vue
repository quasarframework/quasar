<template>
  <div class="q-uploader">
    <q-input-frame
      ref="input"
      class="no-margin"

      :prefix="prefix"
      :suffix="suffix"
      :stack-label="stackLabel"
      :float-label="floatLabel"
      :error="error"
      :disable="disable"
      inverted
      :before="before"
      :after="after"
      :color="color"
      :align="align"

      :length="length"
      additionalLength
    >
      <div
        class="col row items-center q-input-target"
        v-html="label"
      ></div>

      <q-spinner
        v-if="uploading"
        slot="control"
        size="24px"
        class="q-if-control"
      ></q-spinner>

      <q-icon
        v-if="uploading"
        slot="control"
        class="q-if-control"
        name="clear"
        @click="abort"
      ></q-icon>

      <q-icon
        v-if="!uploading"
        slot="control"
        name="add"
        class="q-uploader-pick-button q-if-control relative-position overflow-hidden"
        @click="__pick"
        :disabled="addDisabled"
      >
        <input
          type="file"
          ref="file"
          class="q-uploader-input absolute-full cursor-pointer"
          :accept="extensions"
          :multiple="multiple"
          @change="__add"
        >
      </q-icon>

      <q-icon
        v-if="!uploading"
        slot="control"
        name="cloud_upload"
        class="q-if-control"
        :disabled="length === 0"
        @click="upload"
      ></q-icon>
    </q-input-frame>

    <div class="q-uploader-files scroll">
      <div
        v-for="file in files"
        :key="file.name"
        class="q-uploader-file item"
      >
        <q-progress
          class="q-uploader-progress-bg absolute-full"
          :color="file.__failed ? 'negative' : 'grey'"
          :percentage="file.__progress"
        ></q-progress>
        <div class="q-uploader-progress-text absolute">
          {{ file.__progress }}%
        </div>

        <img v-if="file.__img" :src="file.__img.src">
        <div v-else class="item-primary">
          <q-icon :color="color" name="insert_drive_file"></q-icon>
        </div>
        <div class="item-content text">
          <div>{{ file.name }}</div>
          <div>{{ file.__size }}</div>
        </div>
        <div class="item-secondary">
          <q-icon
            class="cursor-pointer"
            :color="color"
            :name="file.__doneUploading ? 'done' : 'clear'"
            @click="__remove(file)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { QInputFrame } from '../input-frame'
import FrameMixin from '../input-frame/input-frame-mixin'
import { humanStorageSize } from '../../utils/format'
import { QSpinner } from '../spinner'
import { QIcon } from '../icon'
import { QProgress } from '../progress'

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
    QProgress
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
    noThumbnails: Boolean,

    color: {
      type: String,
      default: 'primary'
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
      focused: false
    }
  },
  computed: {
    length () {
      return this.queue.length
    },
    label () {
      const total = humanStorageSize(this.totalSize)
      return this.uploading
        ? `${(this.progress).toFixed(2)}% (${humanStorageSize(this.uploadedSize)} / ${total})`
        : `${this.length} (${total})`
    },
    progress () {
      return this.totalSize ? Math.min(99.99, this.uploadedSize / this.totalSize * 100) : 0
    },
    addDisabled () {
      return !this.multiple && this.length >= 1
    }
  },
  methods: {
    __add (e) {
      if (this.addDisabled) {
        return
      }

      let files = Array.prototype.slice.call(e.target.files)
      this.$refs.file.value = ''

      files = files
      .filter(file => !this.queue.some(f => file.name === f.name))
      .map(file => {
        initFile(file)
        file.__size = humanStorageSize(file.size)

        if (this.noThumbnails || !file.type.startsWith('image')) {
          this.queue.push(file)
        }
        else {
          var reader = new FileReader()
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

      this.files = this.files.concat(files)
      this.$emit('add', files)
      this.__computeTotalSize()
    },
    __computeTotalSize () {
      this.totalSize = this.length
        ? this.queue.map(f => f.size).reduce((total, size) => total + size)
        : 0
    },
    __remove (file) {
      console.log('__remove', file.name)
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
      var form = new FormData()
      var xhr = new XMLHttpRequest()

      try {
        form.append('Content-Type', file.type || 'application/octet-stream')
        form.append(this.name, file)
        this.additionalFields.forEach(field => {
          form.append(field.name, field.value)
        })
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

        xhr.open(this.method, this.url, true)
        if (this.headers) {
          Object.keys(this.headers).forEach(key => {
            xhr.setRequestHeader(key, this.headers[key])
          })
        }

        this.xhrs.push(xhr)
        xhr.send(form)
      })
    },
    upload () {
      const length = this.length
      if (length === 0) {
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
    }
  }
}
</script>
