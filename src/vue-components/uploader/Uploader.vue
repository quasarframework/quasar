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
        <span v-html="computedLabel.uploading"></span> <spinner :size="15"></spinner> {{ progress }}%
      </span>
    </div>
    <div v-else class="group">
      <button
        :class="buttonClass"
        v-html="computedLabel.add"
        @click="$refs.file.click()"
        :disabled="addButtonDisabled"
      ></button>
      <button
        v-if="!hideUploadButton"
        :class="buttonClass"
        :disabled="files.length === 0"
        v-html="computedLabel.upload"
        @click="upload"
      ></button>
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
            <button
              v-show="!uploading"
              class="primary clear small"
              @click="__remove(img.name)"
              v-html="computedLabel.remove"
            ></button>
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
            <button
              v-show="!uploading"
              class="primary clear small"
              @click="__remove(file.name)"
              v-html="computedLabel.remove"
            ></button>
          </div>
        </div>
        <q-progress v-if="file.__progress" :percentage="file.__progress"></q-progress>
        <div v-if="file.__failed" class="q-uploader-failed" v-html="computedLabel.failed"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Utils from '../../utils'

export default {
  props: {
    headers: Object,
    url: {
      type: String,
      required: true
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
      return Utils.extend({
        add: this.multiple ? '<i>add</i> Add Files' : '<i>add</i> Pick File',
        remove: '<i>clear</i> Remove',
        upload: '<i>file_upload</i> Upload',
        failed: '<i>warning</i> Failed',
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
          file.__size = Utils.format.humanStorageSize(file.size)
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
    },
    __remove (name, done) {
      this.$emit(done ? 'upload' : 'remove', name)
      this.images = this.images.filter(file => file.name !== name)
      this.otherFiles = this.otherFiles.filter(file => file.name !== name)
      this.files = this.files.filter(file => file.name !== name)
    },
    __getUploadPromise (file) {
      var form = new FormData()
      var xhr = new XMLHttpRequest()

      try {
        form.append('Content-Type', file.type || 'application/octet-stream')
        form.append('file', file)
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
            this.__remove(file.name, true)
            resolve(file)
          }
          else {
            file.__failed = true
            reject(xhr)
          }
        }

        xhr.onerror = () => {
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
