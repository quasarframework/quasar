<template>
  <div class="q-uploader">
    <input
      type="file"
      ref="file"
      :accept="extensions"
      :multiple="multiple"
      @change="__add"
    >

    <div v-if="uploading">
      <span class="chip label bg-light q-uploader-progress">
        <span v-html="computedLabel.uploading"></span>
        <q-spinner :size="15"></q-spinner>
        {{ progress }}%
      </span>
    </div>
    <div v-else class="group">
      <slot
        :pick="__pick"
        :upload="upload"
        :upload-disabled="files.length === 0"
      >
        <q-btn
          :class="buttonClass"
          v-html="computedLabel.add"
          @click="__pick"
          :disabled="addButtonDisabled"
        ></q-btn>
        <q-btn
          v-if="!hideUploadButton"
          :class="buttonClass"
          :disabled="files.length === 0"
          v-html="computedLabel.upload"
          @click="upload"
        ></q-btn>
      </slot>
    </div>

    <div class="row wrap items-center group">
      <div v-for="img in images" :key="img.name" class="card">
        <div class="card-title">{{ img.name }}</div>
        <div class="card-media">
          <img :src="img.src">
        </div>
        <div class="card-content">
          <div class="row items-center">
            <span class="text-faded">{{ img.__file.__size }}</span>
            <div class="auto"></div>
            <q-btn
              v-show="!uploading"
              class="primary clear small"
              @click="__remove(img.name)"
              v-html="computedLabel.remove"
            ></q-btn>
          </div>
        </div>
        <q-progress v-if="img.__file.__progress" :percentage="img.__file.__progress"></q-progress>
        <div v-if="img.__file.__failed" class="q-uploader-failed" v-html="computedLabel.failed"></div>
      </div>

      <div v-for="file in otherFiles" :key="file.name" class="card">
        <div class="card-title">{{ file.name }}</div>
        <div class="card-content">
          <div class="row items-center">
            <span class="text-faded">{{ file.__size }}</span>
            <div class="auto"></div>
            <q-btn
              v-show="!uploading"
              class="primary clear small"
              @click="__remove(file.name)"
              v-html="computedLabel.remove"
            ></q-btn>
          </div>
        </div>
        <q-progress v-if="file.__progress" :percentage="file.__progress"></q-progress>
        <div v-if="file.__failed" class="q-uploader-failed" v-html="computedLabel.failed"></div>
      </div>
    </div>
  </div>
</template>

<script>
import extend from '../../utils/extend'
import { humanStorageSize } from '../../utils/format'
import { QBtn } from '../btn'
import { QProgress } from '../progress'
import { QSpinner } from '../spinner'

export default {
  name: 'q-uploader',
  components: {
    QBtn,
    QProgress,
    QSpinner
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
    buttonClass: {
      type: String,
      default: 'primary'
    },
    labels: {
      type: Object,
      default () {
        return {}
      }
    },
    method: {
      type: String,
      default: 'POST'
    },
    extensions: String,
    multiple: Boolean,
    hideUploadButton: Boolean
  },
  data () {
    return {
      files: [],
      uploading: false,
      uploadedSize: 0,
      totalSize: 0,
      images: [],
      otherFiles: []
    }
  },
  computed: {
    progress () {
      return this.totalSize ? (this.uploadedSize / this.totalSize * 100).toFixed(2) : 0
    },
    computedLabel () {
      return extend({
        add: this.multiple ? '<i class="material-icons">add</i> Add Files' : '<i class="material-icons">add</i> Pick File',
        remove: '<i class="material-icons">clear</i> Remove',
        upload: '<i class="material-icons">file_upload</i> Upload',
        failed: '<i class="material-icons">warning</i> Failed',
        uploading: 'Uploading...'
      }, this.labels)
    },
    addButtonDisabled () {
      return !this.multiple && this.files.length >= 1
    }
  },
  methods: {
    __add (e) {
      if (!this.multiple && this.files.length >= 1) {
        return
      }

      let files = Array.prototype.slice.call(e.target.files)
      this.$emit('add', files)

      files = files
        .filter(file => !this.files.some(f => file.name === f.name))
        .map(file => {
          file.__failed = false
          file.__uploaded = 0
          file.__progress = 0
          file.__size = humanStorageSize(file.size)
          return file
        })

      files.filter(file => file.type.startsWith('image')).forEach((file, index) => {
        var reader = new FileReader()
        reader.onload = (e) => {
          let img = new Image()
          img.src = e.target.result
          img.name = file.name
          img.__file = file
          this.images.push(img)
        }
        reader.readAsDataURL(file)
      })
      this.otherFiles = this.otherFiles.concat(files.filter(file => !file.type.startsWith('image')))
      this.files = this.files.concat(files)
      this.$refs.file.value = ''
    },
    __remove (name, done, response) {
      this.$emit(done ? 'upload' : 'remove', name, response)
      this.images = this.images.filter(file => file.name !== name)
      this.otherFiles = this.otherFiles.filter(file => file.name !== name)
      this.files = this.files.filter(file => file.name !== name)
    },
    __pick () {
      this.$refs.file.click()
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

      file.__uploaded = 0
      file.__progress = 0
      file.__failed = false
      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', e => {
          e.percent = e.total ? e.loaded / e.total : 0
          let uploaded = e.percent * file.size
          this.uploadedSize += uploaded - file.__uploaded
          file.__uploaded = uploaded
          file.__progress = parseInt(e.percent * 100, 10)
        }, false)

        xhr.onreadystatechange = () => {
          if (xhr.readyState < 4) {
            return
          }
          if (xhr.status && xhr.status < 400) {
            this.__remove(file.name, true, xhr.response)
            this.$emit('uploaded', file.name, xhr)
            resolve(file)
          }
          else {
            file.__failed = true
            this.$emit('fail', file.name, xhr)
            reject(xhr)
          }
        }

        xhr.onerror = () => {
          this.$emit('fail', file.name, xhr)
          reject(xhr)
        }

        xhr.open(this.method, this.url, true)
        if (this.headers) {
          Object.keys(this.headers).forEach(key => {
            xhr.setRequestHeader(key, this.headers[key])
          })
        }
        xhr.send(form)
      })
    },
    upload () {
      let filesDone = 0
      const length = this.files.length

      if (!length) {
        return
      }

      this.uploadedSize = 0
      this.totalSize = this.files.map(file => file.size).reduce((total, size) => total + size)
      this.uploading = true
      this.$emit('start')

      let solved = () => {
        filesDone++
        if (filesDone === length) {
          this.uploading = false
          this.$emit('finish')
        }
      }

      this.files.map(file => this.__getUploadPromise(file)).forEach(promise => {
        promise.then(solved).catch(solved)
      })
    }
  }
}
</script>
