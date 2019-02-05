<template>
  <div class="q-pa-md">
    <q-uploader
      url="http://localhost:4444/upload"
      label="Custom header"
      multiple
    >
      <div slot="header" slot-scope="scope" class="row no-wrap items-center q-pa-sm q-gutter-xs">
        <q-btn v-if="scope.queuedFiles.length > 0" icon="clear_all" @click="scope.removeQueuedFiles" round dense flat >
          <q-tooltip>Clear All</q-tooltip>
        </q-btn>
        <q-btn v-if="scope.uploadedFiles.length > 0" icon="done_all" @click="scope.removeUploadedFiles" round dense flat >
          <q-tooltip>Remove Uploaded Files</q-tooltip>
        </q-btn>
        <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
        <div class="col">
          <div class="q-uploader__title">Upload your files</div>
          <div class="q-uploader__subtitle">{{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}</div>
        </div>
        <q-btn v-if="scope.editable" icon="add_box" @click="scope.pickFiles" round dense flat >
          <q-tooltip>Pick Files</q-tooltip>
        </q-btn>
        <q-btn v-if="scope.editable && scope.queuedFiles.length > 0" icon="cloud_upload" @click="scope.upload" round dense flat >
          <q-tooltip>Upload Files</q-tooltip>
        </q-btn>

        <q-btn v-if="scope.editable && scope.isUploading" icon="clear" @click="scope.abort" round dense flat >
          <q-tooltip>Abort Upload</q-tooltip>
        </q-btn>
      </div>
    </q-uploader>
  </div>
</template>
