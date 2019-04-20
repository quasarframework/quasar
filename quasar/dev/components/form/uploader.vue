<template>
  <div>
    <div class="q-layout-padding" :class="`bg-${dark ? 'black' : 'white'}${dark ? ' text-white' : ''}`">
      <div class="q-gutter-sm q-mb-md">
        <q-toggle v-model="dark" :dark="dark" label="Dark" />
        <q-toggle v-model="square" :dark="dark" label="Square" />
        <q-toggle v-model="flat" :dark="dark" label="Flat" />
        <q-toggle v-model="bordered" :dark="dark" label="Bordered" />
        <q-toggle v-model="autoUpload" :dark="dark" label="Auto Upload" />
        <q-toggle v-model="batch" :dark="dark" label="Batch" />
        <q-toggle v-model="noThumbnails" :dark="dark" label="No Thumbnails" />
        <q-toggle v-model="label" :dark="dark" label="Label" />
        <q-toggle v-model="readonly" :dark="dark" label="Readonly (cannot upload)" />
        <q-toggle v-model="disable" :dark="dark" label="Disable" />
      </div>

      <div class="text-h6 q-my-md">
        Run "yarn dev:quploader" / "npm run dev:quploader"
      </div>

      <div class="q-gutter-sm">
        <q-uploader
          v-bind="props"
          multiple
          :form-fields="[{name: 'my-field', value: 'my-value'}]"
          url="http://localhost:4444/upload"
          @added="onAdded"
          @removed="onRemoved"
        />

        <q-uploader
          :dark="dark"
          label="Fn returning immediately"
          multiple
          :factory="files => ({ url: 'http://localhost:4444/upload' })"
        />

        <q-uploader
          :dark="dark"
          label="Fn returning promise"
          multiple
          :factory="promiseFn"
        />

        <q-uploader
          :dark="dark"
          label="Fn returning promise - reject"
          multiple
          :factory="rejectFn"
        />

        <q-uploader v-bind="props" multiple url="http://localhost:4444/upload">
          <template v-slot:header="scope">
            <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
              <q-btn v-if="scope.queuedFiles.length > 0" icon="clear_all" @click="scope.removeQueuedFiles" round dense flat />
              <q-btn v-if="scope.uploadedFiles.length > 0" icon="done_all" @click="scope.removeUploadedFiles" round dense flat />
              <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
              <div class="col">
                <div class="q-uploader__title">
                  Upload your files
                </div>
                <div class="q-uploader__subtitle">
                  {{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}
                </div>
              </div>
              <q-btn v-if="scope.editable" icon="add_box" @click="scope.pickFiles" round dense flat />
              <q-btn v-if="scope.editable && scope.queuedFiles.length > 0" icon="cloud_upload" @click="scope.upload" round dense flat />

              <q-btn v-if="scope.editable && scope.isUploading" icon="clear" @click="scope.abort" round dense flat />
            </div>
          </template>
        </q-uploader>
        <q-uploader v-bind="props" color="yellow" text-color="black" multiple url="http://localhost:4444/upload" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dark: false,
      square: false,
      flat: false,
      bordered: false,

      autoUpload: false,
      batch: true,
      noThumbnails: false,
      label: true,

      readonly: false,
      disable: false
    }
  },

  computed: {
    props () {
      return {
        dark: this.dark,
        square: this.square,
        flat: this.flat,
        bordered: this.bordered,

        autoUpload: this.autoUpload,
        batch: this.batch,
        noThumbnails: this.noThumbnails,
        label: this.label ? 'Upload files' : null,

        readonly: this.readonly,
        disable: this.disable
      }
    }
  },

  methods: {
    onChange (val) {
      console.log('@change', JSON.stringify(val))
    },
    onInput (val) {
      console.log('@input', JSON.stringify(val))
    },
    onAdded (files) {
      console.log(`@added ${files.length || 0} files`)
      console.log(files)
    },
    onRemoved (files) {
      console.log(`@removed ${files.length || 0} files`)
      console.log(files)
    },
    promiseFn (files) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            url: 'http://localhost:4444/upload'
          })
        }, 2000)
      })
    },
    rejectFn (files) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('Failed to solve promise - Test'))
        }, 2000)
      })
    }
  }
}
</script>
