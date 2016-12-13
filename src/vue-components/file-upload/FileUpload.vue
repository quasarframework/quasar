<template>
  <div class="q-file-upload">
    <div>
      <label class="upload-button">
        <input
          type="file"
          ref="file"
          @change="__openDialog"
          :accept="imageUpload ? '.gif,.jpg,.jpeg,.png' : ''"
          v-bind:multiple="multiple"
        >
        <q-state :active="uploading">
          <div slot="active">
            <spinner name="hourglass" :size="40" class="primary"></spinner>&nbsp;&nbsp;{{ uploadingText }}
          </div>
          <button :class="chooseClass" @click="__openFilePicker" >
            <i>{{ chooseIcon }}</i>
            {{ chooseLabel }}
          </button>
        </q-state>
      </label>

      <q-modal ref="dialog">
        <div class="row wrap" style="max-width: 400px">
          <div v-for="image in imagesList" class="thumbnail" >
            <img :src="image.src" class="portrait">
            <a @click="removeImage(image)"><i>clear</i></a>
          </div>
          <div v-if="!imageUpload" class="list">
            <div v-for="file in filesToUpload" class="item">
              <a @click="removeFile(file)"><i>clear</i></a>
              {{ file.name }}
            </div>
          </div>
        </div>
        <button :class="uploadClass" @click="uploadFiles" v-if="!uploading">
          <i>{{ uploadIcon }}</i>
          {{ uploadLabel }}
        </button>
        <button @click="$refs.dialog.close()">Close</button>
      </q-modal>
    </div>
  </div>
</template>
<script>
  export default{
    props: {
      imageUpload: { // if TRUE will accept only '.gif,.jpg,.jpeg,.png'
        type: Boolean,
        default: false
      },
      path: {
        type: String,
        required: true
      },
      jwt: { // To add 'Authorization' header
        type: String
      },
      chooseLabel: { // label for CHOOSE button
        type: String,
        default: 'Choose files'
      },
      chooseIcon: { // icon for CHOOSE button
        type: String,
        default: 'file_upload'
      },
      chooseClass: { // applied on CHOOSE button
        type: String,
        default: 'primary'
      },
      uploadLabel: { // label for UPLOAD button
        type: String,
        default: 'Upload files'
      },
      uploadIcon: { // icon for UPLOAD button
        type: String,
        default: 'file_upload'
      },
      uploadClass: { // applied on UPLOAD button
        type: String,
        default: 'primary'
      },
      uploadingText: {
        type: String,
        default: 'Uploading...'
      },
      multiple: Boolean
    },
    data () {
      return {
        filesToUpload: [],
        uploading: false,
        imagesList: []
      }
    },
    computed: {
    },
    methods: {
      __filesSelected (e) {
        this.filesToUpload = e.target.files
      },
      __openFilePicker () {
        this.$refs.file.click()
      },
      __uploadHandler (file) {
        var formData = new FormData()
        var req = new XMLHttpRequest()
        try {
          formData.append('file', file)
        }
        catch (err) {
          this.$emit('fileError', file, err)
          return
        }

        return new Promise((resolve, reject) => {
          // TODO handle progress ?

          // use POST method and provided PATH
          req.open('POST', this.path, true)

          // handle 'req' status changes - https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
          req.onreadystatechange = () => {
            if (req.readyState < 4) { // until DONE promise not resolved or rejected
              return
            }
            if (req.status < 400) { // if no error
//              let res = JSON.parse(req.responseText)
              resolve(file)
            }
            else {
              let err = JSON.parse(req.responseText)
              err.status = req.status
              err.statusText = req.statusText
              reject(err)
            }
          }

          // handle 'req' errors
          req.onerror = () => {
            let err = JSON.parse(req.responseText)
            err.status = req.status
            err.statusText = req.statusText
            reject(err)
          }

          // handle JWT separately as common for SPA
          if (this.jwt) {
            req.setRequestHeader('Authorization', this.jwt)
          }

          // custom headers
          if (this.headers) {
            for (var header in this.headers) {
              req.setRequestHeader(header, this.headers[header])
            }
          }

          // send 'req'
          req.send(formData)
        })
      },
      uploadFiles () {
        if (this.filesToUpload.length) {
          this.uploading = true
          let promisesOfFilesUpload = Array.prototype.slice.call(this.filesToUpload, 0).map((file) => {
            return this.__uploadHandler(file)
          })

          // Resolve promises for every file's upload.
          // Ref https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
          Promise.all(promisesOfFilesUpload).then((files) => {
            console.log(files)
            this.uploading = false
          })
            .catch((err) => {
              console.log('error: ', err)
              this.uploading = false
            })
        }
        else {
          console.log('No files choosen')
        }
      },
      __openDialog (e) {
        this.filesToUpload = Array.prototype.slice.call(e.target.files, 0)
        if (this.imageUpload) {
          this.imagesList = []
          Array.prototype.slice.call(this.filesToUpload).forEach((image, index) => {
            var reader = new FileReader()
            reader.onload = (e) => {
              let temp = new Image()
              temp.src = e.target.result
              temp.id = index
              temp.file = image
              this.imagesList.push(temp)
            }
            reader.readAsDataURL(image)
          })
        }
        this.$refs.dialog.open()
      },
      removeImage (image) { // handling removing IMAGE from list if imageUpload === true
        let iImage = this.imagesList.indexOf(image)
        let iFile = this.filesToUpload.indexOf(image.file)
        this.imagesList.splice(iImage, 1)
        this.filesToUpload.splice(iFile, 1)
        if (!this.imagesList.length) {
          this.$refs.dialog.close()
        }
      },
      removeFile (file) {
        let iFile = this.filesToUpload.indexOf(file.file)
        this.filesToUpload.splice(iFile, 1)
        if (!this.filesToUpload.length) {
          this.$refs.dialog.close()
        }
      }
    }
  }
</script>
