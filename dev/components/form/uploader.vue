<template>
  <div>
    <div class="q-layout-padding" :class="`bg-${dark ? 'black' : 'white'}${dark ? ' text-white' : ''}`">
      <div class="q-gutter-sm">
        <q-toggle v-model="dark" :dark="dark" label="Dark" />
        <q-toggle v-model="square" :dark="dark" label="Square" />
        <q-toggle v-model="flat" :dark="dark" label="Flat" />
        <q-toggle v-model="bordered" :dark="dark" label="Bordered" />
        <q-toggle v-model="inline" :dark="dark" label="Inline" />
        <q-toggle v-model="autoUpload" :dark="dark" label="Auto Upload" />
        <q-toggle v-model="xhrBatch" :dark="dark" label="XHR Batch" />
      </div>

      <div class="q-gutter-sm">
        <q-uploader v-bind="props" multiple xhr-url="http://localhost:4444/upload" />
        <q-uploader v-bind="props" multiple xhr-url="http://localhost:4444/upload">
          <div slot="header" slot-scope="scope" class="row no-wrap items-center q-gutter-xs">
            <q-btn v-if="scope.uploadedFiles.length > 0" icon="clear_all" @click="scope.removeUploadedFiles" round dense flat />
            <div class="col">
              {{ scope.uploadedSizeLabel }} / {{ scope.uploadSizeLabel }} ({{ scope.uploadProgressLabel }})
            </div>
            <q-btn icon="add_box" @click="scope.pickFiles" round dense flat />
            <q-btn v-if="scope.queuedFiles.length > 0" icon="cloud_upload" @click="scope.upload" round dense flat />

            <q-btn v-if="scope.isUploading" icon="clear" @click="scope.abort" round dense flat />
          </div>
        </q-uploader>
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
      inline: true,

      autoUpload: false,
      xhrBatch: true
    }
  },

  computed: {
    props () {
      return {
        dark: this.dark,
        square: this.square,
        flat: this.flat,
        bordered: this.bordered,
        inline: this.inline,

        autoUpload: this.autoUpload,
        xhrBatch: this.xhrBatch
      }
    }
  },

  methods: {
    onChange (val) {
      console.log('@change', JSON.stringify(val))
    },
    onInput (val) {
      console.log('@input', JSON.stringify(val))
    }
  }
}
</script>
